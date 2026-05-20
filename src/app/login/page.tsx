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
    <div className="flex min-h-screen items-center justify-center bg-deep-navy px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div className="mb-8 flex items-center gap-2">
          <Image src="/logo.svg" alt="" width={40} height={40} />
          <span className="text-xl font-semibold text-white">Reception.ai</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Log in</h1>
        <p className="mt-2 text-sm text-slate-400">
          Demo: smilecare@demo.reception.ai / demo1234
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-slate-500"
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white"
            placeholder="Password"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full">
            Log in
          </Button>
        </form>
        <Link href="/" className="mt-4 block text-center text-sm text-slate-400 hover:text-white">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
