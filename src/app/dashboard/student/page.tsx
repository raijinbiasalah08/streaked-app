"use client";

import { useState, useEffect } from "react";
import { FlameStreak } from "@/components/FlameStreak";
import { BadgeCard } from "@/components/BadgeCard";
import { StudentIdCard } from "@/components/StudentIdCard";
import { AttendanceHeatmap } from "@/components/AttendanceHeatmap";
import { getBadgesWithProgress } from "@/lib/streakEngine";
import { StudentProfile } from "@/types";
import { ShieldCheck, Snowflake, Award, UserCheck, Sparkles, RefreshCw, ChevronDown } from "lucide-react";

export default function StudentDashboardPage() {
  const [studentsList, setStudentsList] = useState<Array<{ id: string; name: string; studentIdNumber: string }>>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [student, setStudent] = useState<StudentProfile | null>(null);

  // 1. Fetch available students list
  useEffect(() => {
    async function loadStudents() {
      try {
        const res = await fetch("/api/student");
        const data = await res.json();
        if (data.success && data.students.length > 0) {
          setStudentsList(data.students);
          // Default to Lucky Lawrence C. Fernandez if present
          const lucky = data.students.find((s: any) => s.studentIdNumber === "2026-00101-SHS");
          setSelectedStudentId(lucky ? lucky.id : data.students[0].id);
        }
      } catch (err) {
        console.error("Error loading students list", err);
      }
    }
    loadStudents();
  }, []);

  // 2. Fetch selected student details
  useEffect(() => {
    if (!selectedStudentId) return;

    async function loadDetails() {
      setLoading(true);
      try {
        const res = await fetch(`/api/student?id=${selectedStudentId}`);
        const data = await res.json();
        if (data.success && data.student) {
          setStudent(data.student);
        }
      } catch (err) {
        console.error("Error loading student details", err);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [selectedStudentId]);

  if (loading && !student) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-orange-400 font-bold">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading Student HUD...</span>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-8 text-center">
        <p className="text-slate-400">Student not found. Please refresh or select a student.</p>
      </div>
    );
  }

  const unlockedBadgeIds = (student as any).earnedBadgeIds || [];
  const badgesWithProgress = getBadgesWithProgress(student.currentStreak, unlockedBadgeIds);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Switch Student Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-orange-400" /> Switch Student View (Evaluation Demo):
          </span>
          <div className="relative">
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="appearance-none rounded-xl bg-slate-950 border border-slate-700 px-4 py-2 pr-9 text-xs font-bold text-orange-400 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              {studentsList.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.studentIdNumber})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Top Student Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-950 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black text-2xl shadow-lg shadow-orange-500/20">
              {student.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white sm:text-3xl">{student.name}</h1>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Enrolled
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-1">
                Student ID: <span className="font-mono text-slate-300">{student.studentIdNumber}</span> • Section: BSCS 3-A
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</span>
              <p className="text-xl font-black text-emerald-400">{student.attendanceRate}%</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 justify-end">
                <Snowflake className="h-3 w-3 text-cyan-400" /> Streak Freeze
              </span>
              <p className="text-xl font-black text-cyan-400">{student.streakFreezesLeft} Left</p>
            </div>
          </div>
        </div>

        {/* Main Grid: HUD Flame + Quick Stats + Digital Pass */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Flame HUD & Performance Metrics */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-b from-orange-950/20 via-slate-900 to-slate-950 p-8 shadow-2xl text-center">
              <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-xs font-bold text-orange-400">
                <Sparkles className="h-3.5 w-3.5" /> ACTIVE STREAK
              </div>

              <FlameStreak
                streak={student.currentStreak}
                longestStreak={student.longestStreak}
                size="lg"
                showLabel={true}
              />

              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-slate-800/80 pt-6">
                <div className="rounded-2xl bg-slate-950/60 p-3 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Present</span>
                  <p className="text-xl font-black text-emerald-400 mt-0.5">{student.totalPresent} Days</p>
                </div>
                <div className="rounded-2xl bg-slate-950/60 p-3 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Late</span>
                  <p className="text-xl font-black text-amber-400 mt-0.5">{student.totalLate} Days</p>
                </div>
                <div className="rounded-2xl bg-slate-950/60 p-3 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Personal Best</span>
                  <p className="text-xl font-black text-orange-400 mt-0.5">{student.longestStreak} Days</p>
                </div>
              </div>
            </div>

            <AttendanceHeatmap currentStreak={student.currentStreak} />
          </div>

          {/* Right Column: Digital QR & Barcode Pass */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-orange-400" />
                  Digital Scannable School ID Pass
                </h3>
              </div>
              <StudentIdCard student={student} />
              <p className="text-center text-xs text-slate-400 max-w-sm mx-auto">
                Present this screen to the instructor's scanner or classroom kiosk every morning to check in and protect your streak.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Tiered Badges Showcase */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400" />
                Badge Trophy Room
              </h2>
              <p className="text-xs text-slate-400">Unlock tiered milestones by keeping your daily consecutive streak alive.</p>
            </div>
            <span className="text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-xl">
              {badgesWithProgress.filter((b) => b.isUnlocked).length} of {badgesWithProgress.length} Badges Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badgesWithProgress.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} currentStreak={student.currentStreak} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
