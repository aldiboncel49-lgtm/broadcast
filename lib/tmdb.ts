// TMDB API client — uses static image URLs from image.tmdb.org
// Free public API, no auth needed for image CDN, but read access requires v3 key

const BASE = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p';

export const tmdbImage = (path: string | null | undefined, size: 'w185' | 'w342' | 'w500' | 'original' = 'w342') =>
  path ? `${IMG}/${size}${path}` : '';

export interface TmdbItem {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  media_type?: 'movie' | 'tv';
  original_language?: string;
  popularity?: number;
}

const GENRES: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
  53: 'Thriller', 10752: 'War', 37: 'Western',
  10759: 'Action & Adventure', 10762: 'Kids', 10763: 'News',
  10764: 'Reality', 10765: 'Sci-Fi & Fantasy', 10766: 'Soap',
  10767: 'Talk', 10768: 'War & Politics',
};

export const genreName = (id: number) => GENRES[id] || 'Other';

// Fallback data — works without API key, uses realistic catalog
// Real TMDB key makes it dynamic, but we want a working demo

export const FALLBACK_MOVIES: TmdbItem[] = [
  { id: 1, title: 'Gladiator II', overview: 'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius is forced to enter the Colosseum.', poster_path: null, backdrop_path: null, vote_average: 7.2, vote_count: 1840, release_date: '2024-11-13', genre_ids: [28, 18, 12] },
  { id: 2, title: 'Dune: Part Two', overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.', poster_path: null, backdrop_path: null, vote_average: 8.5, vote_count: 4250, release_date: '2024-03-01', genre_ids: [878, 12] },
  { id: 3, title: 'Oppenheimer', overview: 'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb.', poster_path: null, backdrop_path: null, vote_average: 8.3, vote_count: 6800, release_date: '2023-07-19', genre_ids: [18, 36] },
  { id: 4, title: 'The Substance', overview: 'A fading celebrity decides to use a black market drug, a cell-replicating substance that temporarily creates a younger, better version of herself.', poster_path: null, backdrop_path: null, vote_average: 7.4, vote_count: 2100, release_date: '2024-09-18', genre_ids: [27, 878] },
  { id: 5, title: 'Anora', overview: 'A young sex worker from Brooklyn meets and impulsively marries the son of a Russian oligarch.', poster_path: null, backdrop_path: null, vote_average: 7.9, vote_count: 1420, release_date: '2024-10-18', genre_ids: [35, 18] },
  { id: 6, title: 'Wicked', overview: 'In the land of Oz, ostracized and misunderstood green-skinned Elphaba is forced to share a room with the popular aristocrat Glinda.', poster_path: null, backdrop_path: null, vote_average: 8.1, vote_count: 1900, release_date: '2024-11-22', genre_ids: [14, 18, 10402] },
  { id: 7, title: 'Conclave', overview: 'After the unexpected death of the Pope, Cardinal Lawrence is tasked with running one of the world\'s most secretive and ancient events.', poster_path: null, backdrop_path: null, vote_average: 7.6, vote_count: 1320, release_date: '2024-10-25', genre_ids: [18, 53, 9648] },
  { id: 8, title: 'The Wild Robot', overview: 'A shipwrecked robot bonds with the animals of a forested island and adopts an orphaned gosling.', poster_path: null, backdrop_path: null, vote_average: 8.2, vote_count: 1640, release_date: '2024-09-12', genre_ids: [16, 10751, 12] },
  { id: 9, title: 'Joker: Folie à Deux', overview: 'Struggling with his dual identity, failed comedian Arthur Fleck meets the love of his life, Harley Quinn.', poster_path: null, backdrop_path: null, vote_average: 5.2, vote_count: 3200, release_date: '2024-10-04', genre_ids: [18, 80, 53] },
  { id: 10, title: 'It Ends with Us', overview: 'A woman\'s seemingly perfect life begins to unravel when a chance encounter with a former boyfriend triggers a chain of events.', poster_path: null, backdrop_path: null, vote_average: 6.8, vote_count: 2810, release_date: '2024-08-09', genre_ids: [18, 10749] },
  { id: 11, title: 'Inside Out 2', overview: 'Riley and her emotions return as she enters her teenage years and faces a new emotion: Anxiety.', poster_path: null, backdrop_path: null, vote_average: 7.7, vote_count: 4200, release_date: '2024-06-14', genre_ids: [16, 10751, 35] },
  { id: 12, title: 'Deadpool & Wolverine', overview: 'Wolverine is recovering from his injuries when he crosses paths with the loudmouth Deadpool.', poster_path: null, backdrop_path: null, vote_average: 7.7, vote_count: 5100, release_date: '2024-07-24', genre_ids: [28, 35, 878] },
];

export const FALLBACK_TV: TmdbItem[] = [
  { id: 101, name: 'Shōgun', overview: 'In Japan in the year 1600, at the dawn of a century-defining civil war, Lord Yoshii Toranaga is fighting for his life as his enemies on the Council of Regents unite against him.', poster_path: null, backdrop_path: null, vote_average: 8.6, vote_count: 3200, first_air_date: '2024-02-27', genre_ids: [18, 10759] },
  { id: 102, name: 'Fallout', overview: 'In a future, post-apocalyptic Los Angeles brought about by nuclear decimation, citizens must live in underground bunkers to protect themselves.', poster_path: null, backdrop_path: null, vote_average: 8.4, vote_count: 4100, first_air_date: '2024-04-10', genre_ids: [878, 10759] },
  { id: 103, name: 'The Bear', overview: 'A young chef from the fine dining world returns to Chicago to run his deceased brother\'s sandwich shop.', poster_path: null, backdrop_path: null, vote_average: 8.6, vote_count: 2800, first_air_date: '2022-06-23', genre_ids: [35, 18] },
  { id: 104, name: 'House of the Dragon', overview: 'The reign of House Targaryen begins with the heir apparent determining the future of the Seven Kingdoms.', poster_path: null, backdrop_path: null, vote_average: 8.4, vote_count: 5400, first_air_date: '2022-08-21', genre_ids: [10759, 18, 10765] },
  { id: 105, name: 'Severance', overview: 'Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.', poster_path: null, backdrop_path: null, vote_average: 8.7, vote_count: 3800, first_air_date: '2022-02-17', genre_ids: [878, 18, 10765] },
  { id: 106, name: 'The Last of Us', overview: 'Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie out of an oppressive quarantine zone.', poster_path: null, backdrop_path: null, vote_average: 8.6, vote_count: 6200, first_air_date: '2023-01-15', genre_ids: [18, 10759] },
  { id: 107, name: 'True Detective: Night Country', overview: 'When the long winter night falls in Ennis, Alaska, the eight men who operate the Tsalal Arctic Research Station vanish without a trace.', poster_path: null, backdrop_path: null, vote_average: 7.4, vote_count: 2200, first_air_date: '2024-01-14', genre_ids: [80, 18, 9648] },
  { id: 108, name: 'The Penguin', overview: 'Following the events of The Batman (2022), Oswald Cobb tries to gain control of Gotham\'s criminal underworld.', poster_path: null, backdrop_path: null, vote_average: 8.7, vote_count: 1900, first_air_date: '2024-09-19', genre_ids: [80, 18] },
];

export const FALLBACK_ANIME: TmdbItem[] = [
  { id: 201, name: 'One Piece', original_name: 'ONE PIECE', overview: 'Monkey D. Luffy refuses to let anyone or anything stand in the way of his quest to become the king of all pirates.', poster_path: null, backdrop_path: null, vote_average: 9.0, vote_count: 8500, first_air_date: '1999-10-20', genre_ids: [16, 10759, 35] },
  { id: 202, name: 'Attack on Titan', original_name: '進撃の巨人', overview: 'When a great destruction known as the Titans threatens humanity, a young man vows to eradicate them all.', poster_path: null, backdrop_path: null, vote_average: 9.0, vote_count: 9200, first_air_date: '2013-04-07', genre_ids: [16, 10759, 18] },
  { id: 203, name: 'Demon Slayer', original_name: '鬼滅の刃', overview: 'It is the Taisho Period in Japan. Tanjiro, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon.', poster_path: null, backdrop_path: null, vote_average: 8.7, vote_count: 6800, first_air_date: '2019-04-06', genre_ids: [16, 10759, 18] },
  { id: 204, name: 'Jujutsu Kaisen', original_name: '呪術廻戦', overview: 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself.', poster_path: null, backdrop_path: null, vote_average: 8.6, vote_count: 5400, first_air_date: '2020-10-03', genre_ids: [16, 10759, 9648] },
  { id: 205, name: 'Solo Leveling', original_name: '俺だけレベルアップな件', overview: 'In a world of awakened humans and monsters, a weak hunter Sung Jinwoo discovers a hidden dungeon that changes his fate.', poster_path: null, backdrop_path: null, vote_average: 8.4, vote_count: 4100, first_air_date: '2024-01-06', genre_ids: [16, 10759, 14] },
  { id: 206, name: 'Frieren: Beyond Journey\'s End', original_name: '葬送のフリーレン', overview: 'After a hero\'s victory, the elf mage Frieren begins a journey to understand human mortality.', poster_path: null, backdrop_path: null, vote_average: 9.0, vote_count: 4900, first_air_date: '2023-09-29', genre_ids: [16, 12, 14] },
  { id: 207, name: 'Spy x Family', original_name: 'SPY×FAMILY', overview: 'A spy, an assassin, and a telepath form a fake family - each hiding dangerous secrets from the others.', poster_path: null, backdrop_path: null, vote_average: 8.5, vote_count: 3700, first_air_date: '2022-04-09', genre_ids: [16, 35, 10759] },
  { id: 208, name: 'Chainsaw Man', original_name: 'チェンソーマン', overview: 'Following a betrayal, a young man Denji makes a deal with his pet devil Pochita to become Chainsaw Man.', poster_path: null, backdrop_path: null, vote_average: 8.5, vote_count: 4500, first_air_date: '2022-10-11', genre_ids: [16, 10759, 14] },
];

// Try to fetch real TMDB data, fallback to local catalog
export async function fetchTmdbList(kind: 'movie' | 'tv' | 'anime', list: 'popular' | 'trending' | 'top_rated' = 'popular'): Promise<TmdbItem[]> {
  const key = process.env.NEXT_PUBLIC_TMDB_KEY || process.env.TMDB_KEY;
  if (!key) {
    if (kind === 'anime') return FALLBACK_ANIME;
    if (kind === 'tv') return FALLBACK_TV;
    return FALLBACK_MOVIES;
  }
  try {
    let url: string;
    if (list === 'trending') {
      url = `${BASE}/trending/${kind === 'anime' ? 'tv' : kind}/${list === 'trending' ? 'week' : 'week'}`;
    } else {
      url = `${BASE}/${kind}/${list}?api_key=${key}&language=en-US&page=1`;
    }
    if (kind === 'anime') {
      // Filter to Japanese animation
      url = `${BASE}/discover/tv?api_key=${key}&language=en-US&with_genres=16&with_origin_country=JP&sort_by=popularity.desc&page=1`;
    }
    // Static export: no revalidate, just regular fetch
    const res = await fetch(url);
    if (!res.ok) throw new Error('TMDB fetch failed');
    const data = await res.json();
    return data.results || [];
  } catch {
    if (kind === 'anime') return FALLBACK_ANIME;
    if (kind === 'tv') return FALLBACK_TV;
    return FALLBACK_MOVIES;
  }
}
