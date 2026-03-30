import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatChartTime } from '../utils/time';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1c2128',
        border: '1px solid #30363d',
        borderRadius: '6px',
        padding: '6px 10px',
        fontSize: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
      }}>
        <p style={{ color: '#8b949e', marginBottom: '2px' }}>{label}</p>
        <p style={{ color: '#56d364', fontWeight: 600 }}>{payload[0].value}ms</p>
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
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2ea043" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#2ea043" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false} />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 10, fill: '#6e7681' }}
          interval="preserveStartEnd"
          axisLine={{ stroke: '#30363d' }}
          tickLine={false}
        />
        <YAxis
          unit="ms"
          tick={{ fontSize: 10, fill: '#6e7681' }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="latency"
          stroke="#2ea043"
          strokeWidth={2}
          fill="url(#latencyGradient)"
          dot={false}
          connectNulls={false}
          activeDot={{ r: 4, fill: '#56d364', stroke: '#161b22', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
