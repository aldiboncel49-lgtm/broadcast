# BROADCAST

Free over-air TV, movies, and anime aggregator with a retro TV-themed UI.

**[▮ Live: https://broadcast-275.pages.dev](https://broadcast-275.pages.dev)**

## Design

BROADCAST is a directory site styled as a vintage CRT television set:

- **Phosphor amber** color scheme (`#ffb000`) on deep CRT black
- **Live scanline overlay** with phosphor glow
- **Channel dial** UI (channels 01-05)
- **Live ticker** with rotating news headlines
- **VHS distortion** effects on hover
- **No template slop** — built from scratch, no SaaS component library

## Pages

| Route | Description |
|---|---|
| `/` | Home with live sports ticker, on-air events, featured channels |
| `/live` | Live sports schedule (soccer, NBA, NFL, UFC, F1, badminton) |
| `/movies` | Movie browser — TMDB catalog, 12+ items |
| `/tv` | TV series browser — TMDB top-rated |
| `/anime` | Anime browser — Japanese animation from TMDB |
| `/movies/[id]` | Movie detail — links to YouTube search (sub Indo) |
| `/tv/[id]` | Series detail |
| `/anime/[id]` | Anime detail — links to Crunchyroll + YouTube |

## Tech Stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **Framer Motion** for animations
- **Lucide React** for icons
- **TMDB** for movie/series/anime metadata
- **sportsrc.org** schedule format for live events
- Static export → Cloudflare Pages (free, no bandwidth cap)

## Local Development

```bash
npm install
npm run dev          # Dev server at http://localhost:3000
npm run build        # Static export to ./out
npx serve@latest out # Serve the static export
```

## Deployment

Hosted on Cloudflare Pages. Auto-deploy from GitHub:

1. Cloudflare Dashboard → Workers & Pages → `broadcast`
2. Settings → Builds → Connect to Git
3. Select `aldiboncel49-lgtm/broadcast`
4. Build command: `npm run build`
5. Build output: `out`
6. Save → future `git push` auto-deploys

## Source

All metadata sourced from TMDB. Stream links go to public sources (YouTube, broadcaster official channels). No streams are hosted on this site.

## License

Open source. No commercial use of broadcast content.
