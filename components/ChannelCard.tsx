'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Play, Star, Calendar } from 'lucide-react';

export interface ChannelItem {
  id: number | string;
  title: string;
  subtitle?: string;
  image?: string;
  rating?: number;
  year?: number | string;
  ch: string;
  href: string;
  badge?: 'LIVE' | 'NEW' | 'HD' | '4K';
  category?: string;
}

export default function ChannelCard({ item, index }: { item: ChannelItem; index: number }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={item.href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="crt-card group block relative"
    >
      <div className="aspect-poster ch-img bg-crt-screen relative overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-crt-chrome to-black">
            <div className="text-phosphor-amberDim font-display text-6xl opacity-30">CH{item.ch}</div>
          </div>
        )}
        {item.badge && (
          <div
            className={`absolute top-2 left-2 px-2 py-1 text-[10px] font-mono font-bold tracking-widest border ${
              item.badge === 'LIVE'
                ? 'border-phosphor-red text-phosphor-red bg-black/80 animate-pulse'
                : item.badge === 'NEW'
                ? 'border-phosphor-green text-phosphor-green bg-black/80'
                : 'border-phosphor-amber text-phosphor-amber bg-black/80'
            }`}
          >
            ● {item.badge}
          </div>
        )}
        {hover && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center channel-flip">
            <div className="knob scale-50" />
          </div>
        )}
        <div className="absolute bottom-2 right-2 ch-num text-base">{item.ch}</div>
      </div>
      <div className="p-3">
        <div className="font-display text-lg phosphor leading-tight truncate">{item.title}</div>
        {item.subtitle && (
          <div className="text-xs text-gray-400 truncate font-mono mt-1">{item.subtitle}</div>
        )}
        <div className="flex items-center gap-3 mt-2 text-[11px] font-mono">
          {item.rating !== undefined && (
            <span className="flex items-center gap-1 text-phosphor-amber">
              <Star size={11} fill="currentColor" /> {item.rating.toFixed(1)}
            </span>
          )}
          {item.year && (
            <span className="flex items-center gap-1 text-gray-500">
              <Calendar size={11} /> {item.year}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
