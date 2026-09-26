// @ts-nocheck React's JSX runtime declaration is missing from the current project dependencies.
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { OverallStats } from '../utils/attendance';

interface StatsCardProps {
  stats: OverallStats;
}

export default function StatsCard({ stats }: StatsCardProps) {
  // Glow style and label based on status
  const getStatusConfig = (status: 'safe' | 'warning' | 'critical') => {
    switch (status) {
      case 'safe':
        return {
          glow: 'shadow-[0_0_30px_rgba(34,197,94,0.15)] border-green-500/30',
          text: 'text-green-400',
          bg: 'backdrop-blur-xl bg-green-500/10',
          label: 'Safe',
          icon: CheckCircle2,
        };
      case 'warning':
        return {
          glow: 'shadow-[0_0_30px_rgba(234,179,8,0.15)] border-yellow-500/30',
          text: 'text-yellow-400',
          bg: 'backdrop-blur-xl bg-yellow-500/10',
          label: 'Warning',
          icon: AlertTriangle,
        };
      case 'critical':
        return {
          glow: 'shadow-[0_0_30px_rgba(239,68,68,0.15)] border-red-500/30',
          text: 'text-red-400',
          bg: 'backdrop-blur-xl bg-red-500/10',
          label: 'Critical',
          icon: XCircle,
        };
    }
  };

  const config = getStatusConfig(stats.status);
  const StatusIcon = config.icon;

  // @ts-ignore React's JSX runtime declaration is missing from the current project dependencies.
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full max-w-7xl mx-auto px-4 mt-8">
      {/* 1. Credit-Weighted Attendance Meter */}
      <div className="relative group overflow-hidden rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-indigo-500/20 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] shadow-xl">
        <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-600/10 rounded-full filter blur-3xl group-hover:bg-indigo-600/15 transition-all duration-300" />
        
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Weighted Attendance
          </span>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-extrabold tracking-tight text-slate-100 font-mono">
              {stats.weightedAttendancePercentage.toFixed(1)}%
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Weighted by course credits. This determines your overall academic status.
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="mt-5">
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(stats.weightedAttendancePercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Overall Status */}
      <div className={`relative group overflow-hidden rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 ${config.glow} ${config.bg} shadow-xl`}>
        <div className="absolute top-0 right-0 h-32 w-32 bg-white/2 rounded-full filter blur-3xl" />
        
        <div>
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Academic Standing
            </span>
            <StatusIcon className={`h-5 w-5 ${config.text}`} />
          </div>
          <div className="mt-4 flex items-baseline">
            <span className={`text-3xl font-extrabold tracking-tight ${config.text}`}>
              {config.label}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            {stats.status === 'safe' && "Excellent! You are safely above the 75% JSPM attendance limit."}
            {stats.status === 'warning' && "Caution! You are close to the 75% limit. Attend next sessions."}
            {stats.status === 'critical' && "Alert! Your attendance is below 75%. Bunking is restricted!"}
          </p>
        </div>
        
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span>Target: 75%</span>
          <span>Difference: {(stats.weightedAttendancePercentage - 75).toFixed(1)}%</span>
        </div>
      </div>

      {/* 3. Class Counts */}
      <div className="relative group overflow-hidden rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/20 shadow-xl">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Lecture Metrics
          </span>
          
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="bg-white/10 border border-white/10 rounded-2xl p-2.5 text-center">
              <span className="text-[11px] text-slate-400 block font-medium">Present</span>
              <span className="text-lg font-bold text-green-400 font-mono">{stats.totalPresent}</span>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-2xl p-2.5 text-center">
              <span className="text-[11px] text-slate-400 block font-medium">Absent</span>
              <span className="text-lg font-bold text-red-400 font-mono">{stats.totalAbsent}</span>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-2xl p-2.5 text-center">
              <span className="text-[11px] text-slate-400 block font-medium">Off/Cancel</span>
              <span className="text-lg font-bold text-slate-400 font-mono">{stats.totalCancelled}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Total Recorded Lectures</span>
          <span className="text-slate-100 font-mono font-bold">{stats.totalLectures}</span>
        </div>
      </div>

      {/* 4. Active Credits */}
      <div className="relative group overflow-hidden rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-blue-500/20 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] shadow-xl">
        <div className="absolute top-0 right-0 h-32 w-32 bg-blue-600/10 rounded-full filter blur-3xl group-hover:bg-blue-600/15 transition-all duration-300" />
        
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Registered Credits
          </span>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-extrabold tracking-tight text-slate-100 font-mono">
              {stats.totalCredits}
            </span>
            <span className="text-sm font-medium text-slate-400 ml-2">Credits</span>
          </div>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Credits are used to weight your overall attendance score. High-credit subjects count more!
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Registered Courses</span>
          <span className="text-slate-100 font-mono font-bold">7 Subjects</span>
        </div>
      </div>
    </div>
  );
}
