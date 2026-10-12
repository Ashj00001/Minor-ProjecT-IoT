import React, { useState } from 'react';
import { Plus, Trees, Search, Filter, X } from 'lucide-react';
import PlantCard from '../components/PlantCard';

export default function PlantManager({ plants, onAddPlant, onDeletePlant }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterZone, setFilterZone] = useState('ALL');

  // Form states
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('Tomato (Solanum lycopersicum)');
  const [fieldZone, setFieldZone] = useState('Zone A - Greenhouse 1');
  const [plantedDate, setPlantedDate] = useState('2026-03-01');
  const [imageUrl, setImageUrl] = useState('');
  const [notes, setNotes] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    onAddPlant({
      name,
      species,
      field_zone: fieldZone,
      planted_date: plantedDate,
      health_status: 'Healthy',
      image_url: imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
      notes
    });

    // Reset & Close
    setName('');
    setNotes('');
    setIsModalOpen(false);
  };

  const filteredPlants = plants.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.species.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = filterZone === 'ALL' || p.field_zone.includes(filterZone);
    return matchesSearch && matchesZone;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trees className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white font-display">Farm Crop Management</h2>
          </div>
          <p className="text-xs text-slate-400">
            Register and monitor health history of registered crops across field zones
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary text-xs py-2.5 px-4 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Register New Crop
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search crop name or species..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterZone}
            onChange={(e) => setFilterZone(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Field Zones</option>
            <option value="Zone A">Zone A (Greenhouse 1)</option>
            <option value="Zone B">Zone B (Open Field)</option>
            <option value="Zone C">Zone C (South Ridge)</option>
            <option value="Zone D">Zone D (Orchard)</option>
          </select>
        </div>
      </div>

      {/* Plants Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPlants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} onDelete={onDeletePlant} />
        ))}
      </div>

      {/* Add Crop Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl space-y-4 border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white font-display">Register New Farm Crop</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Crop Name / Tag</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cherry Tomato Row 2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Species / Botanical Name</label>
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Tomato (Solanum lycopersicum)">Tomato (Solanum lycopersicum)</option>
                  <option value="Potato (Solanum tuberosum)">Potato (Solanum tuberosum)</option>
                  <option value="Corn (Zea mays)">Corn (Zea mays)</option>
                  <option value="Apple (Malus domestica)">Apple (Malus domestica)</option>
                  <option value="Grape (Vitis vinifera)">Grape (Vitis vinifera)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Field Zone</label>
                  <select
                    value={fieldZone}
                    onChange={(e) => setFieldZone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Zone A - Greenhouse 1">Zone A - Greenhouse</option>
                    <option value="Zone B - Open Field">Zone B - Open Field</option>
                    <option value="Zone C - South Ridge">Zone C - South Ridge</option>
                    <option value="Zone D - Orchard">Zone D - Orchard</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Planting Date</label>
                  <input
                    type="date"
                    value={plantedDate}
                    onChange={(e) => setPlantedDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Photo Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Agronomic Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes on soil amendment, irrigation schedule..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary text-xs px-4"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs px-4">
                  Save Crop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
