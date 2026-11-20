"use client";

import { useState, useEffect } from "react";
import { Shield, TrendingUp, AlertTriangle, Download, Users, School, Flame, RefreshCw } from "lucide-react";

export default function AdminDashboardPage() {
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalStudents: 5,
    activeStreaksCount: 5,
    legendBadgesCount: 1,
    campusAttendanceRate: 96.4,
    atRiskStudents: [] as Array<{ id: string; name: string; idNumber: string; section: string }>,
    exportRows: [] as Array<{
      studentId: string;
      studentName: string;
      section: string;
      date: string;
      status: string;
      remarks: string;
    }>,
  });

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/metrics");
      const data = await res.json();
      if (data.success && data.metrics) {
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Admin metrics load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleExportCSV = () => {
    setDownloading(true);
    const headers = "Student ID,Student Name,Section,Date,Status,Remarks\n";
    const rows =
      metrics.exportRows.length > 0
        ? metrics.exportRows
            .map(
              (r) =>
                `"${r.studentId}","${r.studentName}","${r.section}","${r.date}","${r.status}","${r.remarks.replace(
                  /"/g,
                  '""'
                )}"`
            )
            .join("\n")
        : "N/A,No Records,BSCS 3-A,2026-11-20,PRESENT,Demo";

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `StreakED_Attendance_Export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setDownloading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white sm:text-3xl">Administrative Analytics</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Institutional Academic Monitoring • John Paul College, Roxas, Oriental Mindoro
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchMetrics}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:border-orange-500 transition"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Sync Metrics
            </button>
            <button
              onClick={handleExportCSV}
              disabled={downloading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 transition"
            >
              <Download className="h-4 w-4" />
              {downloading ? "Generating..." : "Export Attendance CSV"}
            </button>
          </div>
        </div>

        {/* Academic Proponents Credit Note */}
        <div className="rounded-2xl border border-orange-500/30 bg-orange-950/20 p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <School className="h-5 w-5 text-orange-400 shrink-0" />
            <p className="text-xs text-slate-300">
              <strong className="text-white">StreakED Project Proponents:</strong> Lucky Lawrence C. Fernandez & Jemuel Delos Reyes (BSCS, 2026)
            </p>
          </div>
          <span className="rounded-full bg-orange-500/20 border border-orange-500/40 px-3 py-1 text-[11px] font-bold text-orange-400">
            JPC Capstone Research
          </span>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <span className="text-xs font-bold text-slate-400 uppercase">Campus Attendance</span>
            <p className="text-3xl font-black text-emerald-400 mt-2">{metrics.campusAttendanceRate}%</p>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> Real-time active logs
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Streaks</span>
            <p className="text-3xl font-black text-orange-400 mt-2">{metrics.activeStreaksCount} Students</p>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-orange-400" /> Continuous classroom presence
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <span className="text-xs font-bold text-slate-400 uppercase">At-Risk Absentees</span>
            <p className="text-3xl font-black text-rose-400 mt-2">{metrics.atRiskStudents.length} Students</p>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-400" /> Streak at 0 days
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <span className="text-xs font-bold text-slate-400 uppercase">Elite Badges</span>
            <p className="text-3xl font-black text-purple-400 mt-2">{metrics.legendBadgesCount} Unlocked</p>
            <p className="text-[11px] text-slate-400 mt-1">Platinum & Legend tiers</p>
          </div>
        </div>

        {/* Section Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h3 className="text-base font-bold text-white mb-4">Department Sections & Attendance Rate</h3>
          <div className="space-y-4">
            {[
              { section: "BSCS 3-A", instructor: "Prof. Alberto Mendoza", rate: metrics.campusAttendanceRate, students: metrics.totalStudents },
              { section: "BSCS 3-B", instructor: "Prof. Alberto Mendoza", rate: 91.2, students: 35 },
              { section: "Grade 12 STEM - Newton", instructor: "Ms. Clara Ramos", rate: 94.0, students: 42 },
              { section: "Grade 11 ICT - Turing", instructor: "Mr. David Cruz", rate: 89.5, students: 40 },
            ].map((sec, i) => (
              <div key={i} className="rounded-xl bg-slate-950 p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-white text-sm">{sec.section}</h4>
                  <p className="text-xs text-slate-400">{sec.instructor} • {sec.students} Enrolled</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: `${sec.rate}%` }} />
                  </div>
                  <span className="font-bold text-emerald-400 text-sm font-mono">{sec.rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
