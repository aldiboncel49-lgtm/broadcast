import { fetchLiveSchedule, fetchLeagues } from '@/lib/sportsrc';
import { Calendar, MapPin, Tv as TvIcon, Play } from 'lucide-react';

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('id-ID', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default async function LivePage() {
  const [events, leagues] = await Promise.all([fetchLiveSchedule(), fetchLeagues()]);
  const live = events.filter(e => e.status === 'live');
  const upcoming = events.filter(e => e.status === 'upcoming');

  return (
    <div>
      <div className="mb-6">
        <div className="font-mono text-xs text-phosphor-amberDim tracking-widest mb-2">▮▮▮ CHANNEL 02 · OVER-AIR SPORTS</div>
        <h1 className="font-display text-5xl phosphor tracking-widest">LIVE NOW</h1>
        <p className="font-mono text-gray-400 mt-2 text-sm">Real-time schedule from sportsrc.org aggregator. Streams linked to free public sources where available.</p>
      </div>

      <section className="mb-10">
        <h2 className="section-title flex items-center gap-3 mb-4">
          <span className="live-dot" /> ON AIR ({live.length})
        </h2>
        {live.length === 0 ? (
          <div className="crt-card p-8 text-center font-mono text-gray-500">
            <div className="font-display text-2xl phosphor-amberDim mb-2">NO LIVE EVENTS</div>
            <div className="text-sm">All quiet on the airwaves. Check upcoming below.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {live.map((e) => (
              <article key={e.id} id={e.id} className="crt-card p-5">
                <div className="grid md:grid-cols-[1fr,auto] gap-4 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-[10px] tracking-widest text-phosphor-red flex items-center gap-2">
                        <span className="live-dot" /> LIVE · {e.minute ? `${e.minute}'` : ''}
                      </span>
                      <span className="font-mono text-[10px] text-phosphor-amber tracking-wider">▮ {e.league}</span>
                    </div>
                    <div className="font-display text-3xl md:text-4xl phosphor leading-none">
                      {e.home.name}
                      <span className="text-gray-500 text-2xl mx-3">vs</span>
                      {e.away.name}
                    </div>
                    <div className="font-display text-5xl phosphor mt-2">
                      {e.home.score ?? 0}
                      <span className="text-gray-600 mx-2">·</span>
                      {e.away.score ?? 0}
                    </div>
                    {e.venue && (
                      <div className="text-xs font-mono text-gray-500 mt-3 flex items-center gap-1">
                        <MapPin size={11} /> {e.venue}
                      </div>
                    )}
                    {e.channels && (
                      <div className="text-xs font-mono text-phosphor-green mt-1 flex items-center gap-1">
                        <TvIcon size={11} /> {e.channels.join(' · ')}
                      </div>
                    )}
                  </div>
                  {e.embed && (
                    <div>
                      <a
                        href={e.embed.replace('/embed/', '/watch?v=').split('?')[1] ? `https://www.youtube.com/watch?v=${e.embed.split('v=')[1]?.split('&')[0] || ''}` : e.embed}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-broadcast flex items-center gap-2"
                      >
                        <Play size={14} /> WATCH
                      </a>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mb-10">
        <h2 className="section-title flex items-center gap-3 mb-4">
          <Calendar size={20} className="text-phosphor-amber" /> UPCOMING ({upcoming.length})
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {upcoming.map((e) => (
            <article key={e.id} id={e.id} className="crt-card p-4 vhs-hover">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] tracking-widest text-phosphor-green">▮ {fmtTime(e.start)} WIB</span>
                <span className="font-mono text-[10px] text-phosphor-amber">{e.league}</span>
              </div>
              <div className="font-display text-xl phosphor">
                {e.home.name} <span className="text-gray-500 text-base">vs</span> {e.away.name}
              </div>
              <div className="text-xs font-mono text-gray-500 mt-2 flex items-center gap-3 flex-wrap">
                {e.venue && <span className="flex items-center gap-1"><MapPin size={10} /> {e.venue}</span>}
                {e.channels && <span className="flex items-center gap-1"><TvIcon size={10} /> {e.channels.join(' · ')}</span>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="section-title mb-4">BROWSE BY LEAGUE</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {leagues.map((l) => (
            <div key={l.slug} className="crt-card p-3 text-center">
              <div className="text-2xl mb-1">{l.icon}</div>
              <div className="font-display text-sm phosphor truncate">{l.name}</div>
              <div className="text-[10px] font-mono text-gray-500">{l.count} events</div>
            </div>
          ))}
        </div>
      </section>

      <div className="crt-card p-4 font-mono text-xs text-gray-400">
        <div className="phosphor-amber mb-1">▮▮▮ STREAM SOURCES</div>
        Schedule data aggregated from public sources. Click <span className="phosphor-amber">WATCH</span> to open the broadcaster's official YouTube channel or public free stream. No streams are hosted on this site.
      </div>
    </div>
  );
}
