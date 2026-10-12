import React from 'react';
import { Bell, CheckCircle2, ShieldAlert, Check } from 'lucide-react';

export default function Alerts({ alerts, onMarkRead, onMarkAllRead }) {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white font-display">System Alerts & Notices</h2>
          </div>
          <p className="text-xs text-slate-400">
            Real-time environmental threshold breaches and AI leaf disease notifications
          </p>
        </div>

        <button
          onClick={onMarkAllRead}
          className="btn btn-secondary text-xs py-2.5 px-4 flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          Mark All As Read
        </button>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto opacity-80" />
            <h3 className="text-base font-bold text-white font-display">Zero Active Alerts</h3>
            <p className="text-xs text-slate-400">All environmental metrics are within safe operational thresholds.</p>
          </div>
        ) : (
          alerts.map((alt) => (
            <div
              key={alt.id}
              className={`glass-panel p-5 rounded-2xl flex items-start justify-between gap-4 border transition-all ${
                alt.is_read ? 'opacity-50 border-slate-800' : 'border-emerald-500/30'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl border mt-0.5 ${
                  alt.severity === 'critical'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>
                  <ShieldAlert className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white font-display">{alt.title}</h3>
                    <span className={`badge ${alt.severity === 'critical' ? 'badge-rose' : 'badge-amber'}`}>
                      {alt.severity}
                    </span>
                    {alt.sensor_type && (
                      <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                        {alt.sensor_type}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{alt.message}</p>
                  {alt.value !== undefined && alt.value !== null && alt.threshold !== undefined && (
                    <p className="text-[11px] text-slate-400 font-mono pt-1">
                      Registered Value: <strong className="text-white">{alt.value}</strong> (Safe Threshold: {alt.threshold})
                    </p>
                  )}
                </div>
              </div>

              {!alt.is_read && (
                <button
                  onClick={() => onMarkRead(alt.id)}
                  className="btn btn-secondary text-xs py-1.5 px-3 flex-shrink-0"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
