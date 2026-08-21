import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full max-w-7xl mx-auto px-4 mt-16 mb-8">
      {/* Subtle glowing accent line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent mb-8" />
      
      <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 px-4">
        <div className="flex items-center space-x-2">
          <span className="font-bold tracking-wider text-slate-100">
            FLY<span className="text-indigo-400">NEO</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono border border-white/10 px-1.5 py-0.5 rounded bg-white/10">
            CSE-AIML
          </span>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-1.5">
          <span>Developed with</span>
          <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
          <span>for BTech CSE-AIML Students @ JSPM University</span>
        </div>

        <div className="mt-4 md:mt-0 text-[10px] font-mono text-slate-500">
          <span>© 2026 Flyneo Attendance System. 100% Free & Open.</span>
        </div>
      </div>
    </footer>
  );
}
