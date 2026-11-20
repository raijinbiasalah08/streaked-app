"use client";

import { BadgeDefinition } from "@/types";
import { Lock } from "lucide-react";
import Image from "next/image";

interface BadgeCardProps {
  badge: BadgeDefinition;
  currentStreak: number;
}

export function BadgeCard({ badge, currentStreak }: BadgeCardProps) {
  const isUnlocked = badge.isUnlocked || currentStreak >= badge.requiredStreak;
  const progress = isUnlocked
    ? 100
    : Math.min(100, Math.round((currentStreak / badge.requiredStreak) * 100));

  // Map each badge to its high-resolution real 3D rendered icon asset
  const get3DIconSrc = (badgeId: string) => {
    switch (badgeId) {
      case "badge-starter":
        return "/icons/3d/starter.png"; // 3D Golden Sparkles
      case "badge-bronze":
        return "/icons/3d/bronze.png"; // 3D Bronze Medal
      case "badge-silver":
        return "/icons/3d/silver.png"; // 3D Silver Shield
      case "badge-gold":
        return "/icons/3d/gold.png"; // 3D Royal Gold Crown
      case "badge-platinum":
        return "/icons/3d/platinum.png"; // 3D Diamond Gem
      case "badge-legend":
        return "/icons/3d/legend.png"; // 3D Cosmic Fire
      default:
        return "/icons/3d/trophy.png"; // 3D Gold Trophy
    }
  };

  const iconSrc = get3DIconSrc(badge.id);

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-5 transition-all duration-300 ${
        isUnlocked
          ? "border-orange-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 shadow-xl shadow-orange-500/10 hover:border-orange-500/70 hover:shadow-orange-500/20 hover:-translate-y-1"
          : "border-slate-800/80 bg-slate-950/70 opacity-75 hover:opacity-95 hover:border-slate-700"
      }`}
    >
      {/* Top subtle 3D glass sheen reflection */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Top Banner with 3D Icon & Status */}
      <div className="flex items-start justify-between gap-3">
        {/* 3D Icon Showcase Container */}
        <div className="relative">
          {/* Ambient glow behind 3D icon */}
          {isUnlocked && (
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-orange-500/30 to-amber-400/20 blur-md pointer-events-none" />
          )}

          <div
            className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-300 ${
              isUnlocked
                ? "border-orange-500/30 bg-gradient-to-b from-slate-800/80 to-slate-900/90 shadow-lg shadow-orange-500/15 group-hover:scale-105"
                : "border-slate-800 bg-slate-900/50"
            }`}
          >
            {/* Real 3D Icon Image */}
            <div className="relative h-12 w-12 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
              <img
                src={iconSrc}
                alt={badge.name}
                className={`h-full w-full object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)] ${
                  isUnlocked ? "" : "grayscale opacity-50 contrast-75"
                }`}
              />
            </div>
          </div>
        </div>

        <div>
          {isUnlocked ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-black tracking-wide text-emerald-400 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              UNLOCKED
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/90 border border-slate-700/80 px-2.5 py-0.5 text-[10px] font-semibold text-slate-400 shadow-inner">
              <Lock className="h-3 w-3 text-slate-400" />
              LOCKED
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        <h4 className="text-base font-black text-white group-hover:text-orange-400 transition-colors">
          {badge.name}
        </h4>
        <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {badge.description}
        </p>
      </div>

      {/* Progress & Milestone Requirement */}
      <div className="mt-5 pt-3.5 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
          <span className="text-slate-400">
            {isUnlocked ? "Milestone Achieved" : `${currentStreak} / ${badge.requiredStreak} Days`}
          </span>
          <span className={isUnlocked ? "text-emerald-400" : "text-amber-400 font-mono"}>
            {badge.requiredStreak} Days Goal
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/90 shadow-inner">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isUnlocked
                ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 shadow-sm shadow-emerald-500/30"
                : "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 shadow-sm shadow-orange-500/20"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
