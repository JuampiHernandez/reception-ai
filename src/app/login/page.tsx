"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("smilecare@demo.reception.ai");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      setError("Invalid credentials");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6f8] px-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
        <div className="border-b border-slate-100 bg-teal-50/50 px-8 py-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="" width={36} height={36} />
            <div>
              <span className="text-lg font-semibold text-slate-900">Reception.ai</span>
              <p className="text-xs text-slate-500">Practice dashboard</p>
            </div>
          </div>
        </div>
        <div className="px-8 py-8">
          <h1 className="text-xl font-bold text-slate-900">Log in</h1>
          <p className="mt-2 text-sm text-slate-600">
            Demo: smilecare@demo.reception.ai / demo1234
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
              placeholder="Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
              placeholder="Password"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
              Log in
            </Button>
          </form>
          <Link
            href="/"
            className="mt-6 block text-center text-sm text-slate-500 hover:text-teal-700"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
