import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding StreakED database with sample students, teachers, and badges...");

  // 1. Clean existing records
  await prisma.chatMessage.deleteMany();
  await prisma.earnedBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.studentStreak.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.classroom.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed System Badges
  const badgesData = [
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
      description: "Consistency master with a 15-day streak. Half a month unbroken!",
      tier: "SILVER",
      requiredStreak: 15,
      icon: "ShieldCheck",
      color: "from-slate-300 to-slate-500",
    },
    {
      id: "badge-gold",
      name: "Gold Vanguard",
      description: "30 consecutive days of impeccable classroom presence.",
      tier: "GOLD",
      requiredStreak: 30,
      icon: "Crown",
      color: "from-yellow-400 to-amber-500",
    },
    {
      id: "badge-platinum",
      name: "Platinum Elite",
      description: "60 continuous days of academic punctuality.",
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

  for (const b of badgesData) {
    await prisma.badge.create({ data: b });
  }

  // 3. Seed Users
  // Admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@streak.edu",
      name: "Dr. Ronald Vance (Dean / Admin)",
      role: "ADMIN",
      password: "password123",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
  });

  // Teacher
  const teacher = await prisma.user.create({
    data: {
      email: "adviser@streak.edu",
      name: "Prof. Alberto Mendoza",
      role: "TEACHER",
      password: "password123",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
  });

  // Students (including proposal authors Lucky Lawrence C. Fernandez & Jemuel Delos Reyes)
  const lucky = await prisma.user.create({
    data: {
      email: "lucky@streak.edu",
      name: "Lucky Lawrence C. Fernandez",
      role: "STUDENT",
      studentIdNumber: "2026-00101-SHS",
      guardianEmail: "parent@streak.edu",
      password: "password123",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
    },
  });

  const jemuel = await prisma.user.create({
    data: {
      email: "jemuel@streak.edu",
      name: "Jemuel Delos Reyes",
      role: "STUDENT",
      studentIdNumber: "2026-00102-SHS",
      guardianEmail: "guardian.jemuel@example.com",
      password: "password123",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    },
  });

  const maria = await prisma.user.create({
    data: {
      email: "maria@streak.edu",
      name: "Maria Santos",
      role: "STUDENT",
      studentIdNumber: "2026-00103-SHS",
      guardianEmail: "guardian.maria@example.com",
      password: "password123",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    },
  });

  const juan = await prisma.user.create({
    data: {
      email: "juan@streak.edu",
      name: "Juan Dela Cruz",
      role: "STUDENT",
      studentIdNumber: "2026-00104-SHS",
      guardianEmail: "guardian.juan@example.com",
      password: "password123",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    },
  });

  const bea = await prisma.user.create({
    data: {
      email: "bea@streak.edu",
      name: "Bea Alonzo",
      role: "STUDENT",
      studentIdNumber: "2026-00105-SHS",
      guardianEmail: "guardian.bea@example.com",
      password: "password123",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    },
  });

  // Parent
  const parent = await prisma.user.create({
    data: {
      email: "parent@streak.edu",
      name: "Mrs. Erlinda Fernandez",
      role: "PARENT",
      password: "password123",
      guardianEmail: "lucky@streak.edu", // linked to Lucky's account
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    },
  });

  // 4. Seed Classroom
  const classroom = await prisma.classroom.create({
    data: {
      name: "CS 301 - Advanced Web Applications & Systems",
      section: "BSCS 3-A",
      subjectCode: "CS301",
      roomNumber: "Computer Lab 204",
      teacherId: teacher.id,
    },
  });

  // 5. Enroll Students
  const students = [lucky, jemuel, maria, juan, bea];
  for (const s of students) {
    await prisma.enrollment.create({
      data: {
        studentId: s.id,
        classroomId: classroom.id,
      },
    });
  }

  // 6. Streaks & Earned Badges
  const streaksData = [
    { student: lucky, current: 18, longest: 25, badges: ["badge-starter", "badge-bronze", "badge-silver"] },
    { student: jemuel, current: 17, longest: 20, badges: ["badge-starter", "badge-bronze", "badge-silver"] },
    { student: maria, current: 32, longest: 35, badges: ["badge-starter", "badge-bronze", "badge-silver", "badge-gold"] },
    { student: juan, current: 4, longest: 12, badges: ["badge-starter"] },
    { student: bea, current: 65, longest: 65, badges: ["badge-starter", "badge-bronze", "badge-silver", "badge-gold", "badge-platinum"] },
  ];

  for (const item of streaksData) {
    await prisma.studentStreak.create({
      data: {
        studentId: item.student.id,
        classroomId: classroom.id,
        currentStreak: item.current,
        longestStreak: item.longest,
        lastAttendedDate: new Date(Date.now() - 86400000), // yesterday
        streakFreezesLeft: 1,
      },
    });

    for (const bId of item.badges) {
      await prisma.earnedBadge.create({
        data: {
          studentId: item.student.id,
          badgeId: bId,
        },
      });
    }

    // Add recent attendance records (last 10 school days)
    for (let i = 0; i < 10; i++) {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - i);
      await prisma.attendanceRecord.create({
        data: {
          studentId: item.student.id,
          classroomId: classroom.id,
          date: pastDate,
          status: i === 7 && item.student === juan ? "LATE" : "PRESENT",
          remarks: "Regular class attendance",
        },
      });
    }
  }

  // 7. Seed Class Chat Messages
  const sampleMessages = [
    {
      senderId: teacher.id,
      category: "ANNOUNCEMENT",
      isPinned: true,
      content: "📢 Welcome to CS 301! QR Check-in opens promptly at 8:00 AM. Maintain your streaks to qualify for bonus lab exemptions!",
    },
    {
      senderId: maria.id,
      category: "QUESTION",
      isPinned: false,
      content: "Hi Prof! For Lab 3, do we submit both the Next.js frontend and the Prisma schema?",
    },
    {
      senderId: teacher.id,
      category: "ASSIGNMENT_HELP",
      isPinned: false,
      content: "Yes Maria, please include the zipped repo with the SQLite migration file included in prisma/.",
    },
    {
      senderId: lucky.id,
      category: "STUDY_MATERIAL",
      isPinned: false,
      content: "Shared the lecture notes on behavioral gamification & streak algorithms on our shared Drive!",
    },
  ];

  for (const msg of sampleMessages) {
    await prisma.chatMessage.create({
      data: {
        classroomId: classroom.id,
        senderId: msg.senderId,
        category: msg.category,
        content: msg.content,
        isPinned: msg.isPinned,
      },
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log("Mock Credentials:");
  console.log("👨‍🎓 Student: lucky@streak.edu (pass: password123)");
  console.log("👨‍🏫 Teacher: adviser@streak.edu (pass: password123)");
  console.log("🛡️ Admin:   admin@streak.edu (pass: password123)");
  console.log("👪 Parent:  parent@streak.edu (pass: password123)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
