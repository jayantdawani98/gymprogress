import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DayPoint } from "../types";

function formatDay(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function ProgressChart({ data, color }: { data: DayPoint[]; color: string }) {
  if (data.length < 2) {
    return (
      <div className="chart-empty">
        Log at least 2 days to see your progress graph.
      </div>
    );
  }

  const chartData = data.map((p) => ({ ...p, label: formatDay(p.date) }));

  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={(v) => `${v}kg`}
          />
          <Tooltip
            formatter={(value) => [`${value} kg`, "Top set"]}
            labelStyle={{ color: "#0f172a" }}
          />
          <Area
            type="monotone"
            dataKey="weight"
            stroke={color}
            strokeWidth={3}
            fill="url(#fill)"
            dot={{ r: 3, fill: color }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
