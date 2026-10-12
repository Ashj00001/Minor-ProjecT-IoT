import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  ScanLine, 
  Trees, 
  FileText, 
  Settings, 
  Bell, 
  Cpu 
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage, unreadAlertsCount }) {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'sensors', label: 'Live IoT Telemetry', icon: Activity },
    { id: 'detector', label: 'AI Leaf Scanner', icon: ScanLine, highlight: true },
    { id: 'plants', label: 'Plant Management', icon: Trees },
    { id: 'reports', label: 'Diagnostic Reports', icon: FileText },
    { id: 'alerts', label: 'Alerts & Notices', icon: Bell, badge: unreadAlertsCount },
    { id: 'settings', label: 'Hardware & Setup', icon: Settings }
  ];

  return (
    <aside className="sidebar p-4 space-y-6">
      <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 px-3 pt-2">
        Navigation Menu
      </div>

      <nav className="space-y-1.5 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-xs transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border-l-4 border-emerald-400 border-y border-r border-emerald-500/20 shadow-lg shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.highlight && (
                <span className="text-[9px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide">
                  AI
                </span>
              )}

              {item.badge > 0 && (
                <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick RPi Hardware Status Widget */}
      <div className="glass-panel p-4 rounded-xl space-y-2.5 bg-slate-900/80 border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Cpu className="w-4 h-4 text-emerald-400" />
            Raspberry Pi 4
          </span>
          <span className="badge badge-emerald text-[9px]">Online</span>
        </div>
        <div className="space-y-1 text-[11px] text-slate-400">
          <div className="flex justify-between">
            <span>Sensors (DHT22, Soil):</span>
            <span className="text-emerald-400 font-mono font-semibold">OK</span>
          </div>
          <div className="flex justify-between">
            <span>RPi Cam Module:</span>
            <span className="text-emerald-400 font-mono font-semibold">Ready</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
