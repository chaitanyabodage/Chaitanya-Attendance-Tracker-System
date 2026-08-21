// React's type declarations are unavailable in the current project setup.
// @ts-nocheck -- suppress JSX runtime type resolution until React types are installed.
// @ts-ignore -- keep this file buildable until @types/react is installed.
import { useState, useEffect } from 'react';
import { Course, AttendanceRecord, DailySchedule, UserProfile } from './types';
import { DEFAULT_COURSES, DEFAULT_SCHEDULE, DEFAULT_RECORDS } from './data/defaultCourses';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import DailyLogger from './components/DailyLogger';
import CourseManager from './components/CourseManager';
import HistoryLog from './components/HistoryLog';
import ProfileView from './components/ProfileView';
import Footer from './components/Footer';
import LoginScreen from './components/LoginScreen';
import { auth, getUserDocument, syncUserDocument } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'loading' | 'synced' | 'saving' | 'error'>('loading');

  const createDefaultSchedule = (): DailySchedule[] => [0, 1, 2, 3, 4, 5, 6].map((dayNum) => {
    const defaultDay = DEFAULT_SCHEDULE.find((s) => s.dayOfWeek === dayNum);
    return defaultDay || { dayOfWeek: dayNum, slots: [] };
  });

  const createDefaultProfile = (currentUser: User | null): UserProfile => ({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    rollNumber: '',
    branch: '',
    semester: '',
    targetPercentage: 75,
  });

  const [profile, setProfile] = useState<UserProfile>(() => createDefaultProfile(null));
  const [courses, setCourses] = useState<Course[]>(() => DEFAULT_COURSES);
  const [records, setRecords] = useState<AttendanceRecord[]>(() => DEFAULT_RECORDS);
  const [schedule, setSchedule] = useState<DailySchedule[]>(() => createDefaultSchedule());

  // Handle Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadedUserId(null);
      setIsLoaded(false);
      setSyncStatus('loading');
      setProfile(createDefaultProfile(currentUser));
      setCourses([]);
      setRecords([]);
      setSchedule(
  [0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({
    dayOfWeek,
    slots: [],
  }))
);
      setAuthResolved(true);
    });
    return () => unsubscribe();
  }, []);

  // 1. Initial Load from Firebase Firestore when user signs in
  useEffect(() => {
    if (!user) {
      setIsLoaded(false);
      return;
    }

    const loadBackendData = async () => {
      try {
        setSyncStatus('loading');
        const data = await getUserDocument(user.uid);
        if (data) {
          if (data.profile) setProfile(data.profile);
          if (Array.isArray(data.courses)) setCourses(data.courses);
          if (data.records && Array.isArray(data.records)) setRecords(data.records);
          if (Array.isArray(data.schedule)) setSchedule(data.schedule);
        }
        setLoadedUserId(user.uid);
        setSyncStatus('synced');
      } catch (err) {
        console.warn('Firebase unreachable. Changes will not be synced until the data load succeeds.', err);
        setSyncStatus('error');
      } finally {
        setIsLoaded(true);
      }
    };
    loadBackendData();
  }, [user]);

  // 2. Automated Real-Time Syncing to Firebase
  useEffect(() => {
    if (!isLoaded || !user || loadedUserId !== user.uid) return;

    const cacheKey = (dataType: string) => `flyneo_${dataType}_${user.uid}`;

    // Cache in localStorage immediately for maximum robustness
    localStorage.setItem(cacheKey('profile'), JSON.stringify(profile));
    localStorage.setItem(cacheKey('courses'), JSON.stringify(courses));
    localStorage.setItem(cacheKey('records'), JSON.stringify(records));
    localStorage.setItem(cacheKey('schedule'), JSON.stringify(schedule));

    const syncToBackend = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser || currentUser.uid !== user.uid) return;
        setSyncStatus('saving');
        await syncUserDocument(currentUser.uid, profile, courses, records, schedule);
        setSyncStatus('synced');
      } catch (err) {
        console.error('Auto-sync failed:', err);
        setSyncStatus('error');
      }
    };

    const timer = setTimeout(() => {
      syncToBackend();
    }, 1000); // Debounce to group consecutive quick edits

    return () => clearTimeout(timer);
  }, [courses, records, schedule, profile, isLoaded, user]);

  // Record managers
  const handleAddRecord = (courseId: string, status: 'present' | 'absent' | 'cancelled', date: string) => {
    const newRecord: AttendanceRecord = {
      id: `record-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      courseId,
      date,
      status,
    };
    setRecords((prev: AttendanceRecord[]) => [...prev, newRecord]);
  };

  const handleRemoveRecord = (recordId: string) => {
    setRecords((prev: AttendanceRecord[]) => prev.filter((r: AttendanceRecord) => r.id !== recordId));
  };

  // Course managers
  const handleAddCourse = (name: string, code: string, credits: number, requiredPercentage: number) => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      name,
      code: code || 'AIML-GEN',
      credits,
      requiredPercentage,
    };
    setCourses((prev: Course[]) => [...prev, newCourse]);
  };

  const handleEditCourse = (
    id: string,
    name: string,
    code: string,
    credits: number,
    requiredPercentage: number
  ) => {
    setCourses((prev: Course[]) =>
      prev.map((c: Course) =>
        c.id === id ? { ...c, name, code: code || 'AIML-GEN', credits, requiredPercentage } : c
      )
    );
  };

  const handleDeleteCourse = (id: string) => {
    // Delete the course and all associated attendance records
    setCourses((prev: Course[]) => prev.filter((c: Course) => c.id !== id));
    setRecords((prev: AttendanceRecord[]) => prev.filter((r: AttendanceRecord) => r.courseId !== id));
    // Clean up schedule references
    setSchedule((prev: DailySchedule[]) =>
      prev.map((day) => ({
        ...day,
        slots: day.slots.filter((slot) => slot.courseId !== id),
      }))
    );
  };

  // Timetable Schedule management
  const handleAddSlot = (dayOfWeek: number, courseId: string, time: string) => {
    setSchedule((prev: DailySchedule[]) =>
      prev.map((day) => {
        if (day.dayOfWeek === dayOfWeek) {
          return {
            ...day,
            slots: [
              ...day.slots,
              {
                id: `slot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                courseId,
                time: time || '10:00 AM - 11:00 AM',
              },
            ],
          };
        }
        return day;
      })
    );
  };

  const handleRemoveSlot = (dayOfWeek: number, slotId: string) => {
    setSchedule((prev: DailySchedule[]) =>
      prev.map((day) => {
        if (day.dayOfWeek === dayOfWeek) {
          return {
            ...day,
            slots: day.slots.filter((s) => s.id !== slotId),
          };
        }
        return day;
      })
    );
  };

  const handleResetAllData = async () => {
    try {
      setSyncStatus('saving');
      
      const fullWeek = [0, 1, 2, 3, 4, 5, 6].map((dayNum) => {
        const defaultDay = DEFAULT_SCHEDULE.find((s) => s.dayOfWeek === dayNum);
        return defaultDay || { dayOfWeek: dayNum, slots: [] };
      });
      
      if (user) {
        await syncUserDocument(
          user.uid,
          profile,
          DEFAULT_COURSES,
          DEFAULT_RECORDS as AttendanceRecord[],
          fullWeek
        );
      }
      
      localStorage.removeItem(`flyneo_courses_${user?.uid}`);
      localStorage.removeItem(`flyneo_records_${user?.uid}`);
      localStorage.removeItem(`flyneo_schedule_${user?.uid}`);
      localStorage.removeItem(`flyneo_profile_${user?.uid}`);
      setCourses(DEFAULT_COURSES);
      setRecords(DEFAULT_RECORDS);
      setSchedule(fullWeek);
      setSyncStatus('synced');
      setCurrentTab('dashboard');
    } catch (err) {
      console.error('Failed to reset database:', err);
      setSyncStatus('error');
    }
  };

  if (!authResolved) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500/20 selection:text-indigo-300">
      {/* Decorative radial gradients for background styling */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/15 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Navigation Floating Header */}
        <div className="py-6">
          <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} syncStatus={syncStatus} />
        </div>

        {/* Dynamic Inner Tab Content */}
        <main className="flex-1 pb-12">
          {currentTab === 'dashboard' && (
            <Dashboard courses={courses} records={records} setCurrentTab={setCurrentTab} />
          )}

          {currentTab === 'logger' && (
            <DailyLogger
              courses={courses}
              records={records}
              schedule={schedule}
              onAddRecord={handleAddRecord}
              onRemoveRecord={handleRemoveRecord}
            />
          )}

          {currentTab === 'courses' && (
            <CourseManager
              courses={courses}
              records={records}
              schedule={schedule}
              onAddCourse={handleAddCourse}
              onEditCourse={handleEditCourse}
              onDeleteCourse={handleDeleteCourse}
              onResetAllData={handleResetAllData}
              onAddSlot={handleAddSlot}
              onRemoveSlot={handleRemoveSlot}
            />
          )}

           {currentTab === 'calendar' && (
            <HistoryLog courses={courses} records={records} onRemoveRecord={handleRemoveRecord} />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              profile={profile}
              onUpdateProfile={setProfile}
              courses={courses}
              records={records}
            />
          )}
        </main>

        {/* Main Footer Component */}
        <Footer />
      </div>
    </div>
  );
}
