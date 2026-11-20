"use client";

import { useMemo } from "react";

interface AttendanceHeatmapProps {
  currentStreak: number;
}

export function AttendanceHeatmap({ currentStreak }: AttendanceHeatmapProps) {
  // Generate 60 days of historical attendance blocks
  const days = useMemo(() => {
    const list = [];
    const today = new Date();

    for (let i = 59; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;

      // Simulate attended days based on current streak
      let status: "present" | "late" | "absent" | "weekend" = "absent";
      if (isWeekend) {
        status = "weekend";
      } else if (i < currentStreak) {
        status = i === 4 ? "late" : "present";
      } else if (i % 7 === 1) {
        status = "late";
      } else if (i % 5 === 0) {
        status = "absent";
      } else {
        status = "present";
      }

      list.push({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        status,
      });
    }
    return list;
  }, [currentStreak]);

  const getColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-emerald-500 shadow-sm shadow-emerald-500/20";
      case "late":
        return "bg-amber-500 shadow-sm shadow-amber-500/20";
      case "absent":
        return "bg-rose-500/30 border border-rose-500/30";
      case "weekend":
      default:
        return "bg-slate-800/40";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white">Attendance Activity Heatmap</h3>
          <p className="text-xs text-slate-400">Past 60 days visual presence log</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Present
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" /> Late
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-rose-500/40" /> Absent
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-slate-800" /> Weekend
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
        {days.map((day, idx) => (
          <div
            key={idx}
            title={`${day.date}: ${day.status.toUpperCase()}`}
            className={`h-4 w-4 sm:h-5 sm:w-5 rounded-[4px] transition-all hover:scale-125 cursor-pointer ${getColor(
              day.status
            )}`}
          />
        ))}
      </div>
    </div>
  );
}
