import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "StreakED - Gamified Attendance Tracking System",
  description: "A Gamified Attendance Tracking System with Streak-Based Motivation for Senior High and College Students. John Paul College 2026.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-400">
          <div className="container mx-auto px-4">
            <p>
              StreakED © 2026. John Paul College — Bachelor of Science in Computer Science.
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Proponents: Lucky Lawrence C. Fernandez & Jemuel Delos Reyes
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
