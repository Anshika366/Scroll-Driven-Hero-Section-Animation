import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';

export default function App() {
  const [carColor, setCarColor] = useState('#45db7d');
  const [driveMode, setDriveMode] = useState('race');

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    window.__lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      window.__lenis = null;
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white selection:bg-[#45db7d] selection:text-black">
      <Navbar
        carColor={carColor}
        setCarColor={setCarColor}
        driveMode={driveMode}
        setDriveMode={setDriveMode}
      />
      <main id="top">
        <HeroSection
          carColor={carColor}
          driveMode={driveMode}
          setDriveMode={setDriveMode}
        />
        <FeaturesSection
          carColor={carColor}
          driveMode={driveMode}
        />
      </main>
      <Footer carColor={carColor} />
    </div>
  );
}
