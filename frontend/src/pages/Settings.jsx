import React from 'react';
import { Settings as SettingsIcon, Cpu, Camera, Radio, Terminal, ExternalLink } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-xl font-bold text-white font-display">Hardware & System Integration Guide</h2>
            <p className="text-xs text-slate-400">Phase 2 Physical Hardware setup for Raspberry Pi and Environmental Sensors</p>
          </div>
        </div>
      </div>

      {/* Hardware Wiring Pinout Guide Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Raspberry Pi & Sensor Node Setup */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white font-display">Sensor Node GPIO Wiring</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">1. DHT22 Temperature & Humidity Sensor</span>
              <p className="text-slate-400">VCC -&gt; 3.3V (Pin 1) | Data -&gt; GPIO 4 (Pin 7) | GND -&gt; GND (Pin 9)</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">2. Capacitive Soil Moisture Sensor (via ADS1115 ADC)</span>
              <p className="text-slate-400">VCC -&gt; 5V (Pin 2) | Signal -&gt; ADS1115 A0 | ADS1115 SDA/SCL -&gt; GPIO 2/3 (I2C)</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">3. BH1750 Ambient Light Sensor (I2C)</span>
              <p className="text-slate-400">VCC -&gt; 3.3V | SDA -&gt; GPIO 2 (Pin 3) | SCL -&gt; GPIO 3 (Pin 5) | GND -&gt; GND</p>
            </div>
          </div>
        </div>

        {/* Raspberry Pi Camera Setup */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Camera className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-display">RPi Camera Module Integration</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <p className="leading-relaxed">
              Connect the Raspberry Pi Camera module to the CSI port ribbon connector or plug in a standard USB webcam.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-[11px] text-emerald-400 border border-slate-800 space-y-1">
              <p className="text-slate-500"># Start hardware daemon script on Raspberry Pi:</p>
              <p>cd ~/Thalir/raspberry-pi</p>
              <p>python3 sensor_node.py --backend http://&lt;SERVER_IP&gt;:8000</p>
              <p>python3 camera_node.py --interval 600</p>
            </div>

            <p className="text-[11px] text-slate-400">
              The camera node script automatically captures leaf snapshots every 10 minutes and posts payload to <code className="text-emerald-400 font-mono">/api/v1/predict</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
