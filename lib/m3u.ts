// M3U parser for iptv-org playlists
// Format reference: https://github.com/iptv-org/iptv

export interface M3UChannel {
  name: string;
  url: string;
  logo: string;
  group: string;
  tvgId: string;
  tvgName: string;
  country: string;
  language: string;
}

const COUNTRY_FLAGS: Record<string, string> = {
  ID: '🇮🇩', US: '🇺🇸', GB: '🇬🇧', IN: '🇮🇳', JP: '🇯🇵', KR: '🇰🇷', CN: '🇨🇳',
  DE: '🇩🇪', FR: '🇫🇷', ES: '🇪🇸', IT: '🇮🇹', BR: '🇧🇷', AR: '🇦🇷', MX: '🇲🇽',
  AU: '🇦🇺', CA: '🇨🇦', NL: '🇳🇱', PT: '🇵🇹', TR: '🇹🇷', SA: '🇸🇦', EG: '🇪🇬',
  MY: '🇲🇾', SG: '🇸🇬', TH: '🇹🇭', PH: '🇵🇭', VN: '🇻🇳', HK: '🇭🇰', TW: '🇹🇼',
};

export const flag = (code: string) => COUNTRY_FLAGS[code] || code || '🏳️';

export function parseM3U(text: string): M3UChannel[] {
  const lines = text.split(/\r?\n/);
  const channels: M3UChannel[] = [];
  let current: Partial<M3UChannel> | null = null;
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('#EXTM3U')) continue;
    if (t.startsWith('#EXTINF')) {
      // #EXTINF:-1 tvg-id="ID1" tvg-name="RCTI" tvg-logo="..." group-title="Indonesia",RCTI
      const tvgId = t.match(/tvg-id="([^"]*)"/)?.[1] || '';
      const tvgName = t.match(/tvg-name="([^"]*)"/)?.[1] || '';
      const logo = t.match(/tvg-logo="([^"]*)"/)?.[1] || '';
      const group = t.match(/group-title="([^"]*)"/)?.[1] || '';
      const name = t.split(',').slice(1).join(',').trim() || tvgName;
      current = { name, tvgId, tvgName, logo, group, url: '', country: '', language: '' };
    } else if (!t.startsWith('#') && current) {
      current.url = t;
      // Derive country from group e.g. "Indonesia;General" -> ID
      if (/indonesia/i.test(current.group || '')) current.country = 'ID';
      else if (/united states|usa/i.test(current.group || '')) current.country = 'US';
      else if (/united kingdom|uk/i.test(current.group || '')) current.country = 'GB';
      else if (/sports/i.test(current.group || '')) current.country = current.country || '';
      channels.push(current as M3UChannel);
      current = null;
    }
  }
  return channels;
}

export async function fetchM3U(url: string): Promise<M3UChannel[]> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`M3U fetch failed: ${res.status}`);
  const text = await res.text();
  return parseM3U(text);
}

// Curated M3U URLs from iptv-org
export const M3U_SOURCES = {
  indonesia: 'https://iptv-org.github.io/iptv/index/category/indo.m3u',
  sports: 'https://iptv-org.github.io/iptv/index/category/sports.m3u',
  movies: 'https://iptv-org.github.io/iptv/index/category/movies.m3u',
  entertainment: 'https://iptv-org.github.io/iptv/index/category/entertainment.m3u',
  news: 'https://iptv-org.github.io/iptv/index/category/news.m3u',
  anime: 'https://iptv-org.github.io/iptv/index/category/anime.m3u',
  kids: 'https://iptv-org.github.io/iptv/index/category/kids.m3u',
};

export function filterChannels(
  channels: M3UChannel[],
  opts: { group?: string; country?: string; search?: string; limit?: number } = {}
): M3UChannel[] {
  let result = channels;
  if (opts.group) {
    const re = new RegExp(opts.group, 'i');
    result = result.filter((c) => re.test(c.group));
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
