"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const customColors = {
  chart1: 'oklch(0.488 0.243 264.376)',
  chart2: 'oklch(0.696 0.17 162.48)',
  chart3: 'oklch(0.769 0.188 70.08)',
  chart4: 'oklch(0.627 0.265 303.9)',
  chart5: 'oklch(0.645 0.246 16.439)',
  border: 'oklch(0.269 0 0)',
  mutedForeground: 'oklch(0.708 0 0)',
  card: 'oklch(0.145 0 0)',
  foreground: 'oklch(0.985 0 0)'
};

interface WeeklyVolumeData {
  day: string;
  Back: number;
  Chest: number;
  Biceps: number;
  Triceps: number;
  Shoulders: number;
  Hamstrings: number;
  Quads: number;
  Running: number;
  Biking: number;
}

interface WeeklyVolumeChartProps {
  data?: WeeklyVolumeData[];
}

export default function WeeklyVolumeChart({ data = [] }: WeeklyVolumeChartProps) {
  // If no data provided, show empty chart
  if (!data || data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <p style={{ color: 'oklch(0.708 0 0)' }}>No workout data available</p>
      </div>
    );
  }

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={customColors.border} />
          <XAxis dataKey="day" stroke={customColors.mutedForeground} />
          <YAxis stroke={customColors.mutedForeground} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: customColors.card, 
              border: `1px solid ${customColors.border}`,
              borderRadius: '0.5rem',
              color: customColors.foreground
            }} 
          />
          <Legend />
          <Bar dataKey="Back" stackId="a" fill={customColors.chart1} />
          <Bar dataKey="Chest" stackId="a" fill={customColors.chart5} />
          <Bar dataKey="Triceps" stackId="a" fill={customColors.chart3} />
          <Bar dataKey="Biceps" stackId="a" fill={customColors.chart2} />
          <Bar dataKey="Shoulders" stackId="a" fill={customColors.chart4} />
          <Bar dataKey="Hamstrings" stackId="a" fill={customColors.chart1} opacity={0.7} />
          <Bar dataKey="Quads" stackId="a" fill={customColors.chart2} opacity={0.7} />
          <Bar dataKey="Running" stackId="b" fill={customColors.chart3} opacity={0.8} />
          <Bar dataKey="Biking" stackId="b" fill={customColors.chart5} opacity={0.8} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 