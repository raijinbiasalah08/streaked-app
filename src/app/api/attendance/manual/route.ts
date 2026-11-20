import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateAttendanceStreak } from "@/lib/streakEngine";
import { AttendanceStatus } from "@/types";

export async function POST(req: NextRequest) {
  try {
    let { studentId, classroomId, status, remarks } = await req.json();

    if (!studentId || !status) {
      return NextResponse.json(
        { success: false, message: "Missing studentId or status." },
        { status: 400 }
      );
    }

    if (!classroomId) {
      const def = await prisma.classroom.findFirst();
      classroomId = def?.id;
    }

    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        earnedBadges: true,
        streaks: { where: { classroomId } },
      },
    });

    if (!student) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    let streakRecord = student.streaks[0];
    if (!streakRecord) {
      streakRecord = await prisma.studentStreak.create({
        data: {
          studentId,
          classroomId,
          currentStreak: 0,
          longestStreak: 0,
          streakFreezesLeft: 1,
        },
      });
    }

    const existingBadgeIds = student.earnedBadges.map((b) => b.badgeId);
    const result = calculateAttendanceStreak({
      currentStreak: streakRecord.currentStreak,
      longestStreak: streakRecord.longestStreak,
      lastAttendedDate: streakRecord.lastAttendedDate,
      checkInDate: new Date(),
      status: status as AttendanceStatus,
      streakFreezesLeft: streakRecord.streakFreezesLeft,
      existingBadgeIds,
    });

    await prisma.studentStreak.update({
      where: { id: streakRecord.id },
      data: {
        currentStreak: result.newStreak,
        longestStreak: result.newLongestStreak,
        lastAttendedDate: result.newLastAttendedDate,
      },
    });

    const record = await prisma.attendanceRecord.create({
      data: {
        studentId,
        classroomId,
        date: new Date(),
        status,
        remarks: remarks || result.message,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Updated student status to ${status}`,
      newStreak: result.newStreak,
      record,
    });
  } catch (error) {
    console.error("Manual attendance update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update record" },
      { status: 500 }
    );
  }
}
