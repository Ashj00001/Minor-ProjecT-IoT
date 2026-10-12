import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Gauge, 
  Sun, 
  Trees, 
  ShieldAlert, 
  CheckCircle2, 
  ScanLine, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import SensorCard from '../components/SensorCard';
import PlantCard from '../components/PlantCard';

export default function Dashboard({ 
  latestSensor, 
  plants, 
  reports, 
  alerts, 
  setActivePage, 
  onOpenSimulator 
}) {
  const healthyPlantsCount = plants.filter(p => p.health_status.toLowerCase().includes('healthy')).length;
  const diseasedPlantsCount = plants.length - healthyPlantsCount;
  const criticalAlertsCount = alerts.filter(a => a.severity === 'critical' && !a.is_read).length;

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-emerald-950/50 border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Zone A Greenhouse Field Operations
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-display">
            Smart Crop Health & Telemetry Center
          </h2>
          <p className="text-xs md:text-sm text-slate-300">
            Real-time IoT sensor telemetry active. <strong>{healthyPlantsCount} of {plants.length} registered crops</strong> are optimal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActivePage('detector')}
            className="btn btn-primary py-3 px-5 text-sm"
          >
            <ScanLine className="w-4 h-4" />
            Launch AI Leaf Scanner
          </button>

          <button
            onClick={onOpenSimulator}
            className="btn btn-secondary py-3 px-4 text-sm"
          >
            Adjust IoT Simulator
          </button>
        </div>
      </div>

      {/* Live IoT Sensor Metric Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            Live Field Environmental Telemetry
          </h3>
          <button
            onClick={() => setActivePage('sensors')}
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
          >
            View Telemetry History <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid-metrics">
          <SensorCard
            type="Air Temperature"
            value={latestSensor?.temperature ?? 31.2}
            unit="°C"
            minThreshold={18.0}
            maxThreshold={35.0}
            idealRange="24°C – 32°C"
            icon={Thermometer}
            accentColor="#f59e0b"
          />

          <SensorCard
            type="Air Humidity"
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
            type="Light Intensity"
            value={latestSensor?.light_lux ?? 820.0}
            unit="lx"
            minThreshold={300.0}
            maxThreshold={1200.0}
            idealRange="600 lx – 1000 lx"
            icon={Sun}
            accentColor="#3b82f6"
          />
        </div>
      </div>

      {/* Main Grid: Crop Status + Diagnostic Logs + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Registered Field Crops Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Trees className="w-5 h-5 text-emerald-400" />
              Registered Farm Crops ({plants.length})
            </h3>
            <button
              onClick={() => setActivePage('plants')}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Manage Crops
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plants.slice(0, 4).map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        </div>

        {/* Right Sidebar: Recent AI Reports & Quick Alerts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent AI Scan Logs */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-display">Recent AI Leaf Scans</h3>
              <button
                onClick={() => setActivePage('reports')}
                className="text-[11px] text-emerald-400 hover:underline"
              >
                All Logs
              </button>
            </div>

            <div className="space-y-3">
              {reports.slice(0, 3).map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => setActivePage('reports')}
                  className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800/80 cursor-pointer transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{rep.crop} — {rep.disease_detected}</span>
                    <span className={`badge ${rep.disease_detected.includes('Healthy') ? 'badge-emerald' : 'badge-rose'}`}>
                      {rep.confidence}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{rep.recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental Warnings Feed */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Active Alerts
              </h3>
              <span className="text-xs text-slate-400 font-mono">{alerts.length} Notices</span>
            </div>

            <div className="space-y-2.5">
              {alerts.slice(0, 3).map((alt) => (
                <div
                  key={alt.id}
                  className={`p-3 rounded-xl border text-xs space-y-1 ${
                    alt.severity === 'critical'
                      ? 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                      : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{alt.title}</span>
                    <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700">
                      {alt.severity}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-90 line-clamp-2">{alt.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
