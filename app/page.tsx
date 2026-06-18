import Hero from '@/components/Hero';
import ChannelCard, { ChannelItem } from '@/components/ChannelCard';
import { fetchTmdbList, genreName } from '@/lib/tmdb';
import { fetchLiveSchedule, fetchLeagues } from '@/lib/sportsrc';
import Link from 'next/link';
import { ArrowRight, Trophy, Tv as TvIcon } from 'lucide-react';

function pad(n: number, width = 2) { return String(n).padStart(width, '0'); }

export default async function Home() {
  const [movies, tv, anime, live, leagues] = await Promise.all([
    fetchTmdbList('movie', 'popular'),
    fetchTmdbList('tv', 'popular'),
    fetchTmdbList('anime'),
    fetchLiveSchedule(),
    fetchLeagues(),
  ]);

  const liveNow = live.filter(e => e.status === 'live');
  const upcoming = live.filter(e => e.status === 'upcoming').slice(0, 3);

  const movieItems: ChannelItem[] = movies.slice(0, 8).map((m, i) => ({
    id: m.id,
    title: m.title || m.name || 'Untitled',
    subtitle: genreName(m.genre_ids[0] || 0),
    image: m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : undefined,
    rating: m.vote_average,
    year: (m.release_date || m.first_air_date || '').slice(0, 4),
    ch: pad(i + 1),
    href: `/movies/${m.id}`,
    badge: i < 2 ? 'NEW' : undefined,
  }));

  const tvItems: ChannelItem[] = tv.slice(0, 8).map((m, i) => ({
    id: m.id,
    title: m.name || m.title || 'Untitled',
    subtitle: genreName(m.genre_ids[0] || 0),
    image: m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : undefined,
    rating: m.vote_average,
    year: (m.release_date || m.first_air_date || '').slice(0, 4),
    ch: pad(i + 10),
    href: `/tv/${m.id}`,
    badge: i < 2 ? 'HD' : undefined,
  }));

  const animeItems: ChannelItem[] = anime.slice(0, 8).map((m, i) => ({
    id: m.id,
    title: m.name || m.title || 'Untitled',
    subtitle: genreName(m.genre_ids[0] || 0),
    image: m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : undefined,
    rating: m.vote_average,
    year: (m.release_date || m.first_air_date || '').slice(0, 4),
    ch: pad(i + 20),
    href: `/anime/${m.id}`,
    badge: i < 2 ? '4K' : undefined,
  }));

  return (
    <div>
      <Hero />

      {liveNow.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-3">
              <span className="live-dot" />
              ON AIR NOW
            </h2>
            <Link href="/live" className="font-mono text-xs phosphor-amber hover:text-phosphor-amberGlow flex items-center gap-1">
              ALL LIVE <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveNow.map((e) => (
              <Link key={e.id} href={`/live#${e.id}`} className="crt-card p-4 vhs-hover">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] tracking-widest text-phosphor-red flex items-center gap-2">
                    <span className="live-dot" /> LIVE · {e.minute ? `${e.minute}'` : ''}
                  </span>
                  <span className="font-mono text-[10px] text-gray-500">{e.league}</span>
                </div>
                <div className="font-display text-2xl phosphor leading-tight">
                  {e.home.name}
                  <span className="phosphor-amber mx-2">
                    {e.home.score ?? 0} – {e.away.score ?? 0}
                  </span>
                  {e.away.name}
                </div>
                {e.venue && <div className="text-xs font-mono text-gray-500 mt-2">▮ {e.venue}</div>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-3">
              <Trophy size={20} className="text-phosphor-amber" />
              UP NEXT
            </h2>
            <Link href="/live" className="font-mono text-xs phosphor-amber hover:text-phosphor-amberGlow flex items-center gap-1">
              FULL SCHEDULE <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {upcoming.map((e) => {
              const d = new Date(e.start);
              return (
                <Link key={e.id} href={`/live#${e.id}`} className="crt-card p-3 vhs-hover">
                  <div className="font-mono text-[10px] text-phosphor-green mb-1">▮ {d.toLocaleString('id-ID', { weekday: 'short', hour: '2-digit', minute: '2-digit' })} WIB</div>
                  <div className="font-display text-lg phosphor">{e.home.name} <span className="text-gray-500">vs</span> {e.away.name}</div>
                  <div className="text-xs font-mono text-gray-500 mt-1">{e.league} · {e.venue}</div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">CH 03 — MOVIES</h2>
          <Link href="/movies" className="font-mono text-xs phosphor-amber hover:text-phosphor-amberGlow flex items-center gap-1">
            ALL CHANNELS <ArrowRight size={12} />
          </Link>
        </div>
        <div className="channel-grid">
          {movieItems.map((it, i) => <ChannelCard key={it.id} item={it} index={i} />)}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title flex items-center gap-3">
            <TvIcon size={20} className="text-phosphor-amber" />
            CH 04 — TV SERIES
          </h2>
          <Link href="/tv" className="font-mono text-xs phosphor-amber hover:text-phosphor-amberGlow flex items-center gap-1">
            ALL CHANNELS <ArrowRight size={12} />
          </Link>
        </div>
        <div className="channel-grid">
          {tvItems.map((it, i) => <ChannelCard key={it.id} item={it} index={i} />)}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">CH 05 — ANIME</h2>
          <Link href="/anime" className="font-mono text-xs phosphor-amber hover:text-phosphor-amberGlow flex items-center gap-1">
            ALL CHANNELS <ArrowRight size={12} />
          </Link>
        </div>
        <div className="channel-grid">
          {animeItems.map((it, i) => <ChannelCard key={it.id} item={it} index={i} />)}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="section-title mb-4">CH 06 — LEAGUES</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {leagues.map((l) => (
            <Link key={l.slug} href={`/live?league=${l.slug}`} className="crt-card p-3 text-center vhs-hover">
              <div className="text-2xl mb-1">{l.icon}</div>
              <div className="font-display text-sm phosphor truncate">{l.name}</div>
              <div className="text-[10px] font-mono text-gray-500">{l.count} events</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
