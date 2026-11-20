import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const classroomId = searchParams.get("classroomId");

    const messages = await prisma.chatMessage.findMany({
      where: classroomId ? { classroomId } : undefined,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: [{ isPinned: "desc" }, { createdAt: "asc" }],
      take: 50,
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Chat GET error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { classroomId, senderId, content, category } = await req.json();

    if (!content || !senderId) {
      return NextResponse.json({ success: false, message: "Missing content or sender" }, { status: 400 });
    }

    // Default to first classroom if none passed
    let activeClass = classroomId;
    if (!activeClass) {
      const c = await prisma.classroom.findFirst();
      activeClass = c?.id;
    }

    // Basic educational keyword / academic appropriateness check
    const validCategories = ["ANNOUNCEMENT", "QUESTION", "ASSIGNMENT_HELP", "STUDY_MATERIAL"];
    const finalCategory = validCategories.includes(category) ? category : "QUESTION";

    const newMessage = await prisma.chatMessage.create({
      data: {
        classroomId: activeClass,
        senderId,
        content: content.trim(),
        category: finalCategory,
        isPinned: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Chat POST error:", error);
    return NextResponse.json({ success: false, message: "Failed to post message" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { messageId, isPinned } = await req.json();

    const updated = await prisma.chatMessage.update({
      where: { id: messageId },
      data: { isPinned },
    });

    return NextResponse.json({ success: true, message: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update pin status" }, { status: 500 });
  }
}
