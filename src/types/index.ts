export type UserRole = "STUDENT" | "TEACHER" | "ADMIN" | "PARENT";

export type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT" | "EXCUSED";

export type BadgeTier = "STARTER" | "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "LEGEND";

export type ChatCategory = "ANNOUNCEMENT" | "QUESTION" | "ASSIGNMENT_HELP" | "STUDY_MATERIAL";

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  studentIdNumber: string;
  avatarUrl?: string;
  guardianEmail?: string;
  currentStreak: number;
  longestStreak: number;
  attendanceRate: number;
  totalPresent: number;
  totalLate: number;
  totalAbsent: number;
  streakFreezesLeft: number;
  lastAttendedDate?: string | null;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  tier: BadgeTier;
  requiredStreak: number;
  icon: string;
  color: string;
  isUnlocked?: boolean;
  unlockedAt?: string;
  progress?: number; // 0 to 100%
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  studentIdNumber: string;
  name: string;
  avatarUrl?: string;
  currentStreak: number;
  longestStreak: number;
  badgeTitle: string;
  badgeTier: BadgeTier;
  todayStatus?: AttendanceStatus | null;
}

export interface ScanResult {
  success: boolean;
  message: string;
  student?: {
    id: string;
    name: string;
    studentIdNumber: string;
    avatarUrl?: string;
    newStreak: number;
    longestStreak: number;
    status: AttendanceStatus;
    newlyUnlockedBadge?: BadgeDefinition | null;
  };
}
