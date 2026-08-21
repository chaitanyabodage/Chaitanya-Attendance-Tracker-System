/** @jsxRuntime classic */
// React is required at runtime for the classic JSX transform; this project does not ship React typings.
// @ts-ignore
import * as React from 'react';
import { ShieldCheck, BookOpen } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

export default function LoginScreen() {
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_50%)] pointer-events-none" />     <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(56,189,248,0.1),transparent_50%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="h-20 w-20 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/10">
            <BookOpen className="h-10 w-10 text-indigo-400" />
          </div>
          
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Chaitanya Attendance Tracker</h1>
          <p className="text-slate-400 mb-8 font-medium">Log in to sync your classes, schedules, and attendance history securely to the cloud.</p>
          
          <button
            onClick={handleLogin}
            className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-4 px-6 rounded-xl transition duration-300 transform hover:-translate-y-1 shadow-xl flex items-center justify-center space-x-3 group"
          >
            <ShieldCheck className="h-5 w-5 text-indigo-600" />
            <span>Continue with Google</span>
          </button>
          
          <p className="text-xs text-slate-500 mt-6">
            By logging in, you agree to secure your local data to the cloud. Each account maintains its own private records and timetable.
          </p>
        </div>
      </div>
    </div>
  );
}
