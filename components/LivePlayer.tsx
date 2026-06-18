'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Hls from 'hls.js';
import { fetchM3U, filterChannels, flag, getCategories, guessCategory, M3UChannel, M3U_SOURCES, DEFAULT_COUNTRY, countryName } from '@/lib/m3u';
import { Search, Play, Loader2, AlertCircle, Tv, Globe, ChevronDown } from 'lucide-react';

export default function LivePlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [country, setCountry] = useState<string>(DEFAULT_COUNTRY);
  const [channels, setChannels] = useState<M3UChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('ALL');
  const [active, setActive] = useState<M3UChannel | null>(null);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [showCountries, setShowCountries] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setActive(null);
    setCategory('ALL');
    const src = M3U_SOURCES[country];
    if (!src) { setError('Unknown country'); setLoading(false); return; }
    fetchM3U(src.url)
      .then((ch) => { if (!cancelled) { setChannels(ch); setLoading(false); } })
      .catch((e) => { if (!cancelled) { setError(String(e.message || e)); setLoading(false); } });
    return () => { cancelled = true; };
  }, [country]);

  useEffect(() => {
    if (!active || !videoRef.current) return;
    setPlayerError(null);
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }

    const video = videoRef.current;
    const isHls = /\.m3u8(\?|$)/i.test(active.url);
    const isMpd = /\.mpd(\?|$)/i.test(active.url);
    if (isMpd) {
      setPlayerError('MPEG-DASH stream (.mpd) not supported in browser. Try another channel.');
      return;
    }
    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        xhrSetup: (xhr) => {
          if (active.referrer) {
            xhr.setRequestHeader('Referer', active.referrer);
            xhr.setRequestHeader('Origin', new URL(active.referrer).origin);
          }
        },
      });
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

  const categories = useMemo(() => ['ALL', ...getCategories(channels)], [channels]);
  const filtered = useMemo(
    () => filterChannels(channels, { category: category === 'ALL' ? undefined : category, search }),
    [channels, category, search]
  );

  return (
    <div>
      <div className="mb-4">
        <div className="font-mono text-xs text-phosphor-amberDim tracking-widest mb-2">▮▮▮ CHANNEL 02 · OVER-AIR PLAYER</div>
        <h1 className="font-display text-5xl phosphor tracking-widest">LIVE TV</h1>
        <p className="font-mono text-gray-400 mt-2 text-sm">Player HLS — sumber M3U dari iptv-org. Klik channel untuk mulai streaming.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr,420px] gap-6">
        <div>
          <div className="crt-card p-2 bg-black">
            <div className="aspect-video relative bg-black">
              <video
                ref={videoRef}
                controls
                playsInline
                crossOrigin="anonymous"
                className="w-full h-full"
                poster={active?.logo || ''}
              />
              {!active && !loading && (
                <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
                  <div>
                    <Tv size={48} className="text-phosphor-amberDim mx-auto mb-3" />
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
                  <span className="phosphor-amber font-bold">{flag(active.country)} {active.name}</span>
                  <span className="text-gray-500 ml-2">▮ {active.group || guessCategory(active.name)}</span>
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
            <div className="font-mono text-xs text-phosphor-amberDim mb-2">▮ COUNTRY ({Object.keys(M3U_SOURCES).length})</div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(M3U_SOURCES).map(([cc, src]) => (
                <button
                  key={cc}
                  onClick={() => setCountry(cc)}
                  className={`px-2 py-1 font-mono text-xs border transition-all ${
                    country === cc
                      ? 'border-phosphor-amber text-phosphor-amber bg-phosphor-amber/10'
                      : 'border-crt-chrome text-gray-400 hover:border-phosphor-amberDim hover:text-phosphor-amber'
                  }`}
                  title={countryName(cc)}
                >
                  {src.flag} {cc}
                </button>
              ))}
            </div>
            {categories.length > 1 && (
              <div className="mt-3">
                <div className="font-mono text-xs text-phosphor-amberDim mb-2">▮ CATEGORY</div>
                <div className="flex flex-wrap gap-1">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`px-2 py-1 font-mono text-xs border transition-all ${
                        category === c
                          ? 'border-phosphor-green text-phosphor-green bg-phosphor-green/10'
                          : 'border-crt-chrome text-gray-400 hover:border-phosphor-greenDim hover:text-phosphor-green'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="crt-card p-3 mb-3">
            <div className="font-mono text-xs text-phosphor-amberDim mb-2">
              {flag(country)} {countryName(country)} · {filtered.length} channels
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-phosphor-amberDim" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search channel..."
                className="w-full bg-black border border-crt-chrome pl-8 pr-3 py-2 text-sm font-mono text-gray-200 focus:border-phosphor-amber focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="crt-card p-3 mb-3 border-phosphor-red">
              <div className="font-mono text-xs phosphor-red flex items-start gap-2">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold mb-1">M3U FETCH FAILED</div>
                  <div className="text-gray-400">{error}</div>
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
                  <div className="w-10 h-10 bg-black flex-shrink-0 flex items-center justify-center overflow-hidden text-xl">
                    {flag(c.country) || <Tv size={16} className="text-phosphor-amberDim" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-mono text-sm truncate ${isActive ? 'phosphor' : 'text-gray-200'}`}>
                      {c.name}
                    </div>
                    <div className="text-[10px] font-mono text-gray-500 truncate">
                      {c.group || guessCategory(c.name)} · {c.country || '??'}
                    </div>
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
        Playlist M3U: <a className="phosphor-amber underline" href="https://github.com/iptv-org/iptv" target="_blank" rel="noopener noreferrer">iptv-org/iptv</a> (open source, 124K+ channel publik). Stream di-host oleh broadcaster/CDN masing-masing. Kualitas & kestabilan di luar kontrol kami — beberapa channel mungkin offline, geo-blocked, atau butuh referrer header.
      </div>
    </div>
  );
}
