import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { areSameCalendarDay } from "@/lib/streakEngine";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const defaultClass = await prisma.classroom.findFirst();
    if (!defaultClass) {
      return NextResponse.json({ success: true, students: [] });
    }

    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      include: {
        streaks: {
          where: { classroomId: defaultClass.id },
        },
        attendanceRecords: {
          where: { classroomId: defaultClass.id },
          orderBy: { date: "desc" },
          take: 1,
        },
      },
      orderBy: { name: "asc" },
    });

    const now = new Date();

    const formatted = students.map((st) => {
      const streak = st.streaks[0];
      const latestRecord = st.attendanceRecords[0];
      const isToday = latestRecord && areSameCalendarDay(new Date(latestRecord.date), now);

      return {
        id: st.id,
        name: st.name,
        idNumber: st.studentIdNumber || "N/A",
        currentStreak: streak?.currentStreak || 0,
        status: isToday ? latestRecord.status : "ABSENT",
        timeCheckedIn: isToday
          ? new Date(latestRecord.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : undefined,
      };
    });

    return NextResponse.json({ success: true, students: formatted, classroom: defaultClass });
  } catch (error) {
    console.error("Roster GET error:", error);
    return NextResponse.json({ success: false, message: "Failed to load roster" }, { status: 500 });
  }
}
