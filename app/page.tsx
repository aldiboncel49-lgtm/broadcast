import Hero from '@/components/Hero';
import ChannelCard, { ChannelItem } from '@/components/ChannelCard';
import { fetchTmdbList, genreName } from '@/lib/tmdb';
import { fetchLeagues } from '@/lib/sportsrc';
import Link from 'next/link';
import { ArrowRight, Trophy, Tv as TvIcon, Radio } from 'lucide-react';

function pad(n: number, width = 2) { return String(n).padStart(width, '0'); }

export default async function Home() {
  const [movies, tv, anime, leagues] = await Promise.all([
    fetchTmdbList('movie', 'popular'),
    fetchTmdbList('tv', 'popular'),
    fetchTmdbList('anime'),
    fetchLeagues(),
  ]);

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

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title flex items-center gap-3">
            <Radio size={20} className="text-phosphor-red" />
            CH 02 — LIVE TV
          </h2>
          <Link href="/live" className="font-mono text-xs phosphor-amber hover:text-phosphor-amberGlow flex items-center gap-1">
            OPEN PLAYER <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {leagues.slice(0, 3).map((l) => (
            <Link key={l.slug} href={`/live`} className="crt-card p-4 vhs-hover flex items-center gap-3">
              <div className="text-3xl">{l.icon}</div>
              <div>
                <div className="font-display text-lg phosphor">{l.name}</div>
                <div className="text-xs font-mono text-gray-500">CH 02 · OVER-AIR</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-3 crt-card p-3 font-mono text-xs text-gray-400 flex items-start gap-2">
          <span className="phosphor-amber">▮</span>
          <span>124K+ channel publik dari <span className="phosphor-amber">iptv-org</span> — RCTI, MNCTV, SCTV, TVRI, Al Jazeera, BBC, sports, news, movies. Player HLS built-in, klik channel untuk nonton.</span>
        </div>
      </section>

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
