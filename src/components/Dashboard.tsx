// The project does not include React's type declarations, so suppress the
// generated JSX runtime type error for this component until they are added.
// @ts-nocheck
import { GraduationCap, AlertCircle, CheckCircle2, Award, Calendar, ChevronRight, Info } from 'lucide-react';
import { Course, AttendanceRecord } from '../types';
import { calculateOverallStats, calculateCourseStats } from '../utils/attendance';
import StatsCard from './StatsCard';

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elementName: string]: any;
    }
  }
}

interface DashboardProps {
  courses: Course[];
  records: AttendanceRecord[];
  setCurrentTab: (tab: string) => void;
}

export default function Dashboard({ courses, records, setCurrentTab }: DashboardProps) {
  const overallStats = calculateOverallStats(courses, records);
  const courseStatsList = courses.map((c) => calculateCourseStats(c, records));

  const criticalCourses = courseStatsList.filter((s) => s.status === 'critical');
  const warningCourses = courseStatsList.filter((s) => s.status === 'warning');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-6">
      {/* Hero Welcome Banner */}
  <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 md:p-12 mb-8 flex flex-col justify-between shadow-2xl">
        <div className="absolute top-0 right-0 h-96 w-96 bg-linear-to-br from-indigo-600/10 to-blue-600/5 rounded-full filter blur-3xl animate-pulse" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[11px] font-mono text-indigo-300 mb-6">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>JSPM University • BTech CSE-AIML</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans max-w-2xl leading-[1.15]">
  Smart Attendance Tracker
</h1>

          <p className="mt-4 text-sm md:text-base text-slate-400 max-w-xl leading-relaxed">
            A premium, high-contrast digital tracking assistant crafted specifically for your daily lectures and credit-weighted academic requirements.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => setCurrentTab('logger')}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-indigo-500/20"
            >
              <Calendar className="h-4 w-4" />
              <span>Mark Today's Attendance</span>
            </button>
            <button
              onClick={() => setCurrentTab('courses')}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-200 backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <span>Manage Subjects</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main stats layout */}
      <StatsCard stats={overallStats} />

      {/* Course Progress Dashboard & Bunk Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left/Middle Column - Course-wise status */}
        <div className="lg:col-span-2 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 shadow-xl">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <h2 className="text-lg font-bold text-slate-100">Subject-Wise Analytics</h2>
            <span className="text-xs text-slate-400 font-mono">Weighted by credits</span>
          </div>

          <div className="mt-6 space-y-5">
            {courseStatsList.map((stat) => {
              const course = courses.find((c) => c.id === stat.courseId);
              if (!course) return null;

              return (
                <div key={stat.courseId} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {stat.courseName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono ml-2">
                        {stat.courseCode} • {stat.credits} Credits
                      </span>
                    </div>

                    <div className="text-right">
                      <span className={`text-sm font-bold font-mono ${
                        stat.percentage >= course.requiredPercentage ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {stat.percentage.toFixed(0)}%
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1">/ {course.requiredPercentage}%</span>
                    </div>
                  </div>

                  {/* Graphic Progress Track */}
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stat.percentage >= course.requiredPercentage
                          ? 'bg-linear-to-r from-green-500 to-emerald-400'
                          : 'bg-linear-to-r from-red-500 to-rose-400'
                      }`}
                      style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                    />
                    {/* Target line indicator */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-white/30"
                      style={{ left: `${course.requiredPercentage}%` }}
                      title={`Target limit: ${course.requiredPercentage}%`}
                    />
                  </div>

                  {/* Summary labels */}
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
                    <span>
                      {stat.totalLectures > 0 
                        ? `${stat.presentCount} / ${stat.totalLectures} lectures present`
                        : 'No lectures logged'
                      }
                    </span>
                    <span>
                      {stat.bunkableClasses > 0 && `Can miss: ${stat.bunkableClasses} session${stat.bunkableClasses > 1 ? 's' : ''}`}
                      {stat.bunkableClasses === 0 && 'Cannot bunk next session'}
                      {stat.bunkableClasses < 0 && `Must attend next ${Math.abs(stat.bunkableClasses)} session${Math.abs(stat.bunkableClasses) > 1 ? 's' : ''}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Bunk Strategy Advisor */}
        <div className="flex flex-col space-y-6">
          {/* Smart Advisor Card */}
          <div className="rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 p-6 shadow-xl flex flex-col justify-between flex-1">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                <Award className="h-5 w-5 text-indigo-400" />
                <span>Attendance Coach</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Intelligent strategies for JSPM University syllabus guidelines.
              </p>

              {/* Status breakdown messages */}
              <div className="mt-5 space-y-3">
                {criticalCourses.length > 0 ? (
                  <div className="p-4 rounded-xl backdrop-blur-md bg-red-500/10 border border-red-500/20 flex items-start space-x-3 text-xs text-red-300">
                    <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                    <div>
                      <span className="font-bold block">Critically Low Subjects ({criticalCourses.length})</span>
                      <p className="mt-1 text-slate-400">
                        You are below 75% in: {criticalCourses.map((c) => c.courseName).join(', ')}. Prioritize these in your schedule!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl backdrop-blur-md bg-green-500/10 border border-green-500/20 flex items-start space-x-3 text-xs text-green-300">
                    <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                    <div>
                      <span className="font-bold block">Zero Critical Subjects</span>
                      <p className="mt-1 text-slate-400">
                        Fantastic! You are above 75% in all registered credit courses. Maintain this balance!
                      </p>
                    </div>
                  </div>
                )}

                {warningCourses.length > 0 && (
                  <div className="p-4 rounded-xl backdrop-blur-md bg-yellow-500/10 border border-yellow-500/20 flex items-start space-x-3 text-xs text-yellow-300">
                    <AlertCircle className="h-5 w-5 text-yellow-400 shrink-0" />
                    <div>
                      <span className="font-bold block">Danger Zone warning ({warningCourses.length})</span>
                      <p className="mt-1 text-slate-400">
                        You are close to dropping below target in: {warningCourses.map((c) => c.courseName).join(', ')}. Avoid bunking here!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 space-y-1">
              <span className="text-slate-100 font-semibold flex items-center space-x-1">
                <Info className="h-3 w-3 text-indigo-400" />
                <span>How is it calculated freely?</span>
              </span>
              <p className="text-[11px]">
                Your device handles 100% of the computations locally. No servers are used, meaning zero costs, zero data tracking, and maximum load speeds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}