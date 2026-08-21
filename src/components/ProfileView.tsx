import { useState, FormEvent } from 'react';
import { User, Shield, GraduationCap, Award, Save, BookOpen, LogOut } from 'lucide-react';
import { UserProfile, Course, AttendanceRecord } from '../types';
import { signOut } from '../lib/firebase';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  courses: Course[];
  records: AttendanceRecord[];
}

export default function ProfileView({ profile, onUpdateProfile, courses, records }: ProfileViewProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [rollNumber, setRollNumber] = useState(profile.rollNumber);
  const [branch, setBranch] = useState(profile.branch);
  const [semester, setSemester] = useState(profile.semester);
  const [targetPercentage, setTargetPercentage] = useState(profile.targetPercentage);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      email,
      rollNumber,
      branch,
      semester,
      targetPercentage: Number(targetPercentage) || 75,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem('flyneo_profile');
      localStorage.removeItem('flyneo_courses');
      localStorage.removeItem('flyneo_records');
      localStorage.removeItem('flyneo_schedule');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Stats calculation
  const totalCourses = courses.length;
  const totalCredits = courses.reduce((acc, curr) => acc + curr.credits, 0);
  
  const presentCount = records.filter((r) => r.status === 'present').length;
  const totalActiveLogs = records.filter((r) => r.status === 'present' || r.status === 'absent').length;
  const overallAttendance = totalActiveLogs > 0 ? Math.round((presentCount / totalActiveLogs) * 100) : 100;

  return (
    <div className="w-full max-w-4xl mx-auto px-4" id="profile-container">
      {/* Visual Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 border border-white/10 p-8 mb-8 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_60%)]" />
        
        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="absolute top-6 right-6 z-20 flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition duration-300 group cursor-pointer"
        >
          <LogOut className="h-4 w-4 text-slate-300 group-hover:text-red-400 transition" />
          <span className="text-xs font-bold text-slate-300 group-hover:text-red-400 tracking-wider">SIGN OUT</span>
        </button>

        <div className="relative z-10 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 mt-4 md:mt-0">
          {/* Avatar Container with neon glow */}
          <div className="relative h-24 w-24 rounded-2xl bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(129,140,248,0.2)]">
            <span className="text-4xl font-extrabold text-indigo-300">
              {name ? name.charAt(0).toUpperCase() : 'C'}
            </span>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-wide">{name}</h1>
            <p className="text-sm text-indigo-300 font-mono mt-1">{branch}</p>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-3">
              <span className="text-[11px] font-semibold bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-slate-300 flex items-center space-x-1.5">
                <GraduationCap className="h-3 w-3 text-indigo-400" />
                <span>{semester}</span>
              </span>
              <span className="text-[11px] font-semibold bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-slate-300 flex items-center space-x-1.5">
                <Shield className="h-3 w-3 text-emerald-400" />
                <span>PRN: {rollNumber}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Metric Cards */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 flex items-center space-x-4 backdrop-blur-md shadow-md">
          <div className="p-3.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Course Load</span>
            <span className="text-xl font-extrabold text-slate-200 mt-0.5 block">{totalCourses} Subjects</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 flex items-center space-x-4 backdrop-blur-md shadow-md">
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-400">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Total Syllabus Credits</span>
            <span className="text-xl font-extrabold text-slate-200 mt-0.5 block">{totalCredits} Credits</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 flex items-center space-x-4 backdrop-blur-md shadow-md">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Attendance Standing</span>
            <span className={`text-xl font-extrabold mt-0.5 block ${overallAttendance >= targetPercentage ? 'text-emerald-400' : 'text-amber-400'}`}>
              {overallAttendance}%
            </span>
          </div>
        </div>
      </div>

      {/* Account Management Form */}
      <div className="rounded-3xl bg-white/5 border border-white/10 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center space-x-2.5 mb-6 pb-4 border-b border-white/10">
          <User className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-extrabold text-slate-100 tracking-wide">Account Settings & Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 text-slate-200 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 transition duration-300 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 text-slate-200 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 transition duration-300 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">University Roll No. / PRN</label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 text-slate-200 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 transition duration-300 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Target Attendance Threshold (%)</label>
              <input
                type="number"
                min="50"
                max="100"
                required
                value={targetPercentage}
                onChange={(e) => setTargetPercentage(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 text-slate-200 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 transition duration-300 outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Academic Branch / Department</label>
              <input
                type="text"
                required
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 text-slate-200 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 transition duration-300 outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Academic Semester</label>
              <input
                type="text"
                required
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 text-slate-200 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 transition duration-300 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {isSaved ? (
              <span className="text-xs text-emerald-400 font-bold tracking-wider animate-pulse select-none">
                ✓ SAVED & BACKED UP ON DATABASE
              </span>
            ) : (
              <span className="text-xs text-slate-400 font-medium select-none">
                Saved values will update your cloud account instantly.
              </span>
            )}
            <button
              type="submit"
              className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition cursor-pointer shadow-lg shadow-indigo-500/20"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
