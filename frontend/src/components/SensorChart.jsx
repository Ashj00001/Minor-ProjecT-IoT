import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export default function SensorChart({ data, activeMetric, setActiveMetric }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel p-8 text-center text-slate-400">
        Waiting for IoT sensor telemetry stream...
      </div>
    );
  }

  // Format timestamp strings for XAxis
  const formattedData = data.map((item) => {
    const d = new Date(item.timestamp);
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return {
      ...item,
      timeStr
    };
  });

  const metricConfigs = {
    temperature: {
      name: 'Temperature',
      unit: '°C',
      color: '#f59e0b',
      domain: [10, 45]
    },
    humidity: {
      name: 'Humidity',
      unit: '%',
      color: '#06b6d4',
      domain: [20, 100]
    },
    soil_moisture: {
      name: 'Soil Moisture',
      unit: '%',
      color: '#10b981',
      domain: [0, 100]
    },
    light_lux: {
      name: 'Light Intensity',
      unit: 'lx',
      color: '#3b82f6',
      domain: [0, 1500]
    }
  };

  const currentConfig = metricConfigs[activeMetric] || metricConfigs.soil_moisture;

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
            Environmental Telemetry Trends
          </h2>
          <p className="text-xs text-slate-400">Real-time IoT stream data logged every few seconds</p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          {Object.keys(metricConfigs).map((key) => {
            const cfg = metricConfigs[key];
            const isSelected = activeMetric === key;
            return (
              <button
                key={key}
                onClick={() => setActiveMetric(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                style={isSelected ? { color: cfg.color } : {}}
              >
                {cfg.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-72 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="metricGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis 
              dataKey="timeStr" 
              stroke="#6b7280" 
              fontSize={11}
              tickLine={false}
            />
            <YAxis 
              domain={currentConfig.domain}
              stroke="#6b7280" 
              fontSize={11}
              tickLine={false}
              unit={currentConfig.unit}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 34, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#fff',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
              }}
              formatter={(value) => [`${value} ${currentConfig.unit}`, currentConfig.name]}
            />
            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke={currentConfig.color}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#metricGlow)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
