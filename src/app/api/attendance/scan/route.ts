import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateAttendanceStreak, SYSTEM_BADGES } from "@/lib/streakEngine";
import { AttendanceStatus } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentIdNumber, classroomId, status = "PRESENT" } = body;

    if (!studentIdNumber) {
      return NextResponse.json(
        { success: false, message: "Student ID number is required" },
        { status: 400 }
      );
    }

    // 1. Find student
    const student = await prisma.user.findUnique({
      where: { studentIdNumber: studentIdNumber.trim() },
      include: {
        earnedBadges: { include: { badge: true } },
        streaks: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: `Student with ID "${studentIdNumber}" not found in system.`,
        },
        { status: 404 }
      );
    }

    // Default or active classroom
    let targetClassroom = classroomId;
    if (!targetClassroom) {
      const defaultClass = await prisma.classroom.findFirst();
      targetClassroom = defaultClass?.id;
    }

    // 2. Fetch or initialize student streak for classroom
    let existingStreak = await prisma.studentStreak.findUnique({
      where: {
        studentId_classroomId: {
          studentId: student.id,
          classroomId: targetClassroom,
        },
      },
    });

    if (!existingStreak) {
      existingStreak = await prisma.studentStreak.create({
        data: {
          studentId: student.id,
          classroomId: targetClassroom,
          currentStreak: 0,
          longestStreak: 0,
          streakFreezesLeft: 1,
        },
      });
    }

    // 3. Compute new streak & badge logic
    const existingBadgeIds = student.earnedBadges.map((eb) => eb.badgeId);
    const result = calculateAttendanceStreak({
      currentStreak: existingStreak.currentStreak,
      longestStreak: existingStreak.longestStreak,
      lastAttendedDate: existingStreak.lastAttendedDate,
      checkInDate: new Date(),
      status: status as AttendanceStatus,
      streakFreezesLeft: existingStreak.streakFreezesLeft,
      existingBadgeIds,
    });

    // 4. Update Database
    await prisma.studentStreak.update({
      where: { id: existingStreak.id },
      data: {
        currentStreak: result.newStreak,
        longestStreak: result.newLongestStreak,
        lastAttendedDate: result.newLastAttendedDate,
      },
    });

    // Log attendance record
    await prisma.attendanceRecord.create({
      data: {
        studentId: student.id,
        classroomId: targetClassroom,
        date: new Date(),
        status: result.status,
        remarks: result.message,
      },
    });

    // Award newly unlocked badges
    let firstNewBadge = null;
    if (result.newlyUnlockedBadges.length > 0) {
      firstNewBadge = result.newlyUnlockedBadges[0];
      for (const badge of result.newlyUnlockedBadges) {
        // Ensure badge exists in DB
        await prisma.badge.upsert({
          where: { id: badge.id },
          update: {},
          create: {
            id: badge.id,
            name: badge.name,
            description: badge.description,
            tier: badge.tier,
            requiredStreak: badge.requiredStreak,
            icon: badge.icon,
            color: badge.color,
          },
        });

        await prisma.earnedBadge.upsert({
          where: {
            studentId_badgeId: {
              studentId: student.id,
              badgeId: badge.id,
            },
          },
          update: {},
          create: {
            studentId: student.id,
            badgeId: badge.id,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      student: {
        id: student.id,
        name: student.name,
        studentIdNumber: student.studentIdNumber,
        avatarUrl: student.avatarUrl,
        newStreak: result.newStreak,
        longestStreak: result.newLongestStreak,
        status: result.status,
        streakIncremented: result.streakIncremented,
        newlyUnlockedBadge: firstNewBadge,
      },
    });
  } catch (error) {
    console.error("Scan attendance error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
