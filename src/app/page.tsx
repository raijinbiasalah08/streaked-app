import Link from "next/link";
import { Flame, QrCode, MonitorPlay, Users, Shield, MessageSquare, Award, ArrowRight, School, Sparkles } from "lucide-react";

export default function HomePage() {
  const roles = [
    {
      title: "Student Experience (HUD)",
      desc: "Gamified streak flame, attendance stats, scannable QR pass, badge showcase, and activity heatmap.",
      href: "/dashboard/student",
      badge: "Gamified HUD",
      icon: Flame,
      color: "from-orange-500 to-amber-500",
    },
    {
      title: "Teacher Attendance Console",
      desc: "Instant attendance review, session statistics, student search, and manual status override.",
      href: "/dashboard/teacher",
      badge: "Instructor Console",
      icon: Users,
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "Live QR & Barcode Scanner",
      desc: "Optical camera scanner with instant audio chime verification and streak increment pop-up.",
      href: "/dashboard/teacher/scanner",
      badge: "Optical Scanner",
      icon: QrCode,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Classroom Projector Mode",
      desc: "High-contrast, full-screen live leaderboard designed to project top streaks onto classroom screens.",
      href: "/dashboard/teacher/projector",
      badge: "Projector Screen",
      icon: MonitorPlay,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Admin Analytics & CSV Export",
      desc: "School-wide attendance metrics, absentee alerts, section comparisons, and downloadable logs.",
      href: "/dashboard/admin",
      badge: "Admin Suite",
      icon: Shield,
      color: "from-amber-500 to-yellow-500",
    },
    {
      title: "Parent & Guardian Portal",
      desc: "Read-only view for parents to observe their child's daily streak, punctuality, and absence alerts.",
      href: "/dashboard/parent",
      badge: "Guardian Portal",
      icon: Users,
      color: "from-rose-500 to-orange-500",
    },
    {
      title: "Academic-Only Class Chat",
      desc: "Focused discussion feed with category filters ([Question], [Announcement], [Assignment Help]).",
      href: "/chat",
      badge: "Course Discussion",
      icon: MessageSquare,
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Authentication & Role Login",
      desc: "Sign-in portal featuring 1-click evaluation shortcuts for Student, Teacher, Admin, and Parent.",
      href: "/login",
      badge: "Auth Access",
      icon: Users,
      color: "from-amber-600 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-12 pb-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-orange-600/20 via-amber-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/30 px-4 py-1.5 text-xs font-bold text-orange-400 mb-6 shadow-sm">
            <School className="h-3.5 w-3.5" /> John Paul College • BS Computer Science 2026
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
            Streak<span className="text-orange-500">ED</span>
          </h1>
          <p className="mt-3 text-lg sm:text-xl font-medium text-slate-300 max-w-2xl mx-auto">
            A Gamified Attendance Tracking System with Streak-Based Motivation for Senior High & College Students
          </p>

          <p className="mt-3 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Engineered by <strong className="text-slate-200">Lucky Lawrence C. Fernandez</strong> & <strong className="text-slate-200">Jemuel Delos Reyes</strong>.
            Replacing passive roll calls with behavioral streak mechanics, tiered milestone badges, and live projector leaderboards.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard/student"
              className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-500/20 hover:brightness-110 transition"
            >
              <img src="/icons/3d/legend.png" alt="3D Flame" className="h-6 w-6 object-contain filter drop-shadow" /> Open Student HUD
            </Link>
            <Link
              href="/dashboard/teacher/scanner"
              className="flex items-center gap-2 rounded-2xl bg-slate-900 border border-slate-700 px-6 py-3.5 text-sm font-bold text-slate-200 hover:text-white hover:border-orange-500 transition shadow-lg"
            >
              <QrCode className="h-5 w-5 text-orange-400" /> Open Scanner Console
            </Link>
            <Link
              href="/dashboard/teacher/projector"
              className="flex items-center gap-2 rounded-2xl bg-slate-900 border border-slate-700 px-6 py-3.5 text-sm font-bold text-slate-200 hover:text-white hover:border-orange-500 transition shadow-lg"
            >
              <MonitorPlay className="h-5 w-5 text-amber-400" /> Launch Projector Screen
            </Link>
          </div>
        </div>
      </div>

      {/* Role Launchpad Cards */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl pb-24">
        <div className="border-t border-slate-800/80 pt-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-white">Fullstack System Module Navigator</h2>
            <p className="text-xs text-slate-400 mt-1">Explore all stakeholder portals implemented for this project.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/60 p-6 transition-all duration-300 hover:border-orange-500/50 hover:bg-slate-900 hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${item.color} text-white shadow-lg`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-slate-800/90 border border-slate-700 px-3 py-1 text-[10px] font-bold text-slate-300">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="mt-5 text-base font-bold text-white group-hover:text-orange-400 transition">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-1 text-xs font-bold text-orange-400 group-hover:translate-x-1 transition-transform">
                    <span>Launch Portal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
