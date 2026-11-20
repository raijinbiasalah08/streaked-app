"use client";

import { motion } from "framer-motion";

interface FlameStreakProps {
  streak: number;
  longestStreak?: number;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
}

export function FlameStreak({
  streak,
  longestStreak,
  size = "md",
  showLabel = true,
}: FlameStreakProps) {
  // Determine flame aura & color grading based on streak tiers
  let glowColor = "rgba(249, 115, 22, 0.4)";
  let tierTitle = "Spark";

  if (streak >= 100) {
    glowColor = "rgba(236, 72, 153, 0.6)";
    tierTitle = "StreakED Legend 👑";
  } else if (streak >= 60) {
    glowColor = "rgba(59, 130, 246, 0.5)";
    tierTitle = "Platinum Elite 💎";
  } else if (streak >= 30) {
    glowColor = "rgba(245, 158, 11, 0.5)";
    tierTitle = "Gold Vanguard 🏆";
  } else if (streak >= 15) {
    glowColor = "rgba(249, 115, 22, 0.45)";
    tierTitle = "Silver Achiever 🛡️";
  } else if (streak >= 7) {
    glowColor = "rgba(234, 88, 12, 0.4)";
    tierTitle = "Bronze Scholar 🥉";
  } else if (streak >= 3) {
    glowColor = "rgba(251, 146, 60, 0.35)";
    tierTitle = "Starter Flame ✨";
  }

  const dimensions = {
    sm: { container: "h-20 w-20", icon: "h-10 w-10", number: "text-lg" },
    md: { container: "h-32 w-32", icon: "h-16 w-16", number: "text-3xl" },
    lg: { container: "h-44 w-44", icon: "h-24 w-24", number: "text-5xl" },
    xl: { container: "h-60 w-60", icon: "h-32 w-32", number: "text-7xl" },
  }[size];

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative flex items-center justify-center">
        {/* Animated ambient 3D aura pulse */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.45, 0.85, 0.45],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute rounded-full blur-3xl ${dimensions.container}`}
          style={{ background: glowColor }}
        />

        {/* Dynamic 3D Flame Showcase */}
        <motion.div
          animate={{
            y: [-3, 4, -3],
            rotate: [-2, 2, -2],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`relative z-10 flex flex-col items-center justify-center rounded-3xl border border-orange-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950 p-2 shadow-2xl backdrop-blur-md ${dimensions.container}`}
        >
          {/* Real 3D Fire Icon */}
          <img
            src="/icons/3d/legend.png"
            alt="3D Attendance Flame"
            className={`${dimensions.icon} object-contain filter drop-shadow-[0_8px_16px_rgba(249,115,22,0.6)]`}
          />
          <span className={`font-black tracking-tight text-white ${dimensions.number} drop-shadow-lg -mt-1`}>
            {streak}
          </span>
        </motion.div>
      </div>

      {showLabel && (
        <div className="mt-4 flex flex-col items-center">
          <span className="rounded-full bg-slate-900 px-3 py-1 font-bold text-orange-400 border border-slate-800 text-xs shadow-inner">
            {tierTitle}
          </span>
          <p className="mt-1.5 font-bold tracking-wider text-slate-300 uppercase text-xs">
            {streak === 1 ? "Day In A Row" : "Days In A Row"}
          </p>
          {longestStreak !== undefined && (
            <p className="mt-0.5 text-xs text-slate-400">
              Personal Best: <span className="font-semibold text-amber-400">{longestStreak} days</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
