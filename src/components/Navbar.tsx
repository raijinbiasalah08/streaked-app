"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, QrCode, MonitorPlay, MessageSquare, Shield, Users, UserCheck, LogIn } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard/student", label: "Student HUD", icon: Flame },
    { href: "/dashboard/teacher", label: "Teacher Console", icon: UserCheck },
    { href: "/dashboard/teacher/scanner", label: "QR Scanner", icon: QrCode },
    { href: "/dashboard/teacher/projector", label: "Projector Mode", icon: MonitorPlay },
    { href: "/dashboard/admin", label: "Admin", icon: Shield },
    { href: "/dashboard/parent", label: "Parent View", icon: Users },
    { href: "/chat", label: "Academic Chat", icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-orange-500/40 shadow-lg shadow-orange-500/20">
            <img src="/icons/3d/legend.png" alt="StreakED 3D Flame" className="h-7 w-7 object-contain filter drop-shadow-[0_2px_8px_rgba(249,115,22,0.6)]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white">
                Streak<span className="text-orange-500">ED</span>
              </span>
              <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-400 border border-orange-500/20">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Gamified Attendance System</p>
          </div>
        </Link>

        {/* Navigation items */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-orange-500/15 text-orange-400 border border-orange-500/30 font-bold"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side role indicator & quick switch */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-500 transition"
          >
            <LogIn className="h-3.5 w-3.5 text-orange-400" />
            <span className="hidden sm:inline">Sign In</span>
          </Link>
          <Link
            href="/dashboard/teacher/projector"
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:brightness-110 transition"
          >
            <MonitorPlay className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Launch</span> Projector
          </Link>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="lg:hidden flex overflow-x-auto border-t border-slate-900 px-2 py-1.5 gap-1 scrollbar-none bg-slate-950">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium ${
                isActive
                  ? "bg-orange-500/20 text-orange-400 font-bold"
                  : "text-slate-400 hover:bg-slate-900"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
