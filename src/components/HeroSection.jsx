import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection({ carColor, driveMode }) {
  const sectionRef = useRef(null);
  const roadRef = useRef(null);
  const carRef = useRef(null);
  const trailRef = useRef(null);
  const valueTextRef = useRef(null);

  const audioCtxRef = useRef(null);
  const osc1Ref = useRef(null);
  const osc2Ref = useRef(null);
  const gainRef = useRef(null);
  const filterRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [liveSpeed, setLiveSpeed] = useState(0);
  const [liveGear, setLiveGear] = useState(1);
  const [liveRpm, setLiveRpm] = useState(1100);
  const [isRevving, setIsRevving] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const soundEnabledRef = useRef(false);
  const isRevvingRef = useRef(false);
  const driveModeRef = useRef(driveMode);
  const revIntervalRef = useRef(null);

  useEffect(() => {
    driveModeRef.current = driveMode;
  }, [driveMode]);

  const wordGroups = [
    { word: 'WELCOME', letters: ['W', 'E', 'L', 'C', 'O', 'M', 'E'] },
    { word: 'ITZ', letters: ['I', 'T', 'Z'] },
    { word: 'FIZZ', letters: ['F', 'I', 'Z', 'Z'] }
  ];

  const initAudio = () => {
    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return;
    }
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainRef.current = masterGain;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.value = 3.5;
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.connect(masterGain);
      filterRef.current = filter;

      const osc1 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(65, ctx.currentTime);
      osc1.connect(filter);
      osc1.start();
      osc1Ref.current = osc1;

      const osc2 = ctx.createOscillator();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(130, ctx.currentTime);
      osc2.connect(filter);
      osc2.start();
      osc2Ref.current = osc2;

      setSoundEnabled(true);
      soundEnabledRef.current = true;
    } catch (e) {
      console.warn("Audio Context init error:", e);
    }
  };

  const toggleSound = () => {
    if (!audioCtxRef.current) {
      initAudio();
      setSoundEnabled(true);
      soundEnabledRef.current = true;
    } else {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const nextState = !soundEnabledRef.current;
      setSoundEnabled(nextState);
      soundEnabledRef.current = nextState;

      if (!nextState && gainRef.current) {
        gainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.02);
      }
    }
  };

  const updateEngineSound = (speed, isMoving, soundProgressFactor) => {
    if (!audioCtxRef.current || !soundEnabledRef.current) return;
    const ctx = audioCtxRef.current;

    if (ctx.state === 'suspended' && (isMoving || isRevvingRef.current) && soundProgressFactor > 0) {
      ctx.resume().catch(() => {});
    }

    const speedRatio = Math.min(1, Math.max(0, speed / 280));
    const mode = driveModeRef.current;

    let baseFreq = 65;
    let freqMult = 220;
    let maxFilter = 3200;
    let gainMult = 0.28;

    if (mode === 'drift') {
      baseFreq = 85;
      freqMult = 320;
      maxFilter = 4200;
      gainMult = 0.35;
    } else if (mode === 'eco') {
      baseFreq = 50;
      freqMult = 140;
      maxFilter = 1800;
      gainMult = 0.18;
    } else if (mode === 'stealth') {
      baseFreq = 40;
      freqMult = 160;
      maxFilter = 1400;
      gainMult = 0.22;
    }

    const targetFreq = baseFreq + speedRatio * freqMult;
    const targetFilter = 400 + speedRatio * (maxFilter - 400);

    const targetGain = ((isMoving || isRevvingRef.current) && soundProgressFactor > 0 && soundEnabledRef.current)
      ? (0.07 + speedRatio * gainMult) * soundProgressFactor
      : 0;

    if (osc1Ref.current) {
      osc1Ref.current.type = mode === 'eco' ? 'sine' : 'sawtooth';
      osc1Ref.current.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.03);
    }
    if (osc2Ref.current) {
      osc2Ref.current.type = mode === 'eco' ? 'triangle' : (mode === 'drift' ? 'sawtooth' : 'square');
      osc2Ref.current.frequency.setTargetAtTime(targetFreq * (mode === 'drift' ? 2.05 : 2.02), ctx.currentTime, 0.03);
    }
    if (filterRef.current) {
      filterRef.current.frequency.setTargetAtTime(targetFilter, ctx.currentTime, 0.04);
    }
    if (gainRef.current) {
      gainRef.current.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.03);
    }
  };

  const startRevving = () => {
    initAudio();
    setIsRevving(true);
    isRevvingRef.current = true;
    if (revIntervalRef.current) clearInterval(revIntervalRef.current);

    let revSpeed = liveSpeed;
    revIntervalRef.current = setInterval(() => {
      revSpeed = Math.min(280, revSpeed + 20);
      const rpm = Math.round(1200 + (revSpeed / 280) * 7300);
      setLiveSpeed(revSpeed);
      setLiveRpm(rpm);
      setLiveGear(Math.min(6, Math.max(1, Math.ceil(revSpeed / 48))));
      updateEngineSound(revSpeed, true, 1);
    }, 40);
  };

  const stopRevving = () => {
    setIsRevving(false);
    isRevvingRef.current = false;
    if (revIntervalRef.current) clearInterval(revIntervalRef.current);
    revIntervalRef.current = setInterval(() => {
      setLiveSpeed((prev) => {
        const next = Math.max(0, prev - 25);
        if (next === 0) {
          clearInterval(revIntervalRef.current);
          setLiveRpm(1100);
          updateEngineSound(0, false, 0);
        } else {
          setLiveRpm(Math.round(1100 + (next / 280) * 7300));
          updateEngineSound(next, true, 1);
        }
        return next;
      });
    }, 40);
  };

  useEffect(() => {
    const handleFirstGesture = () => {
      initAudio();
    };
    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    window.addEventListener('scroll', handleFirstGesture, { once: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('scroll', handleFirstGesture);
    };
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let scrollStopTimer = null;
    let currentSpeed = 0;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const road = roadRef.current;
      const car = carRef.current;
      const trail = trailRef.current;
      const valueText = valueTextRef.current;

      if (!section || !road || !car || !trail || !valueText) return;

      const letters = gsap.utils.toArray('.ref-letter');

      const roadWidth = road.offsetWidth || window.innerWidth;
      const carWidth = car.offsetWidth || 380;

      const startX = -carWidth * 0.8;
      const endX = roadWidth + carWidth * 0.6;
      const totalDistance = endX - startX;

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=3000',
          pin: true,
          scrub: 0.15,
          onUpdate: (self) => {
            const prog = self.progress;
            setScrollProgress(Math.round(prog * 100));

            const now = performance.now();
            const dt = Math.max(16, now - lastTime);
            const dy = Math.abs(window.scrollY - lastScrollY);
            lastScrollY = window.scrollY;
            lastTime = now;

            let soundProgressFactor = 1;
            if (prog > 0.75) {
              soundProgressFactor = Math.max(0, 1 - (prog - 0.75) / 0.15);
            } else if (prog < 0.02) {
              soundProgressFactor = Math.max(0, prog / 0.02);
            }

            const targetSpeed = (dy > 0.1 && soundProgressFactor > 0)
              ? Math.min(290, Math.max(70, Math.round((dy / dt) * 185 + prog * 65)))
              : (isRevvingRef.current ? 220 : 0);

            currentSpeed += (targetSpeed - currentSpeed) * 0.35;
            if (currentSpeed < 4 && !isRevvingRef.current) currentSpeed = 0;

            const isMoving = currentSpeed > 0 && soundProgressFactor > 0;
            const calculatedSpeed = Math.round(currentSpeed);
            const calculatedGear = isMoving ? Math.min(6, Math.max(1, Math.ceil(calculatedSpeed / 48))) : 1;

            if (!isRevvingRef.current) {
              setLiveSpeed(calculatedSpeed);
              setLiveGear(calculatedGear);
              setLiveRpm(calculatedSpeed > 0 ? Math.round(1100 + (calculatedSpeed / 290) * 7400) : 1100);
            }

            if (dy > 0.5) initAudio();
            updateEngineSound(calculatedSpeed, isMoving || isRevvingRef.current, soundProgressFactor);

            if (scrollStopTimer) clearTimeout(scrollStopTimer);
            scrollStopTimer = setTimeout(() => {
              if (!isRevvingRef.current) {
                currentSpeed = 0;
                setLiveSpeed(0);
                setLiveRpm(1100);
                updateEngineSound(0, false, 0);
              }
            }, 150);

            const currentX = startX + prog * totalDistance;

            let carOpacity = 1;
            if (prog > 0.75) {
              carOpacity = Math.max(0, 1 - (prog - 0.75) / 0.15);
            } else if (prog < 0.03) {
              carOpacity = Math.max(0, prog / 0.03);
            }

            gsap.set(car, { x: currentX, opacity: carOpacity });

            const trailWidth = Math.min(roadWidth, Math.max(0, currentX + carWidth * 0.45));
            gsap.set(trail, { width: trailWidth });

            const roadLeft = road.getBoundingClientRect().left;

            letters.forEach((letter) => {
              const letterRect = letter.getBoundingClientRect();
              const letterLeft = letterRect.left - roadLeft;

              if (trailWidth >= letterLeft || prog >= 0.75) {
                letter.style.opacity = '1';
                letter.style.transform = 'scale(1)';
                letter.style.filter = 'drop-shadow(0 2px 10px rgba(0,0,0,0.8))';
              } else {
                letter.style.opacity = '0';
                letter.style.transform = 'scale(0.85)';
                letter.style.filter = 'none';
              }
            });
          }
        }
      });

    }, sectionRef);

    return () => {
      ctx.revert();
      if (scrollStopTimer) clearTimeout(scrollStopTimer);
      if (revIntervalRef.current) clearInterval(revIntervalRef.current);
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-screen bg-[#0b0c10] bg-grid-pattern flex items-center justify-center overflow-hidden"
    >
      <div 
        className="absolute inset-0 pointer-events-none opacity-25 blur-3xl transition-colors duration-500"
        style={{ background: `radial-gradient(circle at 50% 50%, ${carColor || '#45db7d'} 0%, transparent 60%)` }}
      />

      <div 
        className={`absolute bottom-8 z-30 flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-white font-mono-tech text-xs tracking-widest uppercase shadow-2xl transition-all duration-300 pointer-events-none select-none ${
          scrollProgress > 8 ? 'opacity-0 translate-y-4' : 'opacity-100 animate-bounce'
        }`}
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: carColor || '#45db7d' }} />
        <span>SCROLL DOWN TO DRIVE 🏎️</span>
      </div>

      <div
        ref={roadRef}
        className="relative w-full h-[270px] sm:h-[330px] md:h-[380px] bg-carbon-pattern overflow-hidden flex items-center shadow-[inset_0_15px_30px_rgba(0,0,0,0.98),inset_0_-15px_30px_rgba(0,0,0,0.98),0_20px_50px_rgba(0,0,0,0.8)] border-y border-zinc-800"
      >
        <div className="absolute top-0 left-0 w-full h-[12px] z-30 bg-[repeating-linear-gradient(90deg,#e11d48,#e11d48_30px,#ffffff_30px,#ffffff_60px)] opacity-95 shadow-[0_4px_12px_rgba(225,29,72,0.4)]" />
        <div className="absolute bottom-0 left-0 w-full h-[12px] z-30 bg-[repeating-linear-gradient(90deg,#e11d48,#e11d48_30px,#ffffff_30px,#ffffff_60px)] opacity-95 shadow-[0_-4px_12px_rgba(225,29,72,0.4)]" />

        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[4px] z-2 pointer-events-none border-b-4 border-dashed border-white/30 opacity-80" />

        <div className="absolute top-4 left-4 sm:left-8 z-30 flex items-center gap-3 bg-black/90 text-white backdrop-blur-xl px-4 py-2 rounded-full border border-white/15 text-xs font-mono-tech shadow-2xl pointer-events-auto select-none">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${liveSpeed > 0 ? 'animate-pulse' : 'bg-zinc-600'}`} style={{ backgroundColor: liveSpeed > 0 ? (carColor || '#45db7d') : '#52525b' }} />
            <span className="text-zinc-400 uppercase font-bold">SPEED:</span>
            <span className="text-white font-extrabold text-sm font-mono tracking-wider">{liveSpeed} KM/H</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400 uppercase font-bold">RPM:</span>
            <span className="text-emerald-400 font-extrabold text-sm font-mono">{liveRpm}</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400 uppercase font-bold">GEAR:</span>
            <span className="text-[#6ac9ff] font-extrabold text-sm font-mono">{liveGear}</span>
          </div>
          <span className="text-zinc-700">|</span>
          <button
            onClick={toggleSound}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white px-3 py-1 rounded-full border border-zinc-700 transition-all active:scale-95 cursor-pointer text-xs font-bold"
          >
            <span>{soundEnabled ? '🔊 AUDIO: ON' : '🔇 AUDIO: OFF'}</span>
          </button>
          
          <button
            onPointerDown={startRevving}
            onPointerUp={stopRevving}
            onPointerLeave={stopRevving}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold font-mono-tech transition-all cursor-pointer select-none active:scale-95 shadow-lg ${
              isRevving 
                ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/50' 
                : 'bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-amber-500/40'
            }`}
          >
            <span>{isRevving ? '🔥 REVVING!' : '🏎️ HOLD TO REV'}</span>
          </button>
        </div>

        <div
          ref={trailRef}
          className="absolute top-0 left-0 h-full w-0 z-1 pointer-events-none transition-colors duration-300 shadow-[inset_0_0_50px_rgba(0,0,0,0.4),0_0_30px_rgba(0,0,0,0.5)]"
          style={{ background: carColor || '#45db7d' }}
        />

        <div
          ref={valueTextRef}
          className="absolute inset-0 z-10 flex items-center justify-center gap-8 sm:gap-14 md:gap-20 lg:gap-24 px-4 sm:px-8 md:px-12 text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-wider pointer-events-none select-none uppercase whitespace-nowrap flex-nowrap letter-glow"
        >
          {wordGroups.map((group, gIdx) => (
            <div key={gIdx} className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
              {group.letters.map((char, lIdx) => (
                <span
                  key={lIdx}
                  className="ref-letter inline-block opacity-0 text-[#0b0c10] transition-transform duration-200 font-extrabold"
                >
                  {char}
                </span>
              ))}
            </div>
          ))}
        </div>

        <div
          ref={carRef}
          className="absolute top-0 left-0 h-full w-auto z-20 pointer-events-none flex items-center justify-center transition-opacity duration-150"
        >
          <div className={`absolute left-[-90px] top-1/2 -translate-y-1/2 w-36 h-28 pointer-events-none transition-opacity duration-200 z-15 ${liveSpeed > 0 || isRevving ? 'opacity-95' : 'opacity-10'}`}>
            {isRevving ? (
              <div className="w-full h-8 bg-gradient-to-r from-rose-500 via-amber-400 to-transparent blur-sm rounded-full animate-ping opacity-90" />
            ) : (
              <>
                <div className="w-full h-[3px] bg-white/80 mb-2 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                <div className="w-3/4 h-[3px] bg-white/70 mb-2 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                <div className="w-4/5 h-[3px] bg-white/80 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </>
            )}
          </div>

          <div
            className="absolute right-[-120px] top-1/2 -translate-y-1/2 w-48 h-64 bg-gradient-to-r from-amber-100/50 via-white/30 to-transparent blur-md pointer-events-none z-15 opacity-90"
            style={{ clipPath: 'polygon(0 35%, 100% 0, 100% 100%, 0 65%)' }}
          />

          <img
            src="/assets/car_top.png"
            alt="McLaren 720S Top View"
            className="h-[85%] sm:h-[88%] w-auto object-contain select-none filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)]"
          />
        </div>
      </div>
    </section>
  );
}
