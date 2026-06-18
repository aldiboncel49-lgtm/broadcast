import Link from 'next/link';
import { ArrowLeft, Star, Calendar, Film, Globe, ExternalLink } from 'lucide-react';
import { fetchTmdbList, tmdbImage, FALLBACK_MOVIES } from '@/lib/tmdb';
import { notFound } from 'next/navigation';

interface PageProps { params: { id: string } }

export function generateStaticParams() {
  return FALLBACK_MOVIES.map((m) => ({ id: String(m.id) }));
}

async function findItem(id: string, kind: 'movie' | 'tv' | 'anime') {
  // Search across all kinds for the ID
  const all = await Promise.all([
    fetchTmdbList('movie'),
    fetchTmdbList('tv'),
    fetchTmdbList('anime'),
  ]);
  const flat = [...all[0], ...all[1], ...all[2]];
  return flat.find((m) => String(m.id) === id);
}

export default async function DetailPage({ params }: PageProps) {
  const item = await findItem(params.id, 'movie');
  if (!item) notFound();

  const title = item.title || item.name || 'Untitled';
  const date = item.release_date || item.first_air_date || '';
  const year = date.slice(0, 4);
  const lang = item.original_language?.toUpperCase() || 'EN';
  const ytSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} ${year || ''} full movie sub indo`)}`;

  return (
    <div>
      <Link href="/movies" className="font-mono text-xs phosphor-amber hover:text-phosphor-amberGlow flex items-center gap-1 mb-6">
        <ArrowLeft size={12} /> BACK TO CH 03
      </Link>

      <article className="grid md:grid-cols-[300px,1fr] gap-8">
        <div>
          {item.poster_path ? (
            <img
              src={tmdbImage(item.poster_path, 'w500')}
              alt={title}
              className="w-full border-2 border-phosphor-amber"
            />
          ) : (
            <div className="w-full aspect-poster bg-crt-screen border-2 border-phosphor-amber flex items-center justify-center">
              <Film size={64} className="text-phosphor-amberDim" />
            </div>
          )}
        </div>
        <div>
          <div className="font-mono text-xs text-phosphor-amberDim tracking-widest mb-2">▮ NOW SHOWING</div>
          <h1 className="font-display text-5xl phosphor leading-tight tracking-wider mb-3">{title}</h1>
          {item.original_title && item.original_title !== title && (
            <div className="text-sm text-gray-500 font-mono mb-4">aka. {item.original_title}</div>
          )}
          <div className="flex flex-wrap gap-3 my-4 font-mono text-xs">
            {item.vote_average > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 border border-phosphor-amber text-phosphor-amber">
                <Star size={12} fill="currentColor" /> {item.vote_average.toFixed(1)} ({item.vote_count.toLocaleString()})
              </span>
            )}
            {year && (
              <span className="flex items-center gap-1 px-2 py-1 border border-crt-chrome text-gray-300">
                <Calendar size={12} /> {year}
              </span>
            )}
            <span className="flex items-center gap-1 px-2 py-1 border border-crt-chrome text-gray-300">
              <Globe size={12} /> {lang}
            </span>
          </div>
          {item.overview && (
            <div className="my-6">
              <div className="font-mono text-xs text-phosphor-amberDim mb-1">▮ SYNOPSIS</div>
              <p className="text-gray-200 leading-relaxed">{item.overview}</p>
            </div>
          )}
          <div className="mt-6 space-y-2">
            <a
              href={ytSearch}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-broadcast flex items-center gap-2 w-fit"
            >
              <ExternalLink size={14} /> SEARCH YOUTUBE (SUB INDO)
            </a>
            <div className="text-xs font-mono text-gray-500">
              No streams hosted on this site. Click to find legal free sources on YouTube.
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
