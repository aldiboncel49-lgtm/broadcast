'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Radio, Tv, Film, MonitorPlay, Sparkles, Signal } from 'lucide-react';

const links = [
  { href: '/', label: 'HOME', ch: '01', icon: Radio },
  { href: '/live', label: 'LIVE', ch: '02', icon: Signal },
  { href: '/movies', label: 'MOVIES', ch: '03', icon: Film },
  { href: '/tv', label: 'TV SERIES', ch: '04', icon: Tv },
  { href: '/anime', label: 'ANIME', ch: '05', icon: Sparkles },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b-2 border-phosphor-amber">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="knob scale-50 origin-center" />
          <div>
            <div className="font-display text-3xl phosphor leading-none tracking-widest">BROADCAST</div>
            <div className="text-[10px] text-phosphor-amberDim font-mono tracking-[0.3em]">CH 01 ▮ OVER-AIR</div>
          </div>
        </Link>
        <div className="hidden md:flex gap-1">
          {links.slice(1).map(({ href, label, ch, icon: Icon }) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-2 font-mono text-xs uppercase tracking-wider border transition-all ${
                  active
                    ? 'border-phosphor-amber text-phosphor-amber bg-phosphor-amber/10'
                    : 'border-crt-chrome text-gray-400 hover:border-phosphor-amberDim hover:text-phosphor-amber'
                }`}
              >
                <span className="text-[10px] opacity-60">CH{ch}</span>
                <Icon size={14} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
        <div className="hidden md:flex items-center gap-2 font-mono text-xs">
          <span className="live-dot" />
          <span className="phosphor-red tracking-widest">ON AIR</span>
        </div>
      </div>
      <div className="md:hidden flex overflow-x-auto border-t border-crt-chrome">
        {links.slice(1).map(({ href, label, ch }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-shrink-0 px-3 py-2 text-xs font-mono ${
                active ? 'text-phosphor-amber' : 'text-gray-400'
              }`}
            >
              {ch} {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
