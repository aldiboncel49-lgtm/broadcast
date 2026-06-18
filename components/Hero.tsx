'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Volume2, Power, Search, ChevronRight } from 'lucide-react';

const channels = [
  { ch: '01', label: 'HOME', href: '/', desc: 'OVERVIEW' },
  { ch: '02', label: 'LIVE', href: '/live', desc: 'SPORTS NOW' },
  { ch: '03', label: 'MOVIES', href: '/movies', desc: 'FILM 24/7' },
  { ch: '04', label: 'TV', href: '/tv', desc: 'SERIES' },
  { ch: '05', label: 'ANIME', href: '/anime', desc: 'JP ANIMATION' },
];

export default function Hero() {
  const [dial, setDial] = useState(0);
  const [time, setTime] = useState('');

  useEffect(() => {
    const id = setInterval(() => setDial((d) => (d + 1) % channels.length), 3500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const t = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString('id-ID', { hour12: false }));
    };
    t();
    const id = setInterval(t, 1000);
    return () => clearInterval(id);
  }, []);

  const cur = channels[dial];

  return (
    <section className="relative border-2 border-phosphor-amber bg-gradient-to-br from-crt-screen to-black p-6 md:p-10 mb-10 overflow-hidden">
      <div className="absolute top-2 right-2 flex items-center gap-2 font-mono text-xs">
        <span className="phosphor-green">{time}</span>
        <span className="text-phosphor-amber">▮</span>
        <span className="phosphor-red">REC</span>
      </div>

      <div className="absolute -top-10 -right-10 w-40 h-40 bg-phosphor-amber/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-phosphor-green/10 rounded-full blur-3xl" />

      <div className="grid md:grid-cols-[1fr,auto] gap-8 items-center">
        <div>
          <div className="font-mono text-xs text-phosphor-amberDim tracking-[0.4em] mb-3">
            ▮▮▮ SIGNAL LOCKED · CARRIER OK · 24/7 FREE
          </div>
          <h1 className="font-display text-5xl md:text-7xl phosphor leading-none tracking-wider mb-4">
            TUNE<br/>IN.
          </h1>
          <p className="font-mono text-gray-300 max-w-xl text-sm md:text-base leading-relaxed">
            Live sports, films, and anime from across the airwaves — all in one place.
            <span className="phosphor-amber"> No subscription. No downloads. Just turn the dial.</span>
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/live" className="btn-broadcast flex items-center gap-2">
              <Power size={16} /> TUNE TO LIVE
            </Link>
            <Link href="/movies" className="btn-broadcast btn-broadcast-green flex items-center gap-2">
              <Search size={16} /> BROWSE CHANNELS
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="knob" style={{ transform: `rotate(${dial * 72}deg)` }} />
          </div>
          <div className="font-mono text-center">
            <div className="ch-num">CH{cur.ch}</div>
            <div className="font-display text-2xl phosphor mt-2">{cur.label}</div>
            <div className="text-xs text-gray-400 mt-1 tracking-widest">{cur.desc}</div>
          </div>
          <Link href={cur.href} className="font-mono text-xs phosphor-amber hover:text-phosphor-amberGlow flex items-center gap-1">
            GO TO CH{cur.ch} <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-crt-chrome grid grid-cols-2 md:grid-cols-5 gap-2 font-mono text-xs">
        {channels.map((c, i) => (
          <div
            key={c.ch}
            className={`flex items-center gap-2 px-2 py-1 ${
              i === dial ? 'bg-phosphor-amber/20 text-phosphor-amber' : 'text-gray-500'
            }`}
          >
            <Volume2 size={11} />
            <span className="text-[10px]">CH{c.ch}</span>
            <span>{c.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
