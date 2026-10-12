import React from 'react';
import { Sprout, Activity, Bell, Cpu } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, isSimulatorActive, onOpenSimulatorModal, unreadAlertsCount }) {
  return (
    <header className="glass-header px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <Sprout className="w-6 h-6 text-slate-950 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide font-display flex items-center gap-2">
            Thalir <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">v1.0 AI+IoT</span>
          </h1>
          <p className="text-xs text-slate-400">Smart Agriculture & Disease Detection</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* IoT Live Status Indicator */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800">
          <span className={`pulse-dot ${isSimulatorActive ? 'pulse-dot-active' : 'bg-amber-500'}`}></span>
          <span className="text-xs font-medium text-slate-300">
            {isSimulatorActive ? 'Live Telemetry Streaming' : 'Telemetry Paused'}
          </span>
        </div>

        {/* Simulator Preset Control Button */}
        <button
          onClick={onOpenSimulatorModal}
          className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-2"
        >
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>IoT Simulator</span>
        </button>

        {/* Notifications Icon Button */}
        <button
          onClick={() => setActivePage('alerts')}
          className="relative p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all hover:border-emerald-500/30"
          title="System Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse shadow-md shadow-rose-500/50">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-900 to-slate-900 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-xs shadow-inner">
            FA
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-white">Farmer Admin</p>
            <p className="text-[10px] text-emerald-400 font-medium">Zone A Field Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
