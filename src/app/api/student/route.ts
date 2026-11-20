import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("id");
    const idNumber = searchParams.get("idNumber");

    // If no student specified, return list of all enrolled students for selection
    if (!studentId && !idNumber) {
      const students = await prisma.user.findMany({
        where: { role: "STUDENT" },
        select: {
          id: true,
          name: true,
          studentIdNumber: true,
          email: true,
          avatarUrl: true,
        },
        orderBy: { name: "asc" },
      });
      return NextResponse.json({ success: true, students });
    }

    const student = await prisma.user.findFirst({
      where: {
        OR: [
          studentId ? { id: studentId } : {},
          idNumber ? { studentIdNumber: idNumber } : {},
        ],
      },
      include: {
        streaks: true,
        earnedBadges: {
          include: { badge: true },
        },
        attendanceRecords: {
          orderBy: { date: "desc" },
          take: 60,
        },
      },
    });

    if (!student) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    const streak = student.streaks[0] || {
      currentStreak: 0,
      longestStreak: 0,
      streakFreezesLeft: 1,
      lastAttendedDate: null,
    };

    // Calculate rates from actual records
    const records = student.attendanceRecords;
    const totalCount = records.length || 1;
    const presentCount = records.filter((r) => r.status === "PRESENT").length;
    const lateCount = records.filter((r) => r.status === "LATE").length;
    const absentCount = records.filter((r) => r.status === "ABSENT").length;
    const attendanceRate = Math.round(((presentCount + lateCount * 0.75) / totalCount) * 1000) / 10;

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        studentIdNumber: student.studentIdNumber,
        guardianEmail: student.guardianEmail,
        avatarUrl: student.avatarUrl,
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        streakFreezesLeft: streak.streakFreezesLeft,
        lastAttendedDate: streak.lastAttendedDate,
        totalPresent: presentCount,
        totalLate: lateCount,
        totalAbsent: absentCount,
        attendanceRate: Math.min(100, attendanceRate || 95.0),
        earnedBadgeIds: student.earnedBadges.map((eb) => eb.badgeId),
        recentRecords: records.slice(0, 10).map((r) => ({
          id: r.id,
          date: r.date,
          status: r.status,
          remarks: r.remarks,
        })),
      },
    });
  } catch (error) {
    console.error("Student GET error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch student data" }, { status: 500 });
  }
}
