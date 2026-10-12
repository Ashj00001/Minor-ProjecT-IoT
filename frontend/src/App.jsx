import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SimulatorModal from './components/SimulatorModal';

import Dashboard from './pages/Dashboard';
import LiveSensors from './pages/LiveSensors';
import LeafScanner from './components/LeafScanner';
import PlantManager from './pages/PlantManager';
import AnalyticsReports from './pages/AnalyticsReports';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  
  // Data States
  const [latestSensor, setLatestSensor] = useState(null);
  const [sensorHistory, setSensorHistory] = useState([]);
  const [plants, setPlants] = useState([]);
  const [reports, setReports] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Simulator Modal States
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState(false);
  const [isSimulatorActive, setIsSimulatorActive] = useState(true);
  const [simulatorPreset, setSimulatorPreset] = useState('Normal');

  // Load Initial Data
  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(fetchLiveTelemetry, 3500);
    return () => clearInterval(interval);
  }, []);

  const fetchInitialData = async () => {
    try {
      const [plantsRes, reportsRes, alertsRes, simRes] = await Promise.all([
        fetch('/api/v1/plants/').then(r => r.json()),
        fetch('/api/v1/reports/').then(r => r.json()),
        fetch('/api/v1/alerts/').then(r => r.json()),
        fetch('/api/v1/simulator/status').then(r => r.json())
      ]);

      if (Array.isArray(plantsRes)) setPlants(plantsRes);
      if (Array.isArray(reportsRes)) setReports(reportsRes);
      if (Array.isArray(alertsRes)) setAlerts(alertsRes);
      if (simRes) {
        setIsSimulatorActive(simRes.active ?? true);
        setSimulatorPreset(simRes.preset ?? 'Normal');
      }

      fetchLiveTelemetry();
    } catch (err) {
      console.warn('Initial data load warning:', err);
    }
  };

  const fetchLiveTelemetry = async () => {
    try {
      const [liveRes, histRes] = await Promise.all([
        fetch('/api/v1/sensors/live').then(r => r.json()),
        fetch('/api/v1/sensors/history?limit=30').then(r => r.json())
      ]);

      if (liveRes && liveRes.temperature) setLatestSensor(liveRes);
      if (Array.isArray(histRes)) setSensorHistory(histRes);
    } catch (err) {
      console.warn('Live telemetry fetch warning:', err);
    }
  };

  // Actions
  const handleToggleSimulator = async () => {
    try {
      const res = await fetch('/api/v1/simulator/toggle', { method: 'POST' });
      const data = await res.json();
      setIsSimulatorActive(data.active);
    } catch (err) {
      setIsSimulatorActive(!isSimulatorActive);
    }
  };

  const handleChangeSimulatorPreset = async (presetName) => {
    setSimulatorPreset(presetName);
    try {
      await fetch('/api/v1/simulator/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: true, preset: presetName })
      });
      fetchLiveTelemetry();
    } catch (err) {
      console.warn('Simulator config update failed:', err);
    }
  };

  const handleAddPlant = async (newPlantData) => {
    try {
      const res = await fetch('/api/v1/plants/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlantData)
      });
      const saved = await res.json();
      setPlants([saved, ...plants]);
    } catch (err) {
      const mockSaved = { ...newPlantData, id: Date.now(), created_at: new Date().toISOString() };
      setPlants([mockSaved, ...plants]);
    }
  };

  const handleDeletePlant = async (id) => {
    try {
      await fetch(`/api/v1/plants/${id}`, { method: 'DELETE' });
    } catch (e) {}
    setPlants(plants.filter(p => p.id !== id));
  };

  const handleMarkAlertRead = async (id) => {
    try {
      await fetch(`/api/v1/alerts/${id}/read`, { method: 'POST' });
    } catch (e) {}
    setAlerts(alerts.map(a => a.id === id ? { ...a, is_read: true } : a));
  };

  const handleMarkAllAlertsRead = async () => {
    try {
      await fetch('/api/v1/alerts/read-all', { method: 'POST' });
    } catch (e) {}
    setAlerts(alerts.map(a => ({ ...a, is_read: true })));
  };

  const unreadAlertsCount = alerts.filter(a => !a.is_read).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        isSimulatorActive={isSimulatorActive}
        onOpenSimulatorModal={() => setIsSimulatorModalOpen(true)}
        unreadAlertsCount={unreadAlertsCount}
      />

      <div className="app-layout flex-1">
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          unreadAlertsCount={unreadAlertsCount}
        />

        <main className="main-content">
          {activePage === 'dashboard' && (
            <Dashboard
              latestSensor={latestSensor}
              plants={plants}
              reports={reports}
              alerts={alerts}
              setActivePage={setActivePage}
              onOpenSimulator={() => setIsSimulatorModalOpen(true)}
            />
          )}

          {activePage === 'sensors' && (
            <LiveSensors
              latestSensor={latestSensor}
              historyData={sensorHistory}
              onOpenSimulatorModal={() => setIsSimulatorModalOpen(true)}
            />
          )}

          {activePage === 'detector' && (
            <LeafScanner
              onAnalyzeCompleted={(newReport) => {
                fetchInitialData();
              }}
            />
          )}

          {activePage === 'plants' && (
            <PlantManager
              plants={plants}
              onAddPlant={handleAddPlant}
              onDeletePlant={handleDeletePlant}
            />
          )}

          {activePage === 'reports' && (
            <AnalyticsReports reports={reports} />
          )}

          {activePage === 'alerts' && (
            <Alerts
              alerts={alerts}
              onMarkRead={handleMarkAlertRead}
              onMarkAllRead={handleMarkAllAlertsRead}
            />
          )}

          {activePage === 'settings' && (
            <Settings />
          )}
        </main>
      </div>

      {/* IoT Telemetry Simulator Preset Modal */}
      <SimulatorModal
        isOpen={isSimulatorModalOpen}
        onClose={() => setIsSimulatorModalOpen(false)}
        currentPreset={simulatorPreset}
        isSimulatorActive={isSimulatorActive}
        onToggleSimulator={handleToggleSimulator}
        onChangePreset={handleChangeSimulatorPreset}
      />
    </div>
  );
}
