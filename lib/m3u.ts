// M3U parser for iptv-org playlists
// Updated for current iptv-org format (no group-title, no tvg-logo)
// Country code derived from tvg-id suffix (.id@SD, .us@HD, etc.)

export interface M3UChannel {
  name: string;
  url: string;
  logo: string;
  group: string;
  tvgId: string;
  tvgName: string;
  country: string;
  language: string;
  referrer: string;
}

const COUNTRY_FLAGS: Record<string, string> = {
  ID: '🇮🇩', US: '🇺🇸', GB: '🇬🇧', UK: '🇬🇧', IN: '🇮🇳', JP: '🇯🇵', KR: '🇰🇷', CN: '🇨🇳',
  DE: '🇩🇪', FR: '🇫🇷', ES: '🇪🇸', IT: '🇮🇹', BR: '🇧🇷', AR: '🇦🇷', MX: '🇲🇽',
  AU: '🇦🇺', CA: '🇨🇦', NL: '🇳🇱', PT: '🇵🇹', TR: '🇹🇷', SA: '🇸🇦', EG: '🇪🇬',
  MY: '🇲🇾', SG: '🇸🇬', TH: '🇹🇭', PH: '🇵🇭', VN: '🇻🇳', HK: '🇭🇰', TW: '🇹🇼',
  RU: '🇷🇺', UA: '🇺🇦', PL: '🇵🇱', SE: '🇸🇪', NO: '🇳🇴', DK: '🇩🇰', FI: '🇫🇮',
};

export const flag = (code: string) => COUNTRY_FLAGS[code?.toUpperCase()] || '🏳️';

const COUNTRY_NAMES: Record<string, string> = {
  ID: 'Indonesia', US: 'United States', GB: 'United Kingdom', UK: 'United Kingdom',
  IN: 'India', JP: 'Japan', KR: 'South Korea', CN: 'China', DE: 'Germany', FR: 'France',
  ES: 'Spain', IT: 'Italy', BR: 'Brazil', AR: 'Argentina', MX: 'Mexico', AU: 'Australia',
  CA: 'Canada', NL: 'Netherlands', PT: 'Portugal', TR: 'Turkey', SA: 'Saudi Arabia',
  EG: 'Egypt', MY: 'Malaysia', SG: 'Singapore', TH: 'Thailand', PH: 'Philippines',
  VN: 'Vietnam', HK: 'Hong Kong', TW: 'Taiwan', RU: 'Russia', UA: 'Ukraine',
  PL: 'Poland', SE: 'Sweden', NO: 'Norway', DK: 'Denmark', FI: 'Finland',
};

export const countryName = (code: string) => COUNTRY_NAMES[code?.toUpperCase()] || code;

// Derive category from channel name patterns (iptv-org new format has no group-title)
export function guessCategory(name: string): string {
  const n = name.toLowerCase();
  if (/\bsport|espn|fox sport|bein|skysport|nbcsn|tennis|cricket|f1|motogp|ufc|boxing|fc\b|fc\.|fc-|persib|persija|arema|psm/.test(n)) return 'Sports';
  if (/\bnews|cnn|bbc|al jazeera|reuters|antara tv|kompas tv|metro tv|tv one|tran7|trans7|news|firstpost|ndtv|cna\b/.test(n)) return 'News';
  if (/\bkids|cartoon|disney|nickelodeon|boomerang|cbeebies|animasi/.test(n)) return 'Kids';
  if (/\bmovie|cinema|film|thriller|action|drama|series|box office|hollywood/.test(n)) return 'Movies';
  if (/\bmusic|mtv|vh1|radio|fm\b/.test(n)) return 'Music';
  if (/\breligi|al-quran|quran|tvri|nas|\bislam|muslim|kristen|katolik|hindu|buddha/.test(n)) return 'Religious';
  if (/\beducation|edukasi|belajar|sekolah|dikti|university|academy/.test(n)) return 'Education';
  return 'Entertainment';
}

// Detect country from tvg-id suffix like "RCTI.id@SD" or from URL domain
function detectCountry(tvgId: string, url: string): string {
  // Try tvg-id first: e.g. "RCTI.id@SD" -> ID
  const m = tvgId?.match(/\.([a-z]{2,3})@/i);
  if (m) return m[1].toUpperCase();
  // Try tvg-id with "."
  const m2 = tvgId?.match(/\.([a-z]{2,3})/i);
  if (m2) return m2[1].toUpperCase();
  // Try URL country TLD or hostname
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    // Match TLD like .id, .tv.id, .co.id
    const tld = host.match(/\.([a-z]{2,3})$/);
    if (tld) return tld[1].toUpperCase();
  } catch {}
  return '';
}

export function parseM3U(text: string): M3UChannel[] {
  const lines = text.split(/\r?\n/);
  const channels: M3UChannel[] = [];
  let current: Partial<M3UChannel> | null = null;
  let pendingReferrer = '';

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('#EXTM3U')) continue;

    if (t.startsWith('#EXTINF')) {
      // #EXTINF:-1 tvg-id="RCTI.id@SD",RCTI (720p)
      const tvgId = t.match(/tvg-id="([^"]*)"/)?.[1] || '';
      const tvgName = t.match(/tvg-name="([^"]*)"/)?.[1] || '';
      const logo = t.match(/tvg-logo="([^"]*)"/)?.[1] || '';
      const group = t.match(/group-title="([^"]*)"/)?.[1] || '';
      const name = t.split(',').slice(1).join(',').trim() || tvgName;
      current = {
        name,
        tvgId,
        tvgName,
        logo,
        group,
        url: '',
        country: detectCountry(tvgId, ''),
        language: '',
        referrer: '',
      };
      pendingReferrer = '';
    } else if (t.startsWith('#EXTVLCOPT')) {
      const ref = t.match(/http-referrer=(.+)/i)?.[1] || '';
      if (ref) pendingReferrer = ref.trim();
    } else if (!t.startsWith('#') && current) {
      const url = t;
      const country = current.country || detectCountry(current.tvgId || '', url);
      channels.push({
        name: current.name || 'Unknown',
        url,
        logo: current.logo || '',
        group: current.group || guessCategory(current.name || ''),
        tvgId: current.tvgId || '',
        tvgName: current.tvgName || '',
        country,
        language: '',
        referrer: pendingReferrer,
      });
      current = null;
      pendingReferrer = '';
    }
  }
  return channels;
}

export async function fetchM3U(url: string): Promise<M3UChannel[]> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`M3U fetch failed: ${res.status} (${url})`);
  const text = await res.text();
  return parseM3U(text);
}

// Updated URLs - iptv-org moved M3U files to /streams/<cc>.m3u on raw.githubusercontent
const BASE = 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams';
export const M3U_SOURCES: Record<string, { url: string; label: string; flag: string }> = {
  ID: { url: `${BASE}/id.m3u`, label: 'INDONESIA', flag: '🇮🇩' },
  US: { url: `${BASE}/us.m3u`, label: 'USA', flag: '🇺🇸' },
  GB: { url: `${BASE}/gb.m3u`, label: 'UK', flag: '🇬🇧' },
  JP: { url: `${BASE}/jp.m3u`, label: 'JAPAN', flag: '🇯🇵' },
  KR: { url: `${BASE}/kr.m3u`, label: 'KOREA', flag: '🇰🇷' },
  IN: { url: `${BASE}/in.m3u`, label: 'INDIA', flag: '🇮🇳' },
  CN: { url: `${BASE}/cn.m3u`, label: 'CHINA', flag: '🇨🇳' },
  BR: { url: `${BASE}/br.m3u`, label: 'BRAZIL', flag: '🇧🇷' },
  DE: { url: `${BASE}/de.m3u`, label: 'GERMANY', flag: '🇩🇪' },
  FR: { url: `${BASE}/fr.m3u`, label: 'FRANCE', flag: '🇫🇷' },
  ES: { url: `${BASE}/es.m3u`, label: 'SPAIN', flag: '🇪🇸' },
  AR: { url: `${BASE}/ar.m3u`, label: 'ARGENTINA', flag: '🇦🇷' },
  AU: { url: `${BASE}/au.m3u`, label: 'AUSTRALIA', flag: '🇦🇺' },
  CA: { url: `${BASE}/ca.m3u`, label: 'CANADA', flag: '🇨🇦' },
  TR: { url: `${BASE}/tr.m3u`, label: 'TURKEY', flag: '🇹🇷' },
  SA: { url: `${BASE}/sa.m3u`, label: 'SAUDI', flag: '🇸🇦' },
  EG: { url: `${BASE}/eg.m3u`, label: 'EGYPT', flag: '🇪🇬' },
  MY: { url: `${BASE}/my.m3u`, label: 'MALAYSIA', flag: '🇲🇾' },
  PH: { url: `${BASE}/ph.m3u`, label: 'PHILIPPINES', flag: '🇵🇭' },
};

export const DEFAULT_COUNTRY = 'ID';

export function filterChannels(
  channels: M3UChannel[],
  opts: { category?: string; country?: string; search?: string; limit?: number } = {}
): M3UChannel[] {
  let result = channels;
  if (opts.category) {
    const re = new RegExp(`^${opts.category}$`, 'i');
    result = result.filter((c) => re.test(c.group || guessCategory(c.name)));
  }
  if (opts.country) {
    result = result.filter((c) => c.country === opts.country);
  }
  if (opts.search) {
    const s = opts.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.tvgName.toLowerCase().includes(s) ||
        c.group.toLowerCase().includes(s)
    );
  }
  if (opts.limit) result = result.slice(0, opts.limit);
  return result;
}

// Get unique categories from a channel list
export function getCategories(channels: M3UChannel[]): string[] {
  const cats = new Set<string>();
  for (const c of channels) {
    cats.add(c.group || guessCategory(c.name));
  }
  return Array.from(cats).sort();
}
