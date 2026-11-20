"use client";

import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { playSuccessChime, playLevelUpFanfare } from "@/lib/soundEffects";
import { Flame, CheckCircle, Volume2, VolumeX, QrCode, AlertCircle, RefreshCw, Award, User, Sparkles } from "lucide-react";

interface ScannedStudent {
  id: string;
  name: string;
  studentIdNumber: string;
  avatarUrl?: string;
  newStreak: number;
  longestStreak: number;
  status: string;
  newlyUnlockedBadge?: {
    name: string;
    description: string;
    tier: string;
  } | null;
}

export default function TeacherScannerPage() {
  const [manualId, setManualId] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [recentScans, setRecentScans] = useState<Array<ScannedStudent & { time: string }>>([]);
  const [modalStudent, setModalStudent] = useState<ScannedStudent | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Quick test students
  const testStudents = [
    { name: "Lucky Lawrence C. Fernandez", idNumber: "2026-00101-SHS" },
    { name: "Jemuel Delos Reyes", idNumber: "2026-00102-SHS" },
    { name: "Maria Santos", idNumber: "2026-00103-SHS" },
    { name: "Juan Dela Cruz", idNumber: "2026-00104-SHS" },
  ];

  // Process a scanned or entered student ID
  const processStudentScan = async (idNumber: string) => {
    if (!idNumber || loading) return;
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/attendance/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentIdNumber: idNumber.trim(),
          status: "PRESENT",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatusMessage({ text: data.message || "Failed to scan student", type: "error" });
        return;
      }

      const student: ScannedStudent = data.student;

      // Play audio feedback
      if (audioEnabled) {
        if (student.newlyUnlockedBadge) {
          playLevelUpFanfare();
        } else {
          playSuccessChime();
        }
      }

      setModalStudent(student);
      setRecentScans((prev) => [
        { ...student, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) },
        ...prev.slice(0, 9),
      ]);

      setStatusMessage({ text: data.message, type: "success" });
      setManualId("");
    } catch (err) {
      console.error(err);
      setStatusMessage({ text: "Connection error with attendance API.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Setup HTML5 QR Code Scanner
  useEffect(() => {
    if (!scannerActive) return;

    try {
      const scanner = new Html5QrcodeScanner(
        "qr-reader-container",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );

      scanner.render(
        (decodedText) => {
          processStudentScan(decodedText);
        },
        () => {
          // ignore scan frame errors
        }
      );

      scannerRef.current = scanner;
    } catch (err) {
      console.error("Scanner init error:", err);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [scannerActive]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <QrCode className="h-5 w-5" />
              </span>
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                Attendance QR & Barcode Scanner
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Live scanning console for CS 301 (BSCS 3-A). Scan student IDs to register attendance and increment streaks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold border transition ${
                audioEnabled
                  ? "bg-slate-900 border-orange-500/40 text-orange-400"
                  : "bg-slate-900/60 border-slate-800 text-slate-500"
              }`}
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              {audioEnabled ? "Audio On" : "Muted"}
            </button>

            <button
              onClick={() => setScannerActive(!scannerActive)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-lg transition ${
                scannerActive
                  ? "bg-rose-600 hover:bg-rose-500 text-white"
                  : "bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white"
              }`}
            >
              <QrCode className="h-4 w-4" />
              {scannerActive ? "Close Camera" : "Open Camera Scanner"}
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {statusMessage && (
          <div
            className={`mt-6 flex items-center gap-2.5 rounded-xl p-4 border text-sm font-medium ${
              statusMessage.type === "success"
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                : "bg-rose-950/40 border-rose-500/40 text-rose-300"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Live Camera & Manual Fallback */}
          <div className="lg:col-span-7 space-y-6">
            {/* Camera View Box */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-orange-400" />
                  Optical Camera Feed
                </h3>
                <span className="text-xs text-slate-400">QR Code / Barcode (Code128)</span>
              </div>

              <div className="mt-4 flex flex-col items-center justify-center min-h-[300px] rounded-xl bg-slate-950 border border-slate-800/80 p-4">
                {scannerActive ? (
                  <div id="qr-reader-container" className="w-full max-w-sm" />
                ) : (
                  <div className="text-center p-8">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500">
                      <QrCode className="h-8 w-8" />
                    </div>
                    <h4 className="mt-4 font-bold text-slate-300">Camera is currently standby</h4>
                    <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
                      Click the button below or use manual input to simulate ID scanning instantly.
                    </p>
                    <button
                      onClick={() => setScannerActive(true)}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500/20 border border-orange-500/40 px-4 py-2 text-xs font-bold text-orange-400 hover:bg-orange-500/30 transition"
                    >
                      Activate Camera Scanner
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Manual ID Input & Quick Simulation */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="font-bold text-white text-sm">Manual Barcode / ID Input (Fallback)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Barcode scanner devices emulate keyboard typing; type or click below to simulate.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  processStudentScan(manualId);
                }}
                className="mt-4 flex gap-2"
              >
                <input
                  type="text"
                  placeholder="e.g. 2026-00101-SHS"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  disabled={loading || !manualId}
                  className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50 transition"
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Check In"}
                </button>
              </form>

              {/* Quick simulation buttons */}
              <div className="mt-5 border-t border-slate-800 pt-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Instant Test Badges (Click to check in):
                </span>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {testStudents.map((s) => (
                    <button
                      key={s.idNumber}
                      type="button"
                      onClick={() => processStudentScan(s.idNumber)}
                      className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:border-orange-500/50 hover:text-orange-400 transition"
                    >
                      <span className="font-semibold">{s.name.split(" ")[0]}</span> ({s.idNumber})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Session Feed */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Today's Live Check-Ins
                </h3>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  {recentScans.length} Students
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {recentScans.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    No scans registered in this session yet. Ready to scan!
                  </div>
                ) : (
                  recentScans.map((scan, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl bg-slate-950/80 border border-slate-800/80 p-3 shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-300 font-bold text-sm">
                          {scan.name[0]}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{scan.name}</p>
                          <p className="font-mono text-[10px] text-slate-400">{scan.studentIdNumber}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-orange-400 font-black text-xs">
                          <Flame className="h-3.5 w-3.5 fill-orange-500" />
                          {scan.newStreak}D
                        </div>
                        <span className="text-[10px] text-slate-400">{scan.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Verification & Celebration Pop-up */}
        {modalStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-orange-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-2xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-orange-500/40 shadow-xl shadow-orange-500/20">
                <img src="/icons/3d/legend.png" alt="3D Flame" className="h-12 w-12 object-contain filter drop-shadow animate-bounce" />
              </div>

              <span className="mt-4 inline-block rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-400">
                CHECK-IN VERIFIED
              </span>

              <h2 className="mt-2 text-xl font-black text-white">{modalStudent.name}</h2>
              <p className="font-mono text-xs text-slate-400">{modalStudent.studentIdNumber}</p>

              <div className="my-6 rounded-2xl bg-slate-950/90 border border-slate-800 p-4">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Current Attendance Streak</p>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <img src="/icons/3d/legend.png" alt="3D Flame" className="h-8 w-8 object-contain filter drop-shadow animate-pulse" />
                  <span className="text-4xl font-black text-white">{modalStudent.newStreak}</span>
                  <span className="text-sm font-bold text-orange-400">Days</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Best Record: <span className="text-amber-400 font-bold">{modalStudent.longestStreak} Days</span>
                </p>
              </div>

              {/* Newly Unlocked Badge notification */}
              {modalStudent.newlyUnlockedBadge && (
                <div className="mb-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-left">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Sparkles className="h-4 w-4" />
                    NEW BADGE UNLOCKED!
                  </div>
                  <h4 className="mt-1 text-xs font-bold text-white">{modalStudent.newlyUnlockedBadge.name}</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">{modalStudent.newlyUnlockedBadge.description}</p>
                </div>
              )}

              <button
                onClick={() => setModalStudent(null)}
                className="w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white hover:bg-orange-600 transition shadow-lg"
              >
                Dismiss & Next Student
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
