"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Pin, Send, Megaphone, HelpCircle, FileCode, BookOpen, RefreshCw, UserCheck } from "lucide-react";
import { ChatCategory } from "@/types";

interface MessageItem {
  id: string;
  senderName: string;
  senderRole: string;
  category: ChatCategory;
  content: string;
  isPinned: boolean;
  time: string;
}

export default function AcademicChatPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [inputText, setInputText] = useState("");
  const [inputCategory, setInputCategory] = useState<ChatCategory>("QUESTION");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [activeSenderId, setActiveSenderId] = useState<string>("");
  const [sendersList, setSendersList] = useState<Array<{ id: string; name: string; role: string }>>([]);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/chat");
      const data = await res.json();
      if (data.success && data.messages) {
        const formatted = data.messages.map((m: any) => ({
          id: m.id,
          senderName: m.sender.name,
          senderRole: m.sender.role,
          category: m.category as ChatCategory,
          content: m.content,
          isPinned: m.isPinned,
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }));
        setMessages(formatted);
      }
    } catch (err) {
      console.error("Failed to load chat messages", err);
    }
  };

  const loadSenders = async () => {
    try {
      const res = await fetch("/api/student");
      const data = await res.json();
      if (data.success && data.students) {
        const options = [
          { id: "teacher-default", name: "Prof. Alberto Mendoza", role: "TEACHER" },
          ...data.students.map((s: any) => ({ id: s.id, name: s.name, role: "STUDENT" })),
        ];
        setSendersList(options);
        // Default to Lucky
        const lucky = data.students.find((s: any) => s.studentIdNumber === "2026-00101-SHS");
        setActiveSenderId(lucky ? lucky.id : options[0].id);
      }
    } catch (err) {
      console.error("Failed to load senders", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    loadSenders();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: activeSenderId,
          content: inputText.trim(),
          category: inputCategory,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setInputText("");
        await fetchMessages();
      }
    } catch (err) {
      console.error("Failed to post message", err);
    } finally {
      setLoading(false);
    }
  };

  const togglePin = async (messageId: string, currentPin: boolean) => {
    try {
      const res = await fetch("/api/chat", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          isPinned: !currentPin,
        }),
      });
      if (res.ok) {
        fetchMessages();
      }
    } catch (err) {
      console.error("Failed to update pin", err);
    }
  };

  const getCategoryBadge = (cat: ChatCategory) => {
    switch (cat) {
      case "ANNOUNCEMENT":
        return (
          <span className="flex items-center gap-1 rounded bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-400">
            <Megaphone className="h-3 w-3" /> Announcement
          </span>
        );
      case "QUESTION":
        return (
          <span className="flex items-center gap-1 rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400">
            <HelpCircle className="h-3 w-3" /> Question
          </span>
        );
      case "ASSIGNMENT_HELP":
        return (
          <span className="flex items-center gap-1 rounded bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold text-cyan-400">
            <FileCode className="h-3 w-3" /> Assignment Help
          </span>
        );
      case "STUDY_MATERIAL":
        return (
          <span className="flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
            <BookOpen className="h-3 w-3" /> Study Material
          </span>
        );
    }
  };

  const filtered = selectedFilter === "ALL"
    ? messages
    : messages.filter((m) => m.category === selectedFilter);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Classroom Academic Chat</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                CS 301 (BSCS 3-A) • Curated discussion channel dedicated to coursework & academic notices
              </p>
            </div>
          </div>

          <button
            onClick={fetchMessages}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:border-orange-500 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>

        {/* Sender Switcher & Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5 text-orange-400" /> Posting As:
            </span>
            <select
              value={activeSenderId}
              onChange={(e) => setActiveSenderId(e.target.value)}
              className="rounded-lg bg-slate-950 border border-slate-700 px-3 py-1 text-xs font-bold text-orange-400 focus:outline-none focus:border-orange-500"
            >
              {sendersList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {["ALL", "ANNOUNCEMENT", "QUESTION", "ASSIGNMENT_HELP", "STUDY_MATERIAL"].map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedFilter(tag)}
                className={`rounded-xl px-2.5 py-1 text-[11px] font-semibold border transition ${
                  selectedFilter === tag
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {tag.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Messages List */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 min-h-[420px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-xs font-bold">
                No messages found under this academic filter category.
              </div>
            ) : (
              filtered.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-2xl p-4 border transition ${
                    msg.isPinned
                      ? "bg-slate-950/90 border-amber-500/40 shadow-lg shadow-amber-500/5"
                      : "bg-slate-950/70 border-slate-800/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-400">({msg.senderRole})</span>
                      {getCategoryBadge(msg.category)}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <button
                        onClick={() => togglePin(msg.id, msg.isPinned)}
                        className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border transition ${
                          msg.isPinned
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold"
                            : "bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300"
                        }`}
                      >
                        <Pin className="h-3 w-3" /> {msg.isPinned ? "Pinned" : "Pin"}
                      </button>
                      <span>{msg.time}</span>
                    </div>
                  </div>
                  <p className="mt-2.5 text-sm text-slate-200 leading-relaxed">{msg.content}</p>
                </div>
              ))
            )}
          </div>

          {/* Send Input Bar */}
          <form onSubmit={handleSendMessage} className="mt-6 border-t border-slate-800 pt-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Post Category:</span>
              <select
                value={inputCategory}
                onChange={(e) => setInputCategory(e.target.value as ChatCategory)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-orange-400 font-bold focus:outline-none focus:border-orange-500"
              >
                <option value="QUESTION">Question</option>
                <option value="ASSIGNMENT_HELP">Assignment Help</option>
                <option value="STUDY_MATERIAL">Study Material</option>
                <option value="ANNOUNCEMENT">Announcement</option>
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your academic question or message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || loading}
                className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50 transition shadow-lg"
              >
                <Send className="h-4 w-4" /> {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
