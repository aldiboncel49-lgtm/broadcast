'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Hls from 'hls.js';
import { fetchM3U, filterChannels, flag, M3UChannel, M3U_SOURCES } from '@/lib/m3u';
import { Search, Play, Loader2, AlertCircle, Tv, Radio, Film, Newspaper, Trophy, Baby, Sparkles, ChevronDown } from 'lucide-react';

const CATEGORIES = [
  { key: 'indonesia', label: 'INDONESIA', icon: flag('ID') },
  { key: 'sports', label: 'SPORTS', icon: '⚽' },
  { key: 'news', label: 'NEWS', icon: '📰' },
  { key: 'entertainment', label: 'ENTERTAINMENT', icon: '🎬' },
  { key: 'movies', label: 'MOVIES', icon: '🎞️' },
  { key: 'anime', label: 'ANIME', icon: '✨' },
  { key: 'kids', label: 'KIDS', icon: '🧸' },
] as const;

export default function LivePlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [category, setCategory] = useState<keyof typeof M3U_SOURCES>('indonesia');
  const [channels, setChannels] = useState<M3UChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<M3UChannel | null>(null);
  const [playerError, setPlayerError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setActive(null);
    fetchM3U(M3U_SOURCES[category])
      .then((ch) => { if (!cancelled) { setChannels(ch); setLoading(false); } })
      .catch((e) => { if (!cancelled) { setError(String(e)); setLoading(false); } });
    return () => { cancelled = true; };
  }, [category]);

  useEffect(() => {
    if (!active || !videoRef.current) return;
    setPlayerError(null);
    // destroy previous hls
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }

    const video = videoRef.current;
    const isHls = /\.m3u8(\?|$)/i.test(active.url);
    if (isHls && Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hlsRef.current = hls;
      hls.loadSource(active.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => { /* user gesture required */ });
      });
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) {
          setPlayerError(`Stream error: ${data.details || data.type}. Stream mungkin offline atau diblokir geo.`);
        }
      });
    } else if (isHls && video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS (Safari)
      video.src = active.url;
      video.play().catch(() => {});
    } else {
      // Try direct .ts / .mp4
      video.src = active.url;
      video.play().catch(() => {
        setPlayerError('Stream tidak support di browser ini. Coba channel lain.');
      });
    }
    return () => { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } };
  }, [active]);

  const filtered = useMemo(() => filterChannels(channels, { search }), [channels, search]);

  return (
    <div>
      <div className="mb-4">
        <div className="font-mono text-xs text-phosphor-amberDim tracking-widest mb-2">▮▮▮ CHANNEL 02 · OVER-AIR PLAYER</div>
        <h1 className="font-display text-5xl phosphor tracking-widest">LIVE TV</h1>
        <p className="font-mono text-gray-400 mt-2 text-sm">Player HLS.bro — sumber M3U dari iptv-org. Klik channel untuk mulai streaming.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr,400px] gap-6">
        <div>
          <div className="crt-card p-2 bg-black">
            <div className="aspect-video relative bg-black">
              <video
                ref={videoRef}
                controls
                playsInline
                className="w-full h-full"
                poster={active?.logo || ''}
              />
              {!active && !loading && (
                <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
                  <div>
                    <Radio size={48} className="text-phosphor-amberDim mx-auto mb-3" />
                    <div className="font-display text-2xl phosphor">SELECT A CHANNEL</div>
                    <div className="text-xs font-mono text-gray-500 mt-1">Pilih channel dari daftar di kanan</div>
                  </div>
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 size={32} className="text-phosphor-amber animate-spin" />
                </div>
              )}
            </div>
            {active && (
              <div className="px-3 py-2 border-t border-crt-chrome flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="phosphor-amber font-bold">{active.name}</span>
                  <span className="text-gray-500 ml-2">▮ {active.group}</span>
                </div>
                {playerError && (
                  <span className="phosphor-red flex items-center gap-1">
                    <AlertCircle size={12} /> {playerError}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 crt-card p-4">
            <div className="font-mono text-xs text-phosphor-amberDim mb-2">▮ CATEGORY</div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className={`px-3 py-2 font-mono text-xs border transition-all ${
                    category === c.key
                      ? 'border-phosphor-amber text-phosphor-amber bg-phosphor-amber/10'
                      : 'border-crt-chrome text-gray-400 hover:border-phosphor-amberDim hover:text-phosphor-amber'
                  }`}
                >
                  <span className="mr-1">{c.icon}</span> {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="crt-card p-3 mb-3">
            <div className="relative">
              <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-phosphor-amberDim" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search channel..."
                className="w-full bg-black border border-crt-chrome pl-8 pr-3 py-2 text-sm font-mono text-gray-200 focus:border-phosphor-amber focus:outline-none"
              />
            </div>
            <div className="text-[10px] font-mono text-gray-500 mt-2">
              {loading ? 'LOADING...' : `${filtered.length} channels in ${category.toUpperCase()}`}
            </div>
          </div>

          {error && (
            <div className="crt-card p-3 mb-3 border-phosphor-red">
              <div className="font-mono text-xs phosphor-red flex items-start gap-2">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold mb-1">M3U FETCH FAILED</div>
                  <div className="text-gray-400">{error}</div>
                  <div className="text-gray-500 mt-1">Cek koneksi atau coba kategori lain.</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map((c, i) => {
              const isActive = active?.url === c.url;
              return (
                <button
                  key={`${c.url}-${i}`}
                  onClick={() => setActive(c)}
                  className={`w-full text-left p-2 border transition-all flex items-center gap-2 ${
                    isActive
                      ? 'border-phosphor-amber bg-phosphor-amber/10'
                      : 'border-crt-chrome hover:border-phosphor-amberDim hover:bg-crt-screen'
                  }`}
                >
                  <div className="w-10 h-10 bg-black flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {c.logo ? (
                      <img src={c.logo} alt="" className="w-full h-full object-contain" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <Tv size={16} className="text-phosphor-amberDim" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-mono text-sm truncate ${isActive ? 'phosphor' : 'text-gray-200'}`}>
                      {c.name}
                    </div>
                    <div className="text-[10px] font-mono text-gray-500 truncate">{c.group}</div>
                  </div>
                  {isActive && <Play size={14} className="text-phosphor-amber flex-shrink-0" fill="currentColor" />}
                </button>
              );
            })}
            {!loading && filtered.length === 0 && (
              <div className="crt-card p-4 text-center font-mono text-gray-500 text-sm">
                NO CHANNELS FOUND
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 crt-card p-4 font-mono text-xs text-gray-400">
        <div className="phosphor-amber mb-1">▮▮▮ SUMBER DATA</div>
        Playlist M3U: <a className="phosphor-amber underline" href="https://github.com/iptv-org/iptv" target="_blank" rel="noopener noreferrer">iptv-org/iptv</a> (open source, 124K+ channel publik dari seluruh dunia). Stream di-host oleh broadcaster asli, BROADCAST cuma jadi player.
        Stream mungkin tidak stabil — itu di luar kontrol kami.
      </div>
    </div>
  );
}
