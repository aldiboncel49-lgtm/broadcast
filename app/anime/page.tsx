import { fetchTmdbList, genreName } from '@/lib/tmdb';
import ChannelCard, { ChannelItem } from '@/components/ChannelCard';
import { Sparkles } from 'lucide-react';

function pad(n: number, w = 2) { return String(n).padStart(w, '0'); }

export default async function AnimePage() {
  const anime = await fetchTmdbList('anime');
  const items: ChannelItem[] = anime.map((m, i) => ({
    id: m.id,
    title: m.name || m.title || 'Untitled',
    subtitle: genreName(m.genre_ids[0] || 0),
    image: m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : undefined,
    rating: m.vote_average,
    year: (m.first_air_date || '').slice(0, 4),
    ch: pad(i + 20),
    href: `/anime/${m.id}`,
    badge: i < 3 ? '4K' : undefined,
  }));

  return (
    <div>
      <div className="mb-6">
        <div className="font-mono text-xs text-phosphor-amberDim tracking-widest mb-2">▮▮▮ CHANNEL 05 · JP ANIMATION</div>
        <h1 className="font-display text-5xl phosphor tracking-widest flex items-center gap-3">
          <Sparkles size={40} /> ANIME
        </h1>
        <p className="font-mono text-gray-400 mt-2 text-sm">Top Japanese animation. Indonesian subtitles available on linked sources.</p>
      </div>
      <div className="channel-grid">
        {items.map((it, i) => <ChannelCard key={it.id} item={it} index={i} />)}
      </div>
    </div>
  );
}
