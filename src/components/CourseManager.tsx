// @ts-nocheck
// React typings are not available in the current project configuration.
// @ts-expect-error Missing declaration file for the React runtime module.
import { useState } from 'react';

declare module 'react/jsx-runtime' {
  export const Fragment: any;
  export function jsx(...args: any[]): any;
  export function jsxs(...args: any[]): any;
}

type FormEvent = { preventDefault: () => void };
type ChangeEvent = { target: { value: string } };
import { Plus, Trash2, Edit3, Book, RefreshCw, CheckCircle, ShieldAlert, Sparkles, Clock, Calendar } from 'lucide-react';
import { Course, AttendanceRecord, DailySchedule } from '../types';
import { calculateCourseStats, CourseStats } from '../utils/attendance';

interface CourseManagerProps {
  courses: Course[];
  records: AttendanceRecord[];
  schedule: DailySchedule[];
  onAddCourse: (name: string, code: string, credits: number, requiredPercentage: number) => void;
  onEditCourse: (id: string, name: string, code: string, credits: number, requiredPercentage: number) => void;
  onDeleteCourse: (id: string) => void;
  onResetAllData: () => void;
  onAddSlot: (dayOfWeek: number, courseId: string, time: string) => void;
  onRemoveSlot: (dayOfWeek: number, slotId: string) => void;
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 0, label: 'Sunday' },
];

export default function CourseManager({
  courses,
  records,
  schedule,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
  onResetAllData,
  onAddSlot,
  onRemoveSlot,
}: CourseManagerProps) {
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Course Form States
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState<number | ''>(3);
  const [requiredPercentage, setRequiredPercentage] = useState(75);

  // Slot Form States
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [slotCourseId, setSlotCourseId] = useState<string>('');
  const [slotTime, setSlotTime] = useState<string>('09:00 AM - 10:00 AM');

  // Initialize slotCourseId if list changes
  useState(() => {
    if (courses.length > 0) {
      setSlotCourseId(courses[0].id);
    }
  });

  const handleSubmitCourse = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const creditValue = typeof credits === 'number' ? credits : 1;

    if (editingCourseId) {
      onEditCourse(editingCourseId, name, code, creditValue, requiredPercentage);
      setEditingCourseId(null);
    } else {
      onAddCourse(name, code, creditValue, requiredPercentage);
    }

    // Reset Form
    setName('');
    setCode('');
    setCredits(3);
    setRequiredPercentage(75);
  };

  const handleSubmitSlot = (e: FormEvent) => {
    e.preventDefault();
    const targetCourseId = slotCourseId || (courses.length > 0 ? courses[0].id : '');
    if (!targetCourseId || !slotTime.trim()) return;

    onAddSlot(selectedDay, targetCourseId, slotTime);
    setSlotTime('09:00 AM - 10:00 AM');
  };

  const handleEditClick = (course: Course) => {
    setEditingCourseId(course.id);
    setName(course.name);
    setCode(course.code);
    setCredits(course.credits);
    setRequiredPercentage(course.requiredPercentage);
  };

  const handleCancel = () => {
    setEditingCourseId(null);
    setName('');
    setCode('');
    setCredits(3);
    setRequiredPercentage(75);
  };

  // Get status indicators
  const getBunkRecommendation = (stat: CourseStats) => {
    if (stat.totalLectures === 0) {
      return {
        text: 'No lectures registered yet.',
        color: 'text-gray-400 bg-gray-500/5 border-gray-500/10',
      };
    }

    if (stat.bunkableClasses > 0) {
      return {
        text: `Safe to bunk! You can bunk up to ${stat.bunkableClasses} class${stat.bunkableClasses > 1 ? 'es' : ''} consecutively.`,
        color: 'text-green-400 bg-green-500/5 border-green-500/10',
      };
    } else if (stat.bunkableClasses === 0) {
      return {
        text: 'Bunking warning! Missing the next class will drop you below your threshold.',
        color: 'text-yellow-400 bg-yellow-500/5 border-yellow-500/10',
      };
    } else {
      const needed = Math.abs(stat.bunkableClasses);
      return {
        text: `Critical! You MUST attend the next ${needed} class${needed > 1 ? 'es' : ''} to recover to ${stat.requiredPercentage}%.`,
        color: 'text-red-400 bg-red-500/5 border-red-500/10',
      };
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-8 space-y-8">
      {/* Upper Grid: Course Forms & Course List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Add / Edit Course form */}
        <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 hover:border-white/20 transition-all duration-300 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Book className="h-5 w-5 text-indigo-400" />
              <span>{editingCourseId ? 'Edit Subject Details' : 'Add New Subject'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {editingCourseId ? 'Modify the selected subject parameters below.' : 'Add your semester subjects with corresponding university credits.'}
            </p>

            <form onSubmit={handleSubmitCourse} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e: ChangeEvent) => setName(e.target.value)}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e: ChangeEvent) => setCode(e.target.value)}
                    placeholder="AIML-301"
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Credits (0.5 - 20)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="20"
                    step="0.5"
                    required
                    value={credits}
                    onChange={(e: ChangeEvent) => {
                      const val = e.target.value;
                      if (val === '') {
                        setCredits('');
                      } else {
                        const parsed = parseFloat(val);
                        if (!isNaN(parsed)) {
                          setCredits(parsed);
                        }
                      }
                    }}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Required Attendance % ({requiredPercentage}%)
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={requiredPercentage}
                  onChange={(e: ChangeEvent) => setRequiredPercentage(parseInt(e.target.value))}
                  className="w-full accent-indigo-400 bg-white/10 rounded-xl h-2"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>50%</span>
                  <span>75% (JSPM standard)</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase text-white bg-indigo-500 hover:bg-indigo-600 transition-all duration-300 shadow-lg shadow-indigo-500/20 cursor-pointer"
                >
                  {editingCourseId ? 'Update Subject' : 'Add Subject'}
                </button>
                {editingCourseId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold uppercase text-slate-200 backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <span className="text-xs text-slate-400 block mb-2 font-medium">Danger Zone</span>
            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center justify-center space-x-2 text-xs font-bold bg-zinc-900 text-amber-400 border border-amber-400/50 hover:bg-amber-400 hover:text-black transition-all"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reset All Database Records</span>
              </button>
            ) : (
              <div className="space-y-2 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-md">
                <p className="text-[11px] text-red-300 font-medium">
                  This will wipe all courses, calendar schedule, and records. Are you absolutely sure?
                </p>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      onResetAllData();
                      setShowResetConfirm(false);
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer transition"
                  >
                    Yes, Wipe All
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs cursor-pointer transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. Course List Grid with interactive details */}
        <div className="lg:col-span-2 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 hover:border-white/20 transition-all duration-300 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div>
                <h2 className="text-lg font-bold text-slate-100">Registered Core Subjects</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Overview of BTech CSE-AIML subject-wise records. Use quick incrementors to edit credits.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-300">
                {courses.length} subjects
              </span>
            </div>

            {/* Search Bar */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search subjects by name or code..."
                value={searchQuery}
                onChange={(e: ChangeEvent) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-slate-100 text-xs focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all duration-300"
              />
            </div>

            <div className="mt-6 space-y-4 max-h-120 overflow-y-auto pr-1">
              {(() => {
                const filteredCourses = courses.filter(
                  (c) =>
                    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.code.toLowerCase().includes(searchQuery.toLowerCase())
                );

                if (filteredCourses.length === 0) {
                  return (
                    <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                      <span className="text-sm font-semibold text-slate-400 block">
                        No matching subjects found
                      </span>
                      <span className="text-xs text-slate-500 block mt-1">
                        Try adjusting your search terms or add a new subject.
                      </span>
                    </div>
                  );
                }

                return filteredCourses.map((course) => {
                  const stat = calculateCourseStats(course, records);
                  const recommend = getBunkRecommendation(stat);

                  return (
                    <div
                      key={course.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/15 transition-all duration-300 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Course info */}
                        <div className="flex items-center space-x-3">
                          {/* Credit Interactive Adjustment Panel */}
                          <div className="flex flex-col items-center justify-center">
                            <div className="h-11 w-12 rounded-lg bg-white/10 border border-white/10 flex flex-col items-center justify-center text-[10px] font-mono text-slate-400 shadow-inner">
                              <span className="text-indigo-300 font-bold text-sm leading-none">{course.credits}</span>
                              <span className="text-[8px] mt-0.5">Creds</span>
                            </div>
                            <div className="flex space-x-1 mt-1">
                              <button
                                onClick={() => {
                                  const newCreds = Math.max(0.5, Number((course.credits - 0.5).toFixed(1)));
                                  onEditCourse(course.id, course.name, course.code, newCreds, course.requiredPercentage);
                                }}
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 hover:bg-white/20 hover:text-white text-slate-400 transition"
                                title="Decrease Credit"
                              >
                                -
                              </button>
                              <button
                                onClick={() => {
                                  const newCreds = Math.min(20, Number((course.credits + 0.5).toFixed(1)));
                                  onEditCourse(course.id, course.name, course.code, newCreds, course.requiredPercentage);
                                }}
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 hover:bg-white/20 hover:text-white text-slate-400 transition"
                                title="Increase Credit"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                              <span className="text-sm font-semibold text-slate-100">{course.name}</span>
                              <span className="text-[10px] font-mono text-slate-400 bg-white/10 border border-white/10 px-1.5 py-0.5 rounded">
                                {course.code}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 mt-0.5 block">
                              Attendance: {stat.presentCount} Present • {stat.absentCount} Absent
                            </span>
                          </div>
                        </div>

                        {/* Statistics */}
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <span className="text-xs text-slate-400 block">Percentage</span>
                            <span className={`text-lg font-extrabold font-mono ${
                              stat.percentage >= course.requiredPercentage ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {stat.percentage.toFixed(1)}%
                            </span>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center space-x-1">
                            {courseToDelete === course.id ? (
                              <div className="flex items-center space-x-1 bg-red-500/10 border border-red-500/20 rounded-xl p-1 backdrop-blur-md animate-pulse">
                                <span className="text-[9px] text-red-300 font-bold px-1 select-none">Delete?</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onDeleteCourse(course.id);
                                    setCourseToDelete(null);
                                  }}
                                  className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold cursor-pointer transition"
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setCourseToDelete(null)}
                                  className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 text-[10px] font-bold cursor-pointer transition"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleEditClick(course)}
                                  className="p-2 rounded-lg bg-white/10 border border-white/10 text-slate-300 hover:text-white hover:bg-white/15 transition-all"
                                  title="Edit"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setCourseToDelete(course.id)}
                                  className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/15 transition-all cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Smart bunk alert block */}
                      <div className={`mt-3 py-2 px-3 rounded-xl border text-xs flex items-center space-x-2 backdrop-blur-md ${recommend.color}`}>
                        {stat.percentage >= course.requiredPercentage ? (
                                  <CheckCircle className="h-4 w-4 shrink-0 text-green-400" />
                        ) : (
                          <ShieldAlert className="h-4 w-4 shrink-0 text-red-400" />
                        )}
                        <span>{recommend.text}</span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Daily Timetable / Schedule Editor */}
      <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 hover:border-white/20 transition-all duration-300 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-white/10 gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
              <span>Interactive Weekly Timetable Planner</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Fully customize classes, lecture times, and weekly slot allocations. Changes reflect instantly on the Daily Log.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-300 bg-white/10 border border-white/10 px-3 py-1 rounded-full">
            Editable Timetable
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Add Lecture Slot Form */}
          <div className="lg:col-span-1 p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-1.5 mb-3">
                <Clock className="h-4 w-4 text-indigo-400" />
                <span>Add Lecture Slot</span>
              </h3>

              {courses.length === 0 ? (
                <div className="text-xs text-slate-400 bg-yellow-500/5 border border-yellow-500/10 p-3 rounded-xl">
                  Please register at least one subject above before adding slot schedules.
                </div>
              ) : (
                <form onSubmit={handleSubmitSlot} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Day of Week</label>
                    <select
                      value={selectedDay}
                      onChange={(e: ChangeEvent) => setSelectedDay(parseInt(e.target.value))}
                      className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-400"
                    >
                      {DAYS_OF_WEEK.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Associated Subject</label>
                    <select
                      value={slotCourseId}
                      onChange={(e: ChangeEvent) => setSlotCourseId(e.target.value)}
                      className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-400"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Time Slot Interval</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 09:00 AM - 10:00 AM"
                      value={slotTime}
                      onChange={(e: ChangeEvent) => setSlotTime(e.target.value)}
                      className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg mt-2 transition-all cursor-pointer shadow-md"
                  >
                    Add to Calendar
                  </button>
                </form>
              )}
            </div>
            
            <div className="text-[10px] text-slate-500 font-mono mt-4">
              Note: Slot deletion is interactive. Hover over daily cards to remove slots instantly.
            </div>
          </div>

          {/* Timetable Weekly Cards Grid */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {DAYS_OF_WEEK.filter(d => d.value !== 0 && d.value !== 6).map((day) => {
              const daySchedule = schedule.find((s) => s.dayOfWeek === day.value);
              const slots = daySchedule ? daySchedule.slots : [];

              return (
                <div
                  key={day.value}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/15 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-xs text-indigo-200">{day.label}</span>
                      <span className="text-[9px] font-mono font-bold text-slate-400 bg-white/10 border border-white/5 px-1.5 py-0.5 rounded">
                        {slots.length} slots
                      </span>
                    </div>

                    <div className="space-y-2 max-h-55 overflow-y-auto pr-0.5">
                      {slots.length === 0 ? (
                        <div className="text-[10px] text-slate-500 italic py-6 text-center">
                          No lectures scheduled
                        </div>
                      ) : (
                        slots.map((slot) => {
                          const course = courses.find((c) => c.id === slot.courseId);
                          return (
                            <div
                              key={slot.id}
                              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-between text-xs group/slot transition-all duration-200"
                            >
                              <div className="min-w-0 pr-1">
                                <span className="font-semibold text-slate-200 truncate block text-[11px]" title={course?.name}>
                                  {course ? course.name : 'Deleted subject'}
                                </span>
                                <span className="text-[9px] text-slate-400 block font-mono">
                                  {slot.time}
                                </span>
                              </div>
                              <button
                                onClick={() => onRemoveSlot(day.value, slot.id)}
                                className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition cursor-pointer shrink-0"
                                title="Remove slot"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
