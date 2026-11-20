const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// 1. Ensure .env exists with DATABASE_URL
const envPath = path.join(__dirname, "..", ".env");
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(
    envPath,
    'DATABASE_URL="file:./dev.db"\nNEXTAUTH_SECRET="streaked-gamified-attendance-secret-2026"\n'
  );
  console.log("✓ Created .env with default SQLite DATABASE_URL for build environment");
}

// 2. Set environment variables for the current process
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}
if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = "streaked-gamified-attendance-secret-2026";
}

// 3. Push SQLite schema non-interactively
console.log("⚡ Synchronizing SQLite database schema...");
try {
  execSync("npx prisma db push --accept-data-loss --skip-generate", { stdio: "inherit", env: process.env });
} catch (err) {
  console.error("Prisma db push error:", err.message);
}

// 4. Seed initial data
console.log("⚡ Seeding database with initial classes, badges & students...");
try {
  execSync('npx ts-node --compiler-options "{\\"module\\":\\"CommonJS\\"}" prisma/seed.ts', {
    stdio: "inherit",
    env: process.env,
  });
  console.log("✓ Database setup completed successfully.");
} catch (err) {
  console.warn("Notice: Database seed step finished with message:", err.message);
}
