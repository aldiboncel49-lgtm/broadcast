// Live sports schedule — sportsrc.org (free, no key required)
// Embeds YouTube official streams where available

export interface LiveEvent {
  id: string;
  league: string;
  leagueSlug: string;
  home: { name: string; logo?: string; score?: number };
  away: { name: string; logo?: string; score?: number };
  start: string; // ISO datetime
  status: 'live' | 'upcoming' | 'finished';
  minute?: number;
  venue?: string;
  embed?: string; // YouTube embed URL or stream URL
  thumbnail?: string;
  channels?: string[]; // broadcast channels
}

// sportsrc.org provides JSON API for major sports
// We curate from their public endpoints

const SPORTSRC = 'https://sportsrc.org';

export async function fetchLiveSchedule(): Promise<LiveEvent[]> {
  // Sample schedule with realistic data
  // Real implementation would call sportsrc.org API
  const now = new Date();
  const today = new Date(now);
  const inHours = (h: number) => new Date(now.getTime() + h * 3600 * 1000).toISOString();
  return [
    {
      id: 'wc-1', league: 'FIFA World Cup 2026', leagueSlug: 'world-cup',
      home: { name: 'Argentina', score: 1 },
      away: { name: 'France', score: 1 },
      start: now.toISOString(), status: 'live', minute: 67,
      venue: 'MetLife Stadium, NJ', embed: 'https://www.youtube.com/embed/live_stream?channel=UCofRQ-9n3iRfodsxkZ6E1xw',
      channels: ['FIFATV (YouTube)'],
    },
    {
      id: 'l1-1', league: 'Liga 1 Indonesia', leagueSlug: 'liga-1',
      home: { name: 'Persija Jakarta', score: 0 },
      away: { name: 'Persib Bandung', score: 0 },
      start: inHours(2), status: 'upcoming',
      venue: 'Stadion Patriot Candrabhaga',
      channels: ['Indosiar', 'Vidio'],
    },
    {
      id: 'epl-1', league: 'Premier League', leagueSlug: 'epl',
      home: { name: 'Liverpool', score: undefined },
      away: { name: 'Arsenal', score: undefined },
      start: inHours(5), status: 'upcoming',
      venue: 'Anfield',
      channels: ['NBC', 'Peacock'],
    },
    {
      id: 'laliga-1', league: 'La Liga', leagueSlug: 'laliga',
      home: { name: 'Real Madrid', score: undefined },
      away: { name: 'Barcelona', score: undefined },
      start: inHours(8), status: 'upcoming',
      venue: 'Santiago Bernabéu',
      channels: ['ESPN+', 'Movistar+'],
    },
    {
      id: 'nba-1', league: 'NBA', leagueSlug: 'nba',
      home: { name: 'Lakers', score: 88 },
      away: { name: 'Celtics', score: 92 },
      start: now.toISOString(), status: 'live', minute: 38,
      venue: 'Crypto.com Arena',
      channels: ['ESPN', 'TNT'],
    },
    {
      id: 'ufc-1', league: 'UFC 309', leagueSlug: 'ufc',
      home: { name: 'Jon Jones', score: undefined },
      away: { name: 'Stipe Miocic', score: undefined },
      start: inHours(24), status: 'upcoming',
      venue: 'Madison Square Garden',
      channels: ['ESPN+ PPV'],
    },
    {
      id: 'bwf-1', league: 'BWF World Tour', leagueSlug: 'bwf',
      home: { name: 'Anthony Sinisuka Ginting', score: 1 },
      away: { name: 'Kunlavut Vitidsarn', score: 2 },
      start: now.toISOString(), status: 'live', minute: 2,
      venue: 'Istora Senayan, Jakarta',
      channels: ['TVRI', 'BWF TV'],
    },
    {
      id: 'timnas-1', league: 'Timnas Indonesia', leagueSlug: 'timnas',
      home: { name: 'Indonesia', score: undefined },
      away: { name: 'Japan', score: undefined },
      start: inHours(48), status: 'upcoming',
      venue: 'Gelora Bung Karno',
      channels: ['RCTI', 'Vision+'],
    },
  ];
}

export async function fetchLeagues(): Promise<{ slug: string; name: string; icon: string; count: number }[]> {
  return [
    { slug: 'world-cup', name: 'FIFA World Cup', icon: '⚽', count: 64 },
    { slug: 'liga-1', name: 'Liga 1 Indonesia', icon: '⚽', count: 34 },
    { slug: 'epl', name: 'Premier League', icon: '⚽', count: 38 },
    { slug: 'laliga', name: 'La Liga', icon: '⚽', count: 38 },
    { slug: 'serie-a', name: 'Serie A', icon: '⚽', count: 38 },
    { slug: 'bundesliga', name: 'Bundesliga', icon: '⚽', count: 34 },
    { slug: 'ligue-1', name: 'Ligue 1', icon: '⚽', count: 38 },
    { slug: 'nba', name: 'NBA', icon: '🏀', count: 82 },
    { slug: 'nfl', name: 'NFL', icon: '🏈', count: 18 },
    { slug: 'mlb', name: 'MLB', icon: '⚾', count: 30 },
    { slug: 'nhl', name: 'NHL', icon: '🏒', count: 32 },
    { slug: 'ufc', name: 'UFC / MMA', icon: '🥊', count: 12 },
    { slug: 'bwf', name: 'BWF Badminton', icon: '🏸', count: 24 },
    { slug: 'motogp', name: 'MotoGP', icon: '🏍️', count: 20 },
    { slug: 'f1', name: 'Formula 1', icon: '🏎️', count: 24 },
    { slug: 'timnas', name: 'Timnas Indonesia', icon: '🇮🇩', count: 8 },
  ];
}
