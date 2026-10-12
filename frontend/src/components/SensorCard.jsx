import React from 'react';
import { Thermometer, Droplets, Gauge, Sun, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SensorCard({ type, value, unit, minThreshold, maxThreshold, idealRange, icon: Icon, accentColor }) {
  // Determine if reading is optimal, warning, or critical
  let status = 'optimal';
  let statusText = 'Optimal Level';
  let badgeStyle = 'badge-emerald';

  if (value < minThreshold) {
    status = 'warning';
    statusText = 'Low Warning';
    badgeStyle = 'badge-amber';
  } else if (value > maxThreshold) {
    status = 'critical';
    statusText = 'High Warning';
    badgeStyle = 'badge-rose';
  }

  // Calculate percentage fill for gauge bar
  const rangeSpan = maxThreshold * 1.3;
  const percentage = Math.min(Math.max((value / rangeSpan) * 100, 5), 100);

  return (
    <div className="glass-panel p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center border"
            style={{ 
              backgroundColor: `${accentColor}15`, 
              borderColor: `${accentColor}40`,
              color: accentColor 
            }}
          >
            <Icon className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-300">{type}</h3>
            <p className="text-[11px] text-slate-500 font-mono">Target: {idealRange}</p>
          </div>
        </div>

        <span className={`badge ${badgeStyle}`}>
          {status === 'optimal' ? (
            <CheckCircle2 className="w-3 h-3" />
          ) : (
            <AlertTriangle className="w-3 h-3" />
          )}
          {statusText}
        </span>
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-white tracking-tight font-display">
          {typeof value === 'number' ? value.toFixed(1) : value}
        </span>
        <span className="text-sm font-semibold text-slate-400">{unit}</span>
      </div>

      {/* Progress / Gauge Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden relative border border-slate-800">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: accentColor,
              boxShadow: `0 0 10px ${accentColor}`
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>Min: {minThreshold}{unit}</span>
          <span>Max: {maxThreshold}{unit}</span>
        </div>
      </div>
    </div>
  );
}
