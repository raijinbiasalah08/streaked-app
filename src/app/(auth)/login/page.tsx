"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Shield, Users, UserCheck, ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRoleQuickLogin = (roleEmail: string, destination: string) => {
    setEmail(roleEmail);
    setPassword("password123");
    router.push(destination);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("student") || email.includes("lucky") || email.includes("jemuel")) {
      router.push("/dashboard/student");
    } else if (email.includes("teacher") || email.includes("adviser")) {
      router.push("/dashboard/teacher");
    } else if (email.includes("admin")) {
      router.push("/dashboard/admin");
    } else if (email.includes("parent")) {
      router.push("/dashboard/parent");
    } else {
      router.push("/dashboard/student");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-400 shadow-xl shadow-orange-500/20">
          <Flame className="h-8 w-8 text-white animate-pulse" />
        </div>
        <h2 className="mt-4 text-3xl font-black text-white">Sign in to StreakED</h2>
        <p className="mt-1 text-xs text-slate-400">
          John Paul College • Gamified Attendance Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. lucky@streak.edu"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
            >
              Sign In
            </button>
          </form>

          {/* Quick 1-Click Role Login for Evaluator */}
          <div className="mt-6 border-t border-slate-800 pt-6">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              1-Click Instant Evaluation Logins:
            </span>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleRoleQuickLogin("lucky@streak.edu", "/dashboard/student")}
                className="flex items-center justify-between rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-slate-200 hover:border-orange-500 hover:text-orange-400 transition"
              >
                <span className="font-semibold">Student (Lucky)</span>
                <Flame className="h-3.5 w-3.5 text-orange-400" />
              </button>

              <button
                onClick={() => handleRoleQuickLogin("adviser@streak.edu", "/dashboard/teacher")}
                className="flex items-center justify-between rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-slate-200 hover:border-emerald-500 hover:text-emerald-400 transition"
              >
                <span className="font-semibold">Teacher Console</span>
                <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
              </button>

              <button
                onClick={() => handleRoleQuickLogin("admin@streak.edu", "/dashboard/admin")}
                className="flex items-center justify-between rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-slate-200 hover:border-amber-500 hover:text-amber-400 transition"
              >
                <span className="font-semibold">Admin Suite</span>
                <Shield className="h-3.5 w-3.5 text-amber-400" />
              </button>

              <button
                onClick={() => handleRoleQuickLogin("parent@streak.edu", "/dashboard/parent")}
                className="flex items-center justify-between rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-slate-200 hover:border-rose-500 hover:text-rose-400 transition"
              >
                <span className="font-semibold">Parent View</span>
                <Users className="h-3.5 w-3.5 text-rose-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
