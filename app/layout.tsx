import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import Ticker from '@/components/Ticker';
import CrtOverlay from '@/components/CrtOverlay';

export const metadata: Metadata = {
  title: 'BROADCAST ▮ Free Live TV • Movies • Anime',
  description: 'Free live sports, movies with Indonesian subs, and anime. All in one place.',
  keywords: ['streaming', 'live tv', 'world cup', 'movies', 'anime', 'sub indo', 'free'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="crt-scanlines noise min-h-screen flex flex-col">
        <CrtOverlay />
        <Nav />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
        <Ticker />
        <footer className="border-t border-crt-chrome mt-8 py-4 text-center text-xs text-phosphor-amberDim">
          <span className="font-mono">▮ BROADCAST v0.1 ▮ SIGNAL LOCKED ▮ FREE OVER-AIR AGGREGATOR</span>
          <span className="block text-gray-600 mt-1">Not affiliated with any broadcaster. All sources linked, not hosted.</span>
        </footer>
      </body>
    </html>
  );
}
