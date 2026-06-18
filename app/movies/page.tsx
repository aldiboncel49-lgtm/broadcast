import { fetchTmdbList, genreName } from '@/lib/tmdb';
import ChannelCard, { ChannelItem } from '@/components/ChannelCard';
import { Film } from 'lucide-react';

function pad(n: number, w = 2) { return String(n).padStart(w, '0'); }

export default async function MoviesPage() {
  const movies = await fetchTmdbList('movie', 'popular');
  const items: ChannelItem[] = movies.map((m, i) => ({
    id: m.id,
    title: m.title || m.name || 'Untitled',
    subtitle: genreName(m.genre_ids[0] || 0),
    image: m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : undefined,
    rating: m.vote_average,
    year: (m.release_date || '').slice(0, 4),
    ch: pad(i + 1),
    href: `/movies/${m.id}`,
    badge: i < 3 ? 'NEW' : undefined,
  }));

  return (
    <div>
      <div className="mb-6">
        <div className="font-mono text-xs text-phosphor-amberDim tracking-widest mb-2">▮▮▮ CHANNEL 03 · FILM 24/7</div>
        <h1 className="font-display text-5xl phosphor tracking-widest flex items-center gap-3">
          <Film size={40} /> MOVIES
        </h1>
        <p className="font-mono text-gray-400 mt-2 text-sm">Curated catalog from TMDB. Click a channel card to open the movie on its official source.</p>
      </div>
      <div className="channel-grid">
        {items.map((it, i) => <ChannelCard key={it.id} item={it} index={i} />)}
      </div>
    </div>
  );
}
