import { BadgeTier, AttendanceStatus, BadgeDefinition } from "@/types";

export const SYSTEM_BADGES: Omit<BadgeDefinition, "isUnlocked" | "unlockedAt" | "progress">[] = [
  {
    id: "badge-starter",
    name: "Starter Flame",
    description: "Maintained a 3-day consecutive attendance streak. The fire has ignited!",
    tier: "STARTER",
    requiredStreak: 3,
    icon: "Sparkles",
    color: "from-amber-400 to-orange-500",
  },
  {
    id: "badge-bronze",
    name: "Bronze Scholar",
    description: "Completed 7 consecutive school days without missing a single class.",
    tier: "BRONZE",
    requiredStreak: 7,
    icon: "Award",
    color: "from-amber-600 to-amber-800",
  },
  {
    id: "badge-silver",
    name: "Silver Achiever",
    description: "Reformed consistency with a 15-day streak. Half a month unbroken!",
    tier: "SILVER",
    requiredStreak: 15,
    icon: "ShieldCheck",
    color: "from-slate-300 to-slate-500",
  },
  {
    id: "badge-gold",
    name: "Gold Vanguard",
    description: "Reached 30 consecutive days of impeccable classroom presence.",
    tier: "GOLD",
    requiredStreak: 30,
    icon: "Crown",
    color: "from-yellow-400 to-amber-500",
  },
  {
    id: "badge-platinum",
    name: "Platinum Elite",
    description: "Unshakable commitment: 60 continuous days of academic punctuality.",
    tier: "PLATINUM",
    requiredStreak: 60,
    icon: "Zap",
    color: "from-cyan-400 to-blue-600",
  },
  {
    id: "badge-legend",
    name: "StreakED Legend",
    description: "The Pinnacle! 100 consecutive days of attendance perfection.",
    tier: "LEGEND",
    requiredStreak: 100,
    icon: "Flame",
    color: "from-purple-500 via-pink-500 to-orange-500",
  },
];

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

export function areSameCalendarDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Calculates the count of school days (skipping weekends) between two dates.
 */
export function getSchoolDaysDiff(earlier: Date, later: Date): number {
  const start = new Date(earlier);
  start.setHours(0, 0, 0, 0);

  const end = new Date(later);
  end.setHours(0, 0, 0, 0);

  if (start.getTime() > end.getTime()) {
    return -1;
  }

  let schoolDays = 0;
  const current = new Date(start);
  current.setDate(current.getDate() + 1);

  while (current.getTime() <= end.getTime()) {
    if (!isWeekend(current)) {
      schoolDays++;
    }
    current.setDate(current.getDate() + 1);
  }

  return schoolDays;
}

export interface StreakEvaluationResult {
  newStreak: number;
  newLongestStreak: number;
  newLastAttendedDate: Date;
  status: AttendanceStatus;
  streakIncremented: boolean;
  streakReset: boolean;
  freezeUsed: boolean;
  newlyUnlockedBadges: BadgeDefinition[];
  message: string;
}

/**
 * Streak Calculation Engine
 * 1. Present / Late: Increments if attended on previous school day or starts a fresh streak.
 * 2. Excused: Preserves streak (streak freeze).
 * 3. Absent: Resets streak to 0 unless streak freeze is used.
 */
export function calculateAttendanceStreak(params: {
  currentStreak: number;
  longestStreak: number;
  lastAttendedDate: Date | null;
  checkInDate: Date;
  status: AttendanceStatus;
  streakFreezesLeft: number;
  useFreezeIfAbsent?: boolean;
  existingBadgeIds: string[];
}): StreakEvaluationResult {
  const {
    currentStreak,
    longestStreak,
    lastAttendedDate,
    checkInDate,
    status,
    streakFreezesLeft,
    useFreezeIfAbsent = false,
    existingBadgeIds,
  } = params;

  let newStreak = currentStreak;
  let newLongestStreak = longestStreak;
  let newLastAttendedDate = checkInDate;
  let streakIncremented = false;
  let streakReset = false;
  let freezeUsed = false;
  let message = "Attendance recorded successfully.";

  // Case 1: Already checked in on the same calendar day
  if (lastAttendedDate && areSameCalendarDay(lastAttendedDate, checkInDate)) {
    return {
      newStreak,
      newLongestStreak,
      newLastAttendedDate: lastAttendedDate,
      status,
      streakIncremented: false,
      streakReset: false,
      freezeUsed: false,
      newlyUnlockedBadges: [],
      message: "Student has already checked in for today.",
    };
  }

  // Case 2: Excused absence
  if (status === "EXCUSED") {
    message = "Absence excused. Attendance streak preserved!";
    return {
      newStreak,
      newLongestStreak,
      newLastAttendedDate: lastAttendedDate || checkInDate,
      status,
      streakIncremented: false,
      streakReset: false,
      freezeUsed: false,
      newlyUnlockedBadges: [],
      message,
    };
  }

  // Case 3: Present or Late
  if (status === "PRESENT" || status === "LATE") {
    if (!lastAttendedDate) {
      // First ever check-in
      newStreak = 1;
      streakIncremented = true;
    } else {
      const schoolDaysGap = getSchoolDaysDiff(lastAttendedDate, checkInDate);

      if (schoolDaysGap <= 1) {
        // Consecutive school day (e.g. Friday -> Monday, or Monday -> Tuesday)
        newStreak = currentStreak + 1;
        streakIncremented = true;
      } else {
        // Missed at least one previous school day without excuse
        newStreak = 1;
        streakReset = currentStreak > 0;
        message = currentStreak > 0 
          ? `Missed previous class day. Streak restarted at 1.`
          : `Streak restarted at 1. Keep going!`;
      }
    }

    newLongestStreak = Math.max(newLongestStreak, newStreak);
    newLastAttendedDate = checkInDate;

    if (status === "LATE") {
      message = `Marked Late. Streak extended to ${newStreak}! Try to be early next time!`;
    } else {
      message = `Marked Present! You are on a ${newStreak}-day streak! 🔥`;
    }
  }

  // Case 4: Absent
  if (status === "ABSENT") {
    if (useFreezeIfAbsent && streakFreezesLeft > 0) {
      freezeUsed = true;
      message = "Streak freeze activated! Your streak is safely frozen.";
    } else {
      newStreak = 0;
      streakReset = currentStreak > 0;
      message = "Marked Absent. Streak reset to 0.";
    }
  }

  // Evaluate any newly unlocked badges
  const newlyUnlockedBadges: BadgeDefinition[] = [];
  SYSTEM_BADGES.forEach((badge) => {
    if (newStreak >= badge.requiredStreak && !existingBadgeIds.includes(badge.id)) {
      newlyUnlockedBadges.push({
        ...badge,
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
        progress: 100,
      });
    }
  });

  return {
    newStreak,
    newLongestStreak,
    newLastAttendedDate,
    status,
    streakIncremented,
    streakReset,
    freezeUsed,
    newlyUnlockedBadges,
    message,
  };
}

/**
 * Calculates visual progression and status for all badges based on current streak
 */
export function getBadgesWithProgress(
  currentStreak: number,
  unlockedBadgeIds: string[]
): BadgeDefinition[] {
  return SYSTEM_BADGES.map((b) => {
    const isUnlocked = unlockedBadgeIds.includes(b.id) || currentStreak >= b.requiredStreak;
    const progress = Math.min(100, Math.round((currentStreak / b.requiredStreak) * 100));
    return {
      ...b,
      isUnlocked,
      progress,
    };
  });
}
