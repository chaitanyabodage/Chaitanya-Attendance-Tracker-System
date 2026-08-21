// React's type declarations are not available in the current project setup.
// @ts-nocheck
// Keep the runtime import while suppressing the resulting declaration warning.
// @ts-ignore
import { useState } from 'react';
import { Calendar as CalendarIcon, Check, X, Minus, Info, AlertCircle, Sparkles } from 'lucide-react';
import { Course, AttendanceRecord, DailySchedule } from '../types';

interface DailyLoggerProps {
  courses: Course[];
  records: AttendanceRecord[];
  schedule: DailySchedule[];
  onAddRecord: (courseId: string, status: 'present' | 'absent' | 'cancelled', date: string) => void;
  onRemoveRecord: (recordId: string) => void;
}

export default function DailyLogger({ courses, records, schedule, onAddRecord, onRemoveRecord }: DailyLoggerProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local time zone
  );

  // Get day of week (0 for Sunday, 1 for Monday, etc.)
  const getDayOfWeek = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.getDay();
  };

  const dayOfWeek = getDayOfWeek(selectedDate);
  const dailySchedule: DailySchedule | undefined = schedule.find((s) => s.dayOfWeek === dayOfWeek);

  // Find existing records for the selected date
  const recordsForDate = records.filter((r) => r.date === selectedDate);

  // Get status of a course for the selected date
  const getCourseStatusOnDate = (courseId: string) => {
    const record = recordsForDate.find((r) => r.courseId === courseId);
    return record ? record.status : null;
  };

  // Find record id for a course on selected date
  const getRecordIdOnDate = (courseId: string) => {
    const record = recordsForDate.find((r) => r.courseId === courseId);
    return record ? record.id : null;
  };

  const handleStatusClick = (courseId: string, status: 'present' | 'absent' | 'cancelled') => {
    const existingRecordId = getRecordIdOnDate(courseId);
    const existingStatus = getCourseStatusOnDate(courseId);

    if (existingStatus === status) {
      // If toggling the same status off, remove the record
      if (existingRecordId) {
        onRemoveRecord(existingRecordId);
      }
    } else {
      // If there's an existing record, remove it first, then add new status
      if (existingRecordId) {
        onRemoveRecord(existingRecordId);
      }
      onAddRecord(courseId, status, selectedDate);
    }
  };

  // Get names for days
  const getDayName = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Date Picker Card */}
      <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-indigo-400" />
            <span>Select Lecture Date</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose a date to review or mark attendance for your scheduled lectures.
          </p>

          <div className="mt-5">
            <input
              type="date"
              value={selectedDate}
              onChange={(e: { target: { value: string } }) => setSelectedDate(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all duration-300"
            />
          </div>

          <div className="mt-4 p-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/15 text-xs text-slate-400">
            <span className="text-slate-200 font-semibold block mb-1">💡 JSPM Pro-tip:</span>
            Marking classes as <span className="text-slate-300 font-semibold">"Cancelled"</span> or <span className="text-slate-300 font-semibold">"Off"</span> ensures they do not count against your overall attendance percentages. This is the correct way to handle official holidays!
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 flex justify-between items-center">
          <span>Active Date:</span>
          <span className="text-slate-200 font-semibold font-mono">{selectedDate}</span>
        </div>
      </div>

      {/* Lectures List for Selected Day */}
      <div className="lg:col-span-2 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 hover:border-white/20 transition-all duration-300 flex flex-col justify-between shadow-xl">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-white/10">
            <div>
              <h2 className="text-lg font-bold text-slate-100 font-sans">
                {getDayName(selectedDate)}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {dailySchedule ? 'Standard lecture timetable is loaded below.' : 'No standard lectures scheduled for weekends.'}
              </p>
            </div>
            
            <div className="mt-2 sm:mt-0 flex space-x-2">
              <span className="text-[10px] uppercase font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-md">
                {recordsForDate.length} logged
              </span>
            </div>
          </div>

          {/* Schedule Slots */}
          <div className="mt-6 space-y-4">
            {dailySchedule && dailySchedule.slots.length > 0 ? (
              dailySchedule.slots.map((slot) => {
                const course = courses.find((c) => c.id === slot.courseId);
                if (!course) return null;

                const currentStatus = getCourseStatusOnDate(course.id);

                return (
                  <div
                    key={slot.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-xs font-mono font-bold text-slate-300">
                        {course.credits} Cr
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-slate-100">{course.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">{course.code}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono block mt-0.5">{slot.time}</span>
                      </div>
                    </div>

                    {/* Marking Toggles */}
                    <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                      {/* Present */}
                      <button
                        onClick={() => handleStatusClick(course.id, 'present')}
                        className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-300 ${
                          currentStatus === 'present'
                            ? 'bg-green-500/20 border-green-500/40 text-green-400'
                            : 'bg-white/10 border-white/10 text-slate-400 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/20'
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Present</span>
                      </button>

                      {/* Absent */}
                      <button
                        onClick={() => handleStatusClick(course.id, 'absent')}
                        className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-300 ${
                          currentStatus === 'absent'
                            ? 'bg-red-500/20 border-red-500/40 text-red-400'
                            : 'bg-white/10 border-white/10 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
                        }`}
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Absent</span>
                      </button>

                      {/* Cancelled */}
                      <button
                        onClick={() => handleStatusClick(course.id, 'cancelled')}
                        className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-300 ${
                          currentStatus === 'cancelled'
                            ? 'bg-gray-500/20 border-gray-500/40 text-gray-300'
                            : 'bg-white/10 border-white/10 text-slate-400 hover:bg-gray-500/10 hover:text-gray-200 hover:border-gray-500/20'
                        }`}
                      >
                        <Minus className="h-3.5 w-3.5" />
                        <span>Cancelled</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              // Empty Schedule (e.g. Saturday or Sunday or if schedule is cleared)
              <div className="py-12 px-4 rounded-xl border border-dashed border-white/10 bg-white/5 text-center">
                <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                <span className="text-sm font-semibold text-slate-100 block">No Scheduled timetable for this day</span>
                <span className="text-xs text-slate-400 block mt-1">
                  You can mark attendance for individual courses under the "Courses & Credits" or "Dashboard" tabs.
                </span>
              </div>
            )}
          </div>

          {/* Manual Extra Session Marker */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <span className="text-xs font-semibold text-slate-200 block mb-3">Mark Unscheduled/Extra Lectures</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map((course) => {
                const currentStatus = getCourseStatusOnDate(course.id);
                // Only show if NOT in the standard daily schedule to avoid duplication
                const inSchedule = dailySchedule?.slots.some((s) => s.courseId === course.id);
                if (inSchedule) return null;

                return (
                  <div key={course.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div>
                      <span className="text-xs font-semibold text-slate-100 block">{course.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 block">{course.code} • {course.credits} Cr</span>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleStatusClick(course.id, 'present')}
                        className={`p-1.5 rounded border transition-all duration-300 ${
                          currentStatus === 'present' ? 'bg-green-500/25 border-green-500/40 text-green-400' : 'bg-white/10 border-white/10 text-slate-400 hover:text-white'
                        }`}
                        title="Present"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleStatusClick(course.id, 'absent')}
                        className={`p-1.5 rounded border transition-all duration-300 ${
                          currentStatus === 'absent' ? 'bg-red-500/25 border-red-500/40 text-red-400' : 'bg-white/10 border-white/10 text-slate-400 hover:text-white'
                        }`}
                        title="Absent"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleStatusClick(course.id, 'cancelled')}
                        className={`p-1.5 rounded border transition-all duration-300 ${
                          currentStatus === 'cancelled' ? 'bg-gray-500/25 border-gray-500/40 text-gray-200' : 'bg-white/10 border-white/10 text-slate-400 hover:text-white'
                        }`}
                        title="Cancelled"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
