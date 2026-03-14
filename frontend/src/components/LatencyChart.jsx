import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { formatChartTime } from '../utils/time';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15, 15, 35, 0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        padding: '0.6rem 0.9rem',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <p style={{ color: '#8b8ba3', fontSize: '0.7rem', marginBottom: '0.2rem' }}>{label}</p>
        <p style={{ color: '#a78bfa', fontSize: '0.9rem', fontWeight: 700 }}>{payload[0].value}ms</p>
      </div>
    );
  }
  return null;
};

export default function LatencyChart({ data }) {
  const chartData = data.map(p => ({
    time: formatChartTime(p.checkedAt),
    latency: p.latencyMs >= 0 ? p.latencyMs : null,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.04)"
          vertical={false}
        />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 11, fill: '#5b5b73' }}
          interval="preserveStartEnd"
          axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
          tickLine={false}
        />
        <YAxis
          unit="ms"
          tick={{ fontSize: 11, fill: '#5b5b73' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="latency"
          stroke="#6366f1"
          strokeWidth={2.5}
          fill="url(#latencyGradient)"
          dot={false}
          connectNulls={false}
          activeDot={{
            r: 5,
            fill: '#6366f1',
            stroke: '#a78bfa',
            strokeWidth: 2,
            style: { filter: 'drop-shadow(0 0 6px rgba(99,102,241,0.5))' }
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
