"use client";

import { useState, useEffect } from "react";
import { Flame, Trophy, Maximize, Minimize, Sparkles } from "lucide-react";

interface LeaderboardStudent {
  rank: number;
  idNumber: string;
  name: string;
  currentStreak: number;
  longestStreak: number;
  tier: string;
  tierColor: string;
  statusToday: "PRESENT" | "LATE" | "ABSENT" | "PENDING";
}

export default function ProjectorLeaderboardPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [students, setStudents] = useState<LeaderboardStudent[]>([]);
  const [syncStatus, setSyncStatus] = useState<"LIVE" | "SYNCING">("LIVE");

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      if (data.success && data.students) {
        setStudents(data.students);
      }
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
    }
  };

  // Clock interval & live polling every 3 seconds
  useEffect(() => {
    fetchLeaderboard();

    const clockInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );
    }, 1000);

    const pollInterval = setInterval(() => {
      setSyncStatus("SYNCING");
      fetchLeaderboard().then(() => {
        setTimeout(() => setSyncStatus("LIVE"), 600);
      });
    }, 3000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(pollInterval);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10 select-none">
      {/* High-Contrast Projector Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-orange-500/40 shadow-2xl shadow-orange-500/30">
            <img src="/icons/3d/legend.png" alt="3D Flame" className="h-11 w-11 object-contain filter drop-shadow animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Streak<span className="text-orange-500">ED</span> LIVE LEADERBOARD
              </h1>
              <span className="rounded-full bg-orange-500/20 border border-orange-500/40 px-3 py-1 text-xs font-black text-orange-400">
                CLASS PROJECTOR MODE
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-400 mt-1">
              CS 301 (BSCS 3-A) • Department of Computer Science • John Paul College
            </p>
          </div>
        </div>

        {/* Live Clock & Fullscreen Control */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="font-mono text-2xl sm:text-3xl font-black text-orange-400 tracking-wider">
              {currentTime || "08:00:00 AM"}
            </p>
            <p className="text-xs font-semibold text-slate-400">{currentDate}</p>
          </div>

          <button
            onClick={toggleFullscreen}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-orange-500 transition shadow-lg"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Main Leaderboard Table Display */}
      <div className="my-8 flex-1">
        <div className="overflow-hidden rounded-3xl border-2 border-slate-800 bg-slate-900/60 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-12 bg-slate-950 px-8 py-5 text-sm font-black tracking-wider text-slate-400 uppercase border-b-2 border-slate-800">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-6">Student Name & ID</div>
            <div className="col-span-3 text-center">Badge Tier</div>
            <div className="col-span-2 text-right">Consecutive Streak</div>
          </div>

          <div className="divide-y divide-slate-800/80">
            {students.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-bold text-sm">
                Loading live students from classroom database...
              </div>
            ) : (
              students.map((st) => (
                <div
                  key={st.idNumber}
                  className={`grid grid-cols-12 items-center px-8 py-5 transition-all ${
                    st.rank === 1 ? "bg-orange-950/20" : "hover:bg-slate-900/40"
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex justify-center">
                    {st.rank === 1 ? (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 border border-amber-500/40 shadow-lg shadow-amber-500/20">
                        <img src="/icons/3d/trophy.png" alt="1st Place Trophy" className="h-8 w-8 object-contain filter drop-shadow" />
                      </div>
                    ) : st.rank === 2 ? (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 border border-slate-600 shadow-lg">
                        <img src="/icons/3d/silver.png" alt="2nd Place Shield" className="h-8 w-8 object-contain filter drop-shadow" />
                      </div>
                    ) : st.rank === 3 ? (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 border border-amber-800 shadow-lg">
                        <img src="/icons/3d/bronze.png" alt="3rd Place Medal" className="h-8 w-8 object-contain filter drop-shadow" />
                      </div>
                    ) : (
                      <span className="font-mono text-xl font-bold text-slate-500">#{st.rank}</span>
                    )}
                  </div>

                  {/* Student Name */}
                  <div className="col-span-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 text-white font-bold text-lg">
                      {st.name[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white flex items-center gap-2">
                        {st.name}
                        {st.statusToday === "PRESENT" && (
                          <span className="rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 border border-emerald-500/30 font-bold">
                            CHECKED IN
                          </span>
                        )}
                        {st.statusToday === "LATE" && (
                          <span className="rounded-full bg-amber-500/20 text-amber-400 text-[10px] px-2 py-0.5 border border-amber-500/30 font-bold">
                            LATE
                          </span>
                        )}
                      </h3>
                      <p className="font-mono text-xs font-semibold text-slate-400">{st.idNumber}</p>
                    </div>
                  </div>

                  {/* Tier */}
                  <div className="col-span-3 flex justify-center">
                    <span className="rounded-full bg-slate-800/80 border border-slate-700 px-4 py-1.5 text-xs font-bold text-slate-200 shadow">
                      {st.tier}
                    </span>
                  </div>

                  {/* Streak Count */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <img src="/icons/3d/legend.png" alt="3D Streak" className="h-8 w-8 object-contain filter drop-shadow animate-pulse" />
                    <div className="text-right">
                      <span className="text-3xl font-black text-white">{st.currentStreak}</span>
                      <span className="text-xs font-bold text-orange-400 ml-1">DAYS</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-orange-400" />
          <span>
            Projecting live attendance in real-time. Scan student IDs using the teacher console to
            update instantly.
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-slate-400">
          <span>{syncStatus === "LIVE" ? "Live Connected" : "Syncing..."}</span>
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              syncStatus === "LIVE" ? "bg-emerald-400 animate-ping" : "bg-amber-400"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
