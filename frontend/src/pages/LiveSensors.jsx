import React, { useState } from 'react';
import { Activity, Thermometer, Droplets, Gauge, Sun, Cpu, ShieldCheck } from 'lucide-react';
import SensorCard from '../components/SensorCard';
import SensorChart from '../components/SensorChart';

export default function LiveSensors({ latestSensor, historyData, onOpenSimulatorModal }) {
  const [activeMetric, setActiveMetric] = useState('soil_moisture');

  // Compute stats from history
  const calculateStats = (key) => {
    if (!historyData || historyData.length === 0) return { avg: 0, min: 0, max: 0 };
    const vals = historyData.map(d => d[key] || 0);
    const sum = vals.reduce((a, b) => a + b, 0);
    return {
      avg: (sum / vals.length).toFixed(1),
      min: Math.min(...vals).toFixed(1),
      max: Math.max(...vals).toFixed(1)
    };
  };

  const tempStats = calculateStats('temperature');
  const humStats = calculateStats('humidity');
  const soilStats = calculateStats('soil_moisture');
  const lightStats = calculateStats('light_lux');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white font-display">Live IoT Sensor Monitoring</h2>
          </div>
          <p className="text-xs text-slate-400">
            Broadcasting real-time microclimate metrics from field nodes (DHT22, Soil Moisture ADS1115, BH1750 Light)
          </p>
        </div>

        <button
          onClick={onOpenSimulatorModal}
          className="btn btn-primary text-xs py-2.5 px-4 flex items-center gap-2"
        >
          <Cpu className="w-4 h-4" />
          IoT Simulator Config
        </button>
      </div>

      {/* Sensor Cards Row */}
      <div className="grid-metrics">
        <SensorCard
          type="Temperature"
          value={latestSensor?.temperature ?? 31.2}
          unit="°C"
          minThreshold={18.0}
          maxThreshold={35.0}
          idealRange="24°C – 32°C"
          icon={Thermometer}
          accentColor="#f59e0b"
        />
        <SensorCard
          type="Humidity"
          value={latestSensor?.humidity ?? 67.4}
          unit="%"
          minThreshold={40.0}
          maxThreshold={85.0}
          idealRange="55% – 75%"
          icon={Droplets}
          accentColor="#06b6d4"
        />
        <SensorCard
          type="Soil Moisture"
          value={latestSensor?.soil_moisture ?? 42.0}
          unit="%"
          minThreshold={30.0}
          maxThreshold={80.0}
          idealRange="35% – 60%"
          icon={Gauge}
          accentColor="#10b981"
        />
        <SensorCard
          type="Light Lux"
          value={latestSensor?.light_lux ?? 820.0}
          unit="lx"
          minThreshold={300.0}
          maxThreshold={1200.0}
          idealRange="600 lx – 1000 lx"
          icon={Sun}
          accentColor="#3b82f6"
        />
      </div>

      {/* Recharts Historical Telemetry Area Chart */}
      <SensorChart
        data={historyData}
        activeMetric={activeMetric}
        setActiveMetric={setActiveMetric}
      />

      {/* Historical Telemetry Summary Table */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Statistical Metric Analytics (Last 30 Telemetry Readings)
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Air Temperature</span>
            <div className="text-lg font-bold text-amber-400 font-display">Avg: {tempStats.avg}°C</div>
            <p className="text-[11px] text-slate-500 font-mono">Min: {tempStats.min}°C | Max: {tempStats.max}°C</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Air Humidity</span>
            <div className="text-lg font-bold text-cyan-400 font-display">Avg: {humStats.avg}%</div>
            <p className="text-[11px] text-slate-500 font-mono">Min: {humStats.min}% | Max: {humStats.max}%</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Soil Moisture</span>
            <div className="text-lg font-bold text-emerald-400 font-display">Avg: {soilStats.avg}%</div>
            <p className="text-[11px] text-slate-500 font-mono">Min: {soilStats.min}% | Max: {soilStats.max}%</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Light Lux</span>
            <div className="text-lg font-bold text-blue-400 font-display">Avg: {lightStats.avg} lx</div>
            <p className="text-[11px] text-slate-500 font-mono">Min: {lightStats.min} lx | Max: {lightStats.max} lx</p>
          </div>
        </div>
      </div>
    </div>
  );
}
