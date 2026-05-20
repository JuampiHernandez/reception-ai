"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const weeklyData = [
  { day: "Mon", calls: 18, prev: 12 },
  { day: "Tue", calls: 22, prev: 15 },
  { day: "Wed", calls: 25, prev: 18 },
  { day: "Thu", calls: 20, prev: 14 },
  { day: "Fri", calls: 15, prev: 10 },
];

const reasons = [
  { name: "New consultation", value: 45, color: "#3B82F6" },
  { name: "Existing patient", value: 25, color: "#34D399" },
  { name: "General question", value: 15, color: "#64748B" },
  { name: "Reschedule", value: 10, color: "#F59E0B" },
  { name: "Other", value: 5, color: "#94A3B8" },
];

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics</h1>
      <p className="text-slate-gray">Performance trends for your AI receptionist.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-medium">Weekly calls</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calls" fill="#3B82F6" />
              <Bar dataKey="prev" fill="#E2E8F0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-medium">Top call reasons</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={reasons} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {reasons.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
