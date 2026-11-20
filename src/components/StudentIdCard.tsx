"use client";

import { QRCodeSVG } from "qrcode.react";
import { StudentProfile } from "@/types";
import { Flame, ShieldCheck, School } from "lucide-react";

interface StudentIdCardProps {
  student: StudentProfile;
}

export function StudentIdCard({ student }: StudentIdCardProps) {
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-2xl">
      {/* Decorative background glow */}
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-amber-500/10 blur-3xl" />

      {/* Header with College Name */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white shadow">
            <School className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-black tracking-widest text-slate-200 uppercase">
              John Paul College
            </h3>
            <p className="text-[10px] text-orange-400 font-medium">Department of Computer Science</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 px-2.5 py-0.5 text-[10px] font-bold text-orange-400">
          <img src="/icons/3d/legend.png" alt="3D Flame" className="h-4 w-4 object-contain filter drop-shadow" />
          {student.currentStreak}D STREAK
        </div>
      </div>

      {/* Card Body with Photo & QR Code */}
      <div className="mt-5 flex flex-col items-center">
        {/* QR Code Container */}
        <div className="rounded-2xl bg-white p-3 shadow-xl ring-4 ring-orange-500/20">
          <QRCodeSVG
            value={student.studentIdNumber}
            size={160}
            level="H"
            includeMargin={false}
          />
        </div>
        <p className="mt-2 font-mono text-xs font-bold tracking-widest text-slate-300">
          {student.studentIdNumber}
        </p>

        {/* Student Info */}
        <div className="mt-4 text-center">
          <h2 className="text-lg font-black text-white">{student.name}</h2>
          <p className="text-xs text-slate-400">Bachelor of Science in Computer Science</p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-800/80 px-2 py-1 text-[11px] font-medium text-slate-300 border border-slate-700">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              Verified Student
            </span>
            <span className="rounded-md bg-amber-500/10 px-2 py-1 text-[11px] font-bold text-amber-400 border border-amber-500/20">
              Pass: Active
            </span>
          </div>
        </div>
      </div>

      {/* Simulated 1D Barcode Graphic */}
      <div className="mt-6 border-t border-slate-800/80 pt-4 flex flex-col items-center">
        <div className="h-10 w-full flex items-center justify-center gap-[2px] bg-white/95 rounded px-3 py-1">
          {Array.from({ length: 46 }).map((_, i) => (
            <div
              key={i}
              className="bg-black h-full"
              style={{
                width: i % 4 === 0 ? "3px" : i % 2 === 0 ? "1px" : "2px",
                opacity: i % 7 === 0 ? 0.3 : 1,
              }}
            />
          ))}
        </div>
        <p className="mt-1 font-mono text-[10px] tracking-widest text-slate-400 uppercase">
          BARCODE SCANNABLE VIA SCHOOL ID
        </p>
      </div>
    </div>
  );
}
