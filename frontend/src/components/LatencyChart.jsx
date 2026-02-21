import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function LatencyChart({ data }) {
  const chartData = data.map(p => ({
    time: new Date(p.checkedAt).toLocaleTimeString(),
    latency: p.latencyMs >= 0 ? p.latencyMs : null,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="time" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
        <YAxis unit="ms" tick={{ fontSize: 11 }} />
        <Tooltip formatter={(v) => [`${v}ms`, 'Latency']} />
        <Line type="monotone" dataKey="latency" stroke="#4f46e5" dot={false} strokeWidth={2} connectNulls={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
