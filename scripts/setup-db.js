const { execSync } = require("child_process");
const { PrismaClient } = require("@prisma/client");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must point to a persistent PostgreSQL database before building.");
}

function run(command) {
  execSync(command, { stdio: "inherit", env: process.env });
}

async function main() {
  run("npx prisma migrate deploy");

  const prisma = new PrismaClient();
  let userCount;
  try {
    userCount = await prisma.user.count();
  } finally {
    await prisma.$disconnect();
  }

  if (userCount === 0) {
    console.log("Seeding the empty database with sample demo data...");
    run("npx prisma db seed");
  } else {
    console.log("Database already contains users; keeping its existing data.");
  }
}

main().catch((error) => {
  console.error("Database setup failed:", error);
  process.exitCode = 1;
});
