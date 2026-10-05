import React from 'react';
import { Gauge, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#090a0d] border-t border-zinc-800/80 py-12 px-4 sm:px-8 relative z-20 text-left text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-[#45db7d] flex items-center justify-center font-bold shadow-lg">
            <Gauge className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-mono-tech tracking-widest text-lg font-black text-white block leading-none">
              ITZ FIZZ<span className="text-[#45db7d]">.</span>
            </span>
            <span className="text-[10px] tracking-widest text-zinc-400 font-mono-tech uppercase">
              Scroll-Driven Hero Supercar Series
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono-tech text-xs text-zinc-400">
          <button
            onClick={scrollToTop}
            className="hover:text-white flex items-center gap-2 transition-all uppercase cursor-pointer font-bold bg-zinc-900 hover:bg-zinc-800 px-4 py-2 rounded-full border border-zinc-800 shadow-xl"
          >
            <span>BACK TO TOP</span>
            <ArrowUpRight className="w-4 h-4 text-[#45db7d]" />
          </button>
        </div>

        <div className="text-zinc-500 font-mono-tech text-xs flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} ITZ FIZZ. DESIGNED FOR SPEED.</span>
        </div>
      </div>
    </footer>
  );
}
