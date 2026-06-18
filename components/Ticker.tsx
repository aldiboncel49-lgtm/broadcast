'use client';
import { useEffect, useState } from 'react';

const items = [
  { tag: 'WORLD CUP', text: 'FIFA World Cup 2026 — Group stage continues today' },
  { tag: 'LIVE', text: 'Liga 1 Indonesia — Persija vs Persib kickoff 19:00 WIB' },
  { tag: 'NEW', text: 'TMDB top trending: Gladiator II dominates this week' },
  { tag: 'ANIME', text: 'One Piece Episode 1129 sub Indo available' },
  { tag: 'SPORT', text: 'UFC 309 — Main event Saturday 09:00 UTC' },
  { tag: 'STREAM', text: 'sportsrc.org schedules updated — 247 events today' },
  { tag: 'TECH', text: 'BROADCAST v0.1 — UI rebuild complete' },
  { tag: 'CHANNEL', text: 'RCTI, MNCTV, SCTV free public stream available' },
];

export default function Ticker() {
  const [now, setNow] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      setNow(`${hh}:${mm}:${ss} WIB`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="ticker-wrap mt-4">
      <div className="ticker font-mono text-sm py-2 px-2 flex items-center gap-8">
        {[...items, ...items].map((it, i) => (
          <span key={i} className="inline-flex items-center gap-2 whitespace-nowrap">
            <span className="text-phosphor-amber font-bold tracking-widest">[{it.tag}]</span>
            <span className="text-gray-200">{it.text}</span>
            <span className="text-phosphor-amberDim">●</span>
          </span>
        ))}
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-xs phosphor-green bg-black px-2">
        {now}
      </div>
    </div>
  );
}
