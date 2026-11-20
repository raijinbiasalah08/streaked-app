"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { QrCode, MonitorPlay, Users, CheckCircle, Clock, AlertTriangle, Search, RefreshCw } from "lucide-react";

interface StudentRow {
  id: string;
  name: string;
  idNumber: string;
  status: "PRESENT" | "LATE" | "ABSENT" | "EXCUSED";
  currentStreak: number;
  timeCheckedIn?: string;
}

export default function TeacherConsolePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentRow[]>([]);

  const fetchRoster = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/roster");
      const data = await res.json();
      if (data.success && data.students) {
        setStudents(data.students);
      }
    } catch (err) {
      console.error("Failed to load roster", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoster();
  }, []);

  const updateStatus = async (studentId: string, newStatus: StudentRow["status"]) => {
    setUpdatingId(studentId);
    try {
      const res = await fetch("/api/attendance/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, status: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        setNotification(`Marked status as ${newStatus}`);
        setTimeout(() => setNotification(null), 3000);
        // Update local state
        setStudents((prev) =>
          prev.map((s) => {
            if (s.id !== studentId) return s;
            return {
              ...s,
              status: newStatus,
              currentStreak: data.newStreak !== undefined ? data.newStreak : s.currentStreak,
              timeCheckedIn: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
          })
        );
      }
    } catch (err) {
      console.error("Manual override error", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.idNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCount = students.length;
  const presentCount = students.filter((s) => s.status === "PRESENT").length;
  const lateCount = students.filter((s) => s.status === "LATE").length;
  const absentCount = students.filter((s) => s.status === "ABSENT").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-black text-white sm:text-3xl">Teacher Attendance Console</h1>
            <p className="text-sm text-slate-400 mt-1">
              Class: CS 301 (BSCS 3-A) • Room: Computer Lab 204 • Instructor: Prof. Alberto Mendoza
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchRoster}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:border-orange-500 transition"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Sync Roster
            </button>
            <Link
              href="/dashboard/teacher/scanner"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 transition"
            >
              <QrCode className="h-4 w-4" /> Open Scanner
            </Link>
            <Link
              href="/dashboard/teacher/projector"
              className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-200 hover:text-white hover:border-orange-500 transition"
            >
              <MonitorPlay className="h-4 w-4" /> Projector Mode
            </Link>
          </div>
        </div>

        {notification && (
          <div className="rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-3 text-xs font-bold text-emerald-300 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            {notification}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Total Enrolled</span>
              <Users className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-2xl font-black text-white mt-2">{totalCount} Students</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">Present</span>
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-emerald-400 mt-2">
              {presentCount} ({totalCount ? Math.round((presentCount / totalCount) * 100) : 0}%)
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">Late</span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-400 mt-2">
              {lateCount} ({totalCount ? Math.round((lateCount / totalCount) * 100) : 0}%)
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400">Absent</span>
              <AlertTriangle className="h-4 w-4 text-rose-400" />
            </div>
            <p className="text-2xl font-black text-rose-400 mt-2">
              {absentCount} ({totalCount ? Math.round((absentCount / totalCount) * 100) : 0}%)
            </p>
          </div>
        </div>

        {/* Manual Override Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-slate-800">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search student or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                Click actions to immediately record and update streak database
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">ID Number</th>
                  <th className="py-3 px-4">Streak</th>
                  <th className="py-3 px-4">Scan Time</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Manual Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-4 font-bold text-white">{st.name}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{st.idNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-orange-400">🔥 {st.currentStreak} Days</td>
                    <td className="py-3.5 px-4 text-slate-400">{st.timeCheckedIn || "--"}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          st.status === "PRESENT"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : st.status === "LATE"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : st.status === "EXCUSED"
                            ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {st.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => updateStatus(st.id, "PRESENT")}
                        disabled={updatingId === st.id}
                        className="rounded px-2 py-1 text-[10px] font-semibold bg-emerald-950 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900 disabled:opacity-50"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => updateStatus(st.id, "LATE")}
                        disabled={updatingId === st.id}
                        className="rounded px-2 py-1 text-[10px] font-semibold bg-amber-950 border border-amber-700/50 text-amber-300 hover:bg-amber-900 disabled:opacity-50"
                      >
                        Late
                      </button>
                      <button
                        onClick={() => updateStatus(st.id, "EXCUSED")}
                        disabled={updatingId === st.id}
                        className="rounded px-2 py-1 text-[10px] font-semibold bg-cyan-950 border border-cyan-700/50 text-cyan-300 hover:bg-cyan-900 disabled:opacity-50"
                      >
                        Excused
                      </button>
                      <button
                        onClick={() => updateStatus(st.id, "ABSENT")}
                        disabled={updatingId === st.id}
                        className="rounded px-2 py-1 text-[10px] font-semibold bg-rose-950 border border-rose-700/50 text-rose-300 hover:bg-rose-900 disabled:opacity-50"
                      >
                        Absent
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
