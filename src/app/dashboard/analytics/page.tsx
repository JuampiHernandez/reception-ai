"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DashboardPageHeader, DashboardCard } from "@/components/dashboard/DashboardShell";

const weeklyData = [
  { day: "Mon", calls: 18, prev: 12 },
  { day: "Tue", calls: 22, prev: 15 },
  { day: "Wed", calls: 25, prev: 18 },
  { day: "Thu", calls: 20, prev: 14 },
  { day: "Fri", calls: 15, prev: 10 },
];

const reasons = [
  { name: "New consultation", value: 45, color: "#0d9488" },
  { name: "Existing patient", value: 25, color: "#2dd4bf" },
  { name: "General question", value: 15, color: "#94a3b8" },
  { name: "Reschedule", value: 10, color: "#f59e0b" },
  { name: "Other", value: 5, color: "#cbd5e1" },
];

export default function AnalyticsPage() {
  return (
    <div>
      <DashboardPageHeader
        title="Analytics"
        description="Performance trends for your AI receptionist."
      />
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <DashboardCard title="Weekly calls">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="calls" fill="#0d9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="prev" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>
        <DashboardCard title="Top call reasons">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={reasons}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {reasons.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </DashboardCard>
      </div>
    </div>
  );
}
