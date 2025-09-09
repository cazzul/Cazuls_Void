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
  chart1: 'var(--color-accent)',
  chart2: 'var(--color-border)',
  chart3: 'var(--color-running)',
  chart4: 'var(--color-lifting)',
  chart5: 'var(--color-mtb)',
  border: 'var(--color-muted)',
  mutedForeground: 'var(--color-secondary)',
  card: 'var(--color-card)',
  foreground: 'var(--color-foreground)'
};

export interface WeeklyVolumeData {
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
        <p style={{ color: 'var(--color-secondary)' }}>No workout data available</p>
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