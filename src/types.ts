export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  requiredPercentage: number;
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'cancelled';
  notes?: string;
}

export interface DailySchedule {
  dayOfWeek: number; // 0 (Sunday) to 6 (Saturday)
  slots: {
    id: string;
    courseId: string;
    time: string; // e.g. "09:00 AM"
  }[];
}

export interface UserProfile {
  name: string;
  email: string;
  rollNumber: string;
  branch: string;
  semester: string;
  targetPercentage: number;
}

