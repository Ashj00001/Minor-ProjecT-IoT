import React, { useState } from 'react';
import { X, Cpu, Flame, SunMedium, CloudRain, Moon, Check } from 'lucide-react';

export default function SimulatorModal({ isOpen, onClose, currentPreset, isSimulatorActive, onToggleSimulator, onChangePreset }) {
  if (!isOpen) return null;

  const presets = [
    {
      id: 'Normal',
      name: 'Normal Weather',
      desc: 'Temp ~30°C, Humidity ~65%, Moisture ~45%, Light ~820 lx',
      icon: SunMedium,
      color: '#10b981'
    },
    {
      id: 'Heatwave',
      name: 'Heatwave Stress',
      desc: 'Temp ~38°C, Humidity ~38%, Moisture ~28%, Light ~1100 lx',
      icon: Flame,
      color: '#f59e0b'
    },
    {
      id: 'Drought',
      name: 'Severe Drought',
      desc: 'Temp ~36°C, Humidity ~32%, Moisture ~18% (Low Moisture Alert)',
      icon: Flame,
      color: '#f43f5e'
    },
    {
      id: 'Heavy Rain',
      name: 'Monsoon / Heavy Rain',
      desc: 'Temp ~22°C, Humidity ~92%, Moisture ~88%, Light ~300 lx',
      icon: CloudRain,
      color: '#06b6d4'
    },
    {
      id: 'Night',
      name: 'Night Time',
      desc: 'Temp ~20°C, Humidity ~80%, Moisture ~50%, Light ~5 lx',
      icon: Moon,
      color: '#3b82f6'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg p-6 rounded-2xl space-y-5 border-slate-700 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white font-display">IoT Telemetry Simulator Controls</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div>
            <p className="text-sm font-bold text-white">Simulator Background Worker</p>
            <p className="text-xs text-slate-400">Pushes simulated IoT readings to API every 4 seconds</p>
          </div>

          <button
            onClick={onToggleSimulator}
            className={`btn ${isSimulatorActive ? 'btn-primary' : 'btn-secondary'} text-xs py-2 px-4`}
          >
            {isSimulatorActive ? 'Active (Streaming)' : 'Paused'}
          </button>
        </div>

        {/* Presets Grid */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Select Climate Condition Preset:
          </p>
          <div className="space-y-2">
            {presets.map((p) => {
              const Icon = p.icon;
              const isSelected = currentPreset === p.id;

              return (
                <button
                  key={p.id}
                  onClick={() => onChangePreset(p.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${p.color}20`, color: p.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{p.name}</p>
                      <p className="text-[11px] text-slate-400">{p.desc}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 text-right">
          <button onClick={onClose} className="btn btn-secondary text-xs px-5">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
