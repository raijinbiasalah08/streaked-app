import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { areSameCalendarDay } from "@/lib/streakEngine";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const classroomId = searchParams.get("classroomId");

    // Default classroom if not provided (strictly typed string)
    let targetClassroom: string = classroomId || "";
    if (!targetClassroom) {
      const c = await prisma.classroom.findFirst();
      targetClassroom = c?.id || "";
    }

    if (!targetClassroom) {
      return NextResponse.json({ success: true, students: [] });
    }

    // Fetch all enrolled students and their streaks
    const streaks = await prisma.studentStreak.findMany({
      where: { classroomId: targetClassroom },
      include: {
        student: {
          include: {
            earnedBadges: {
              include: { badge: true },
            },
            attendanceRecords: {
              where: { classroomId: targetClassroom },
              orderBy: { date: "desc" },
              take: 1,
            },
          },
        },
      },
      orderBy: [{ currentStreak: "desc" }, { longestStreak: "desc" }],
    });

    const now = new Date();

    const formatted = streaks.map((item, index) => {
      const student = item.student;
      const latestRecord = student.attendanceRecords[0];
      const attendedToday =
        latestRecord && areSameCalendarDay(new Date(latestRecord.date), now);

      let tierTitle = "Spark ✨";
      let tierColor = "from-amber-400 to-orange-500";

      if (item.currentStreak >= 100) {
        tierTitle = "StreakED Legend 👑";
        tierColor = "from-purple-500 via-pink-500 to-orange-500";
      } else if (item.currentStreak >= 60) {
        tierTitle = "Platinum Elite 💎";
        tierColor = "from-cyan-400 to-blue-600";
      } else if (item.currentStreak >= 30) {
        tierTitle = "Gold Vanguard 🏆";
        tierColor = "from-yellow-400 to-amber-500";
      } else if (item.currentStreak >= 15) {
        tierTitle = "Silver Achiever 🛡️";
        tierColor = "from-slate-300 to-slate-500";
      } else if (item.currentStreak >= 7) {
        tierTitle = "Bronze Scholar 🥉";
        tierColor = "from-amber-600 to-amber-800";
      } else if (item.currentStreak >= 3) {
        tierTitle = "Starter Flame ✨";
        tierColor = "from-amber-400 to-orange-500";
      }

      return {
        rank: index + 1,
        studentId: student.id,
        idNumber: student.studentIdNumber || "N/A",
        name: student.name,
        avatarUrl: student.avatarUrl,
        currentStreak: item.currentStreak,
        longestStreak: item.longestStreak,
        tier: tierTitle,
        tierColor,
        statusToday: attendedToday ? latestRecord.status : "PENDING",
      };
    });

    return NextResponse.json({ success: true, students: formatted });
  } catch (error) {
    console.error("Leaderboard GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load leaderboard." },
      { status: 500 }
    );
  }
}
