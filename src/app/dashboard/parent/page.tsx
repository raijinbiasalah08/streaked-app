"use client";

import { useState, useEffect } from "react";
import { Users, Flame, Calendar, Bell, Clock, RefreshCw, ChevronDown } from "lucide-react";

export default function ParentPortalPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [studentsList, setStudentsList] = useState<Array<{ id: string; name: string; studentIdNumber: string }>>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch available students list
  useEffect(() => {
    async function loadStudents() {
      try {
        const res = await fetch("/api/student");
        const data = await res.json();
        if (data.success && data.students.length > 0) {
          setStudentsList(data.students);
          const lucky = data.students.find((s: any) => s.studentIdNumber === "2026-00101-SHS");
          setSelectedStudentId(lucky ? lucky.id : data.students[0].id);
        }
      } catch (err) {
        console.error("Error loading students", err);
      }
    }
    loadStudents();
  }, []);

  // 2. Load student details
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
        console.error("Error loading details", err);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [selectedStudentId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white sm:text-3xl">Parent & Guardian Portal</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Monitoring student consistency & attendance streak in real-time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold border transition ${
                notificationsEnabled
                  ? "bg-slate-900 border-orange-500/40 text-orange-400"
                  : "bg-slate-900 border-slate-800 text-slate-500"
              }`}
            >
              <Bell className="h-4 w-4" />
              {notificationsEnabled ? "Absence SMS Alerts: ON" : "Alerts: Muted"}
            </button>
          </div>
        </div>

        {/* Student Selector */}
        <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-bold text-slate-300">Select Child to Monitor:</span>
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

        {/* Student Overview Card */}
        {student && (
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-xs font-bold text-orange-400">
                  Child's Profile
                </span>
                <h2 className="text-2xl font-black text-white mt-2">{student.name}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  ID: <span className="font-mono text-slate-300 font-bold">{student.studentIdNumber}</span> • BS Computer Science
                </p>
                <p className="text-xs text-slate-400 mt-0.5">John Paul College, Roxas, Oriental Mindoro</p>
              </div>

              <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 border border-orange-500/30">
                  <img src="/icons/3d/legend.png" alt="3D Streak Flame" className="h-10 w-10 object-contain filter drop-shadow animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Active Streak</p>
                  <p className="text-2xl font-black text-white">{student.currentStreak} Days</p>
                  <p className="text-[11px] text-emerald-400 font-semibold">{student.attendanceRate}% Attendance Rate</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Log */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-400" />
            Verified Attendance History & Alerts
          </h3>

          <div className="space-y-3">
            {!student || !student.recentRecords || student.recentRecords.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                {loading ? "Loading attendance records..." : "No recent attendance records logged."}
              </div>
            ) : (
              student.recentRecords.map((log: any, i: number) => (
                <div
                  key={log.id || i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-slate-950 p-4 border border-slate-800/80"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {new Date(log.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          log.status === "PRESENT"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : log.status === "LATE"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{log.remarks || "Attendance registered"}</p>
                  </div>
                  <div className="font-mono text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(log.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
