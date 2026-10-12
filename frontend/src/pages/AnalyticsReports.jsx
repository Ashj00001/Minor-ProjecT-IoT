import React, { useState } from 'react';
import { FileText, Search, Download, CheckCircle, ShieldAlert, Calendar } from 'lucide-react';

export default function AnalyticsReports({ reports }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredReports = reports.filter((r) => {
    const matchesSearch = r.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.disease_detected.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.recommendation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === 'ALL' || r.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white font-display">Diagnostic Reports & Analytics</h2>
          </div>
          <p className="text-xs text-slate-400">
            Historical leaf scan diagnostics logged by AI disease detection engine
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search disease, crop, or remedy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Severity Levels</option>
            <option value="None">None (Healthy)</option>
            <option value="Moderate">Moderate Risk</option>
            <option value="High">High Risk</option>
            <option value="Critical">Critical Emergency</option>
          </select>
        </div>
      </div>

      {/* Reports Table / List */}
      <div className="glass-panel rounded-2xl overflow-hidden border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Crop</th>
                <th className="py-3.5 px-4">Disease Classification</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Actionable Remedy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredReports.map((rep) => {
                const dateStr = rep.created_at ? new Date(rep.created_at).toLocaleDateString() : '2026-03-01';
                const isHealthy = rep.disease_detected.toLowerCase().includes('healthy');

                return (
                  <tr key={rep.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">{dateStr}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{rep.crop}</td>
                    <td className="py-3.5 px-4 font-medium flex items-center gap-2">
                      {isHealthy ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span>{rep.disease_detected}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{rep.confidence}%</td>
                    <td className="py-3.5 px-4">
                      <span className={`badge ${
                        rep.severity === 'Critical' ? 'badge-rose' :
                        rep.severity === 'High' ? 'badge-amber' :
                        rep.severity === 'Moderate' ? 'badge-blue' : 'badge-emerald'
                      }`}>
                        {rep.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">{rep.recommendation}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
