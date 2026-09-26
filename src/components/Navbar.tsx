// @ts-nocheck
import { Calendar, BookOpen, BarChart2, CheckSquare, Cloud, CloudOff, RefreshCw, User } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  syncStatus?: 'loading' | 'synced' | 'saving' | 'error';
}

export default function Navbar({ currentTab, setCurrentTab, syncStatus }: NavbarProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'logger', label: 'Daily Log', icon: CheckSquare },
    { id: 'courses', label: 'Courses & Credits', icon: BookOpen },
    { id: 'calendar', label: 'History', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-4 z-50 w-full max-w-7xl mx-auto px-4">
      <nav className="flex items-center justify-between rounded-3xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-xl px-6 py-4 transition-all duration-300">
        {/* Brand logo with subtle neon glow */}
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.5)] animate-pulse" />
          <span className="text-xl font-bold tracking-wide text-slate-100">
  Smart<span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-blue-400"> ATTENDANCE TRACKER</span>
</span>
          <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded border border-white/10 bg-white/10 ml-2">
            CSE-AIML
          </span>

          {/* Cloud Sync Status Indicator */}
          {syncStatus && (
            <div className="hidden sm:flex items-center space-x-1.5 ml-4 px-2.5 py-1 rounded-full border border-white/5 bg-white/5 text-[10px] font-semibold tracking-wider font-mono">
              {syncStatus === 'loading' && (
                <>
                  <RefreshCw className="h-3 w-3 text-amber-400 animate-spin" />
                  <span className="text-amber-400">CONNECTING...</span>
                </>
              )}
              {syncStatus === 'synced' && (
                <>
                  <Cloud className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">DB ACTIVE</span>
                </>
              )}
              {syncStatus === 'saving' && (
                <>
                  <RefreshCw className="h-3 w-3 text-indigo-400 animate-spin" />
                  <span className="text-indigo-400">SAVING...</span>
                </>
              )}
              {syncStatus === 'error' && (
                <>
                  <CloudOff className="h-3 w-3 text-rose-400 animate-pulse" />
                  <span className="text-rose-400 font-bold">OFFLINE</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative ${
                  isActive
                    ? 'text-indigo-300 bg-white/10 border border-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-linear-to-r from-indigo-400 to-blue-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* CTA Launch Button / Mobile Indicator */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentTab('logger')}
            className="relative overflow-hidden px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-indigo-500 hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-indigo-500/20"
          >
            Mark Today
          </button>
        </div>
      </nav>

      {/* Mobile Nav Bar - Bottom aligned or simple horizontal scroll for mobile */}
      <div className="md:hidden flex justify-around mt-3 bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-md shadow-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center p-2 rounded-lg text-[10px] font-medium transition-all duration-300 ${
                isActive ? 'text-indigo-400' : 'text-slate-400'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
