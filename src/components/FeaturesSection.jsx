import React, { useState } from 'react';
import { Cpu, Zap, Wind, Layers, CheckCircle2, Activity, Gauge, Flame, Compass, ShieldCheck } from 'lucide-react';

export default function FeaturesSection({ carColor }) {
  const [activeTab, setActiveTab] = useState('aero');

  const tabs = [
    { id: 'aero', label: 'Aerodynamics', icon: Wind },
    { id: 'powertrain', label: 'Powertrain', icon: Zap },
    { id: 'chassis', label: 'Carbon Chassis', icon: Layers },
    { id: 'telemetry', label: 'AI Telemetry', icon: Cpu }
  ];

  const tabContent = {
    aero: {
      title: "ULTRA-LOW DRAG COEFFICIENT (0.19 Cd)",
      desc: "Designed using computational fluid dynamics (CFD) and tested in ultra-high-speed wind tunnels. Active underbody diffuser dynamically adjusts angle based on real-time velocity.",
      metrics: [
        { label: "Front Downforce", value: "280 kg @ 250 km/h" },
        { label: "Rear Active Wing", value: "Variable 0 deg - 45 deg" },
        { label: "Side Venturi Channels", value: "Dual Air Ducts" }
      ]
    },
    powertrain: {
      title: "QUAD-MOTOR 1,400 HP ELECTRIC DRIVE",
      desc: "Instant torque delivery to all four wheels individually. 800V silicon-carbide architecture enables ultra-fast charging from 10% to 80% in under 12 minutes.",
      metrics: [
        { label: "Peak Output", value: "1,400 HP / 1,044 kW" },
        { label: "Max Torque", value: "1,850 Nm Instant" },
        { label: "Battery Capacity", value: "105 kWh Liquid Cooled" }
      ]
    },
    chassis: {
      title: "MONOCOQUE CARBON FIBER CORE",
      desc: "Single-piece structural carbon fiber tub with integrated aluminum crash structures for unyielding torsional rigidity and maximum safety under high lateral G-forces.",
      metrics: [
        { label: "Torsional Rigidity", value: "65,000 Nm/degree" },
        { label: "Curb Weight", value: "1,680 kg Ultra-Light" },
        { label: "Weight Distribution", value: "48% Front / 52% Rear" }
      ]
    },
    telemetry: {
      title: "REAL-TIME NEURAL TELEMETRY HUD",
      desc: "Monitors tire temperature, brake rotor heat dissipation, suspension travel, and aero balance 1,000 times per second, providing live feedback to the driver.",
      metrics: [
        { label: "Processing Frequency", value: "1,000 Hz Live Loop" },
        { label: "Sensor Nodes", value: "240+ Embedded Points" },
        { label: "Telemetry Delay", value: "< 0.5 milliseconds" }
      ]
    }
  };

  return (
    <section id="telemetry" className="relative w-full py-24 sm:py-32 px-4 sm:px-6 bg-[#0f1015] text-white border-t border-zinc-800 overflow-hidden">
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none opacity-15 blur-[120px] rounded-full transition-colors duration-500"
        style={{ backgroundColor: carColor || '#45db7d' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-700/80 text-xs font-mono-tech text-white tracking-widest uppercase shadow-xl font-bold">
            <Activity className="w-3.5 h-3.5 animate-pulse" style={{ color: carColor || '#45db7d' }} />
            <span>SUPERCAR TELEMETRY & SPECS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-wider uppercase font-mono-tech leading-tight">
            ENGINEERED FOR SUPREMACY
          </h2>
          <p className="text-zinc-400 font-mono-tech text-xs sm:text-sm tracking-widest uppercase">
            Every curve and aerodynamic contour is engineered for maximum downforce and instant throttle response.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-mono-tech text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 text-white font-extrabold border shadow-2xl scale-105'
                    : 'bg-zinc-900/50 text-zinc-400 hover:text-white border border-zinc-800/80 hover:border-zinc-700'
                }`}
                style={isActive ? { borderColor: carColor || '#45db7d', boxShadow: `0 0 25px -5px ${carColor || '#45db7d'}40` } : {}}
              >
                <Icon className="w-4 h-4" style={{ color: isActive ? (carColor || '#45db7d') : '#a1a1aa' }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-zinc-900/90 rounded-3xl p-6 sm:p-12 border border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden mb-16 backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 text-left space-y-6">
              <span className="text-xs font-mono-tech uppercase tracking-widest font-bold block" style={{ color: carColor || '#45db7d' }}>
                SPECIFICATION HIGHLIGHT
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-wide uppercase leading-snug font-mono-tech">
                {tabContent[activeTab].title}
              </h3>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                {tabContent[activeTab].desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
                {tabContent[activeTab].metrics.map((m, i) => (
                  <div key={i} className="bg-black/60 rounded-2xl p-4 border border-zinc-800/90">
                    <span className="text-[10px] text-zinc-500 font-mono-tech block uppercase mb-1 font-bold">{m.label}</span>
                    <span className="text-sm font-extrabold font-mono-tech text-white">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[280px] bg-black/80 rounded-2xl border border-zinc-800 p-8 overflow-hidden text-white shadow-2xl">
              <div className="relative z-10 text-center space-y-5">
                <div
                  className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-black shadow-2xl transition-transform duration-300 hover:scale-110"
                  style={{ backgroundColor: carColor || '#45db7d' }}
                >
                  <Gauge className="w-10 h-10 stroke-[2.5]" />
                </div>
                <div className="font-mono-tech space-y-1">
                  <span className="text-xs text-zinc-500 block uppercase font-bold tracking-widest">REAL-TIME SYSTEM DIAGNOSTIC</span>
                  <span className="text-lg font-black text-white uppercase tracking-wider">ALL SYSTEMS CALIBRATED</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono-tech" style={{ color: carColor || '#45db7d' }}>
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-bold tracking-wider">100% PERFORMANCE READY</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="specs" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/90 rounded-2xl p-7 text-left border border-zinc-800 shadow-xl relative group hover:border-zinc-700 transition-all duration-300">
            <span className="text-xs font-mono-tech tracking-widest block mb-2 uppercase font-bold text-emerald-400">01 / PERFORMANCE</span>
            <h4 className="text-xl font-bold text-white uppercase mb-3 font-mono-tech">LIGHTNING ACCELERATION</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-5">
              From standstill to 200 km/h in just 7.8 seconds with active launch control system and instant torque vectoring.
            </p>
            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs font-mono-tech text-zinc-500 font-bold">0-200 KM/H</span>
              <span className="text-2xl font-mono-tech font-extrabold text-white">7.8s</span>
            </div>
          </div>

          <div className="bg-zinc-900/90 rounded-2xl p-7 text-left border border-zinc-800 shadow-xl relative group hover:border-zinc-700 transition-all duration-300">
            <span className="text-xs font-mono-tech tracking-widest block mb-2 uppercase font-bold text-sky-400">02 / BATTERY TECH</span>
            <h4 className="text-xl font-bold text-white uppercase mb-3 font-mono-tech">EXTENDED RANGE CAPACITY</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-5">
              Advanced solid-state electrolyte cells providing up to 620 km per single charge with 800V ultra-fast charging.
            </p>
            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs font-mono-tech text-zinc-500 font-bold">RANGE CAPACITY</span>
              <span className="text-2xl font-mono-tech font-extrabold text-white">620 KM</span>
            </div>
          </div>

          <div className="bg-zinc-900/90 rounded-2xl p-7 text-left border border-zinc-800 shadow-xl relative group hover:border-zinc-700 transition-all duration-300">
            <span className="text-xs font-mono-tech tracking-widest block mb-2 uppercase font-bold text-orange-400">03 / SMART COCKPIT</span>
            <h4 className="text-xl font-bold text-white uppercase mb-3 font-mono-tech">NEURAL INTERFACE HUD</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-5">
              Heads-up projection displays optimal racing line and braking points directly onto the windshield in real-time.
            </p>
            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs font-mono-tech text-zinc-500 font-bold">RESPONSE LATENCY</span>
              <span className="text-2xl font-mono-tech font-extrabold text-white">0.2 MS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
