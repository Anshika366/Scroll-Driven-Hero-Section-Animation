import React, { useState, useEffect } from 'react';
import { Gauge, ChevronRight, Menu, X, Sparkles, Zap, Flame, Shield, Compass } from 'lucide-react';

function MobileMenu({ driveModes, driveMode, setDriveMode, setMobileMenuOpen, scrollToSection, colorOptions, carColor, setCarColor }) {
  return (
    <div className="md:hidden w-full bg-zinc-950 border-b border-zinc-800 px-6 py-6 font-mono-tech text-xs text-white uppercase">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <span className="text-zinc-400">DRIVE MODE:</span>
        <div className="flex gap-2">
          {driveModes.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setDriveMode(m.id);
                setMobileMenuOpen(false);
              }}
              className={driveMode === m.id ? "px-3 py-1 rounded-lg text-xs font-bold bg-white text-black" : "px-3 py-1 rounded-lg text-xs font-bold bg-zinc-800 text-zinc-400"}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => scrollToSection('top')}
        className="text-left py-2 border-b border-zinc-800 flex items-center justify-between w-full"
      >
        <span>Overview</span>
        <ChevronRight className="w-4 h-4 text-zinc-500" />
      </button>
      <button
        onClick={() => scrollToSection('telemetry')}
        className="text-left py-2 border-b border-zinc-800 flex items-center justify-between w-full"
      >
        <span>Telemetry</span>
        <ChevronRight className="w-4 h-4 text-zinc-500" />
      </button>
      <button
        onClick={() => scrollToSection('specs')}
        className="text-left py-2 border-b border-zinc-800 flex items-center justify-between w-full"
      >
        <span>Specs</span>
        <ChevronRight className="w-4 h-4 text-zinc-500" />
      </button>

      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-zinc-400 font-semibold">COLOR PALETTE:</span>
        <div className="flex items-center gap-2">
          {colorOptions.map((c) => (
            <button
              key={c.hex}
              onClick={() => {
                setCarColor(c.hex);
                setMobileMenuOpen(false);
              }}
              className={carColor === c.hex ? "w-6 h-6 rounded-full scale-125 ring-2 ring-white" : "w-6 h-6 rounded-full opacity-60"}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Navbar({ carColor, setCarColor, driveMode, setDriveMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const colorOptions = [
    { name: 'Apex Green', hex: '#45db7d' },
    { name: 'Riviera Blue', hex: '#6ac9ff' },
    { name: 'Formula Lime', hex: '#def54f' },
    { name: 'Volcano Orange', hex: '#fa7328' },
    { name: 'Hyper Violet', hex: '#a855f7' },
    { name: 'Crimson Red', hex: '#f43f5e' }
  ];

  const driveModes = [
    { id: 'race', label: 'RACE', icon: Zap, color: '#45db7d' },
    { id: 'eco', label: 'ECO', icon: Compass, color: '#6ac9ff' },
    { id: 'drift', label: 'DRIFT', icon: Flame, color: '#fa7328' },
    { id: 'stealth', label: 'STEALTH', icon: Shield, color: '#a855f7' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (id === 'top') {
      if (window.__lenis) {
        window.__lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      if (window.__lenis) {
        window.__lenis.scrollTo(el);
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={scrolled ? "fixed top-0 left-0 right-0 w-full z-50 bg-zinc-950 border-b border-zinc-800 py-3" : "fixed top-0 left-0 right-0 w-full z-50 bg-zinc-950 bg-opacity-80 border-b border-zinc-800 py-4"}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group select-none"
          onClick={() => scrollToSection('top')}
        >
          <div 
            className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold border border-zinc-700 transition-all duration-300 group-hover:scale-105"
            style={{ color: carColor }}
          >
            <Gauge className="w-5 h-5 stroke-2" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono-tech text-xl font-black text-white tracking-wider uppercase leading-none flex items-center gap-2">
              itzfizz
              <span className="w-2 h-2 rounded-full inline-block animate-pulse" style={{ backgroundColor: carColor }} />
            </span>
            <span className="text-xs font-mono-tech tracking-widest text-zinc-400 font-bold uppercase mt-1">
              Scroll Supercar | 720S
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-black border border-zinc-800 p-1 rounded-2xl shadow-2xl backdrop-blur-md">
          {driveModes.map((m) => {
            const Icon = m.icon;
            const isSelected = driveMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setDriveMode(m.id)}
                className={isSelected ? "flex items-center gap-2 px-4 py-1.5 rounded-xl font-mono-tech text-xs font-extrabold tracking-wider uppercase transition-all duration-200 cursor-pointer bg-zinc-800 text-white shadow-lg border border-zinc-700 scale-105" : "flex items-center gap-2 px-4 py-1.5 rounded-xl font-mono-tech text-xs font-extrabold tracking-wider uppercase transition-all duration-200 cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-900"}
                style={isSelected ? { color: m.color } : {}}
              >
                <Icon className="w-4 h-4" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden sm:flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-full shadow-inner">
            <span className="text-xs font-mono-tech font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-zinc-300" />
              <span>COLOR:</span>
            </span>
            <div className="flex items-center gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setCarColor(c.hex)}
                  className={carColor === c.hex ? "w-5 h-5 rounded-full transition-all duration-200 cursor-pointer relative scale-125 ring-2 ring-white shadow-lg" : "w-5 h-5 rounded-full transition-all duration-200 cursor-pointer relative hover:scale-110 opacity-60 hover:opacity-100"}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => scrollToSection('specs')}
            className="hidden lg:flex items-center gap-2 text-black font-black text-xs tracking-widest px-5 py-2.5 rounded-xl transition-all duration-200 shadow-xl hover:scale-105 active:scale-95 cursor-pointer uppercase font-mono-tech"
            style={{ backgroundColor: carColor }}
          >
            <span>LAUNCH SPEC</span>
            <ChevronRight className="w-4 h-4 stroke-2" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <MobileMenu
          driveModes={driveModes}
          driveMode={driveMode}
          setDriveMode={setDriveMode}
          setMobileMenuOpen={setMobileMenuOpen}
          scrollToSection={scrollToSection}
          colorOptions={colorOptions}
          carColor={carColor}
          setCarColor={setCarColor}
        />
      )}
    </header>
  );
}
