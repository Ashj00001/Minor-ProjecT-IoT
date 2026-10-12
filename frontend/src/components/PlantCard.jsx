import React from 'react';
import { Calendar, MapPin, Activity, Trash2, Edit3 } from 'lucide-react';

export default function PlantCard({ plant, onDelete }) {
  const isHealthy = plant.health_status.toLowerCase().includes('healthy');

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
      {/* Card Image Banner */}
      <div className="h-36 relative overflow-hidden bg-slate-900">
        <img
          src={plant.image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80'}
          alt={plant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`badge ${isHealthy ? 'badge-emerald' : 'badge-rose'}`}>
            {plant.health_status}
          </span>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white font-display">{plant.name}</h3>
          <p className="text-xs text-emerald-400 font-medium">{plant.species}</p>
        </div>

        <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>{plant.field_zone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Planted: {plant.planted_date}</span>
          </div>
        </div>

        {plant.notes && (
          <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 italic">
            "{plant.notes}"
          </p>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2 pt-2">
          {onDelete && (
            <button
              onClick={() => onDelete(plant.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete Crop"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
