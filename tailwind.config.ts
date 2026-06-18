import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        phosphor: {
          amber: '#ffb000',
          amberDim: '#cc8a00',
          amberGlow: '#ffd966',
          green: '#00ff41',
          greenDim: '#00b82e',
          red: '#ff3838',
        },
        crt: {
          bg: '#0a0a0a',
          screen: '#0f1419',
          scan: '#1a1a1a',
          chrome: '#2a2a2a',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['"VT323"', '"Press Start 2P"', 'monospace'],
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '41.99%': { opacity: '1' },
          '42%': { opacity: '0.85' },
          '43%': { opacity: '1' },
          '47.99%': { opacity: '1' },
          '48%': { opacity: '0.6' },
          '49%': { opacity: '1' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        glow: {
          '0%, 100%': { textShadow: '0 0 4px currentColor, 0 0 11px currentColor' },
          '50%': { textShadow: '0 0 4px transparent, 0 0 8px currentColor' },
        },
        static: {
          '0%, 100%': { backgroundPosition: '0 0' },
          '10%': { backgroundPosition: '-5% -10%' },
          '20%': { backgroundPosition: '-15% 5%' },
          '30%': { backgroundPosition: '7% -25%' },
          '40%': { backgroundPosition: '-5% 25%' },
          '50%': { backgroundPosition: '-15% 10%' },
          '60%': { backgroundPosition: '15% 0%' },
          '70%': { backgroundPosition: '0% 15%' },
          '80%': { backgroundPosition: '3% 35%' },
          '90%': { backgroundPosition: '-10% 10%' },
        },
        channelTurn: {
          '0%': { transform: 'scale(1) rotateY(0deg)', opacity: '1' },
          '40%': { transform: 'scale(0.95) rotateY(20deg)', opacity: '0.6' },
          '60%': { transform: 'scale(0.95) rotateY(-20deg)', opacity: '0.6' },
          '100%': { transform: 'scale(1) rotateY(0deg)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        flicker: 'flicker 3.2s infinite',
        scan: 'scan 8s linear infinite',
        ticker: 'ticker 60s linear infinite',
        glow: 'glow 2.5s ease-in-out infinite',
        static: 'static 0.5s steps(10) infinite',
        channelTurn: 'channelTurn 0.4s ease-in-out',
        marquee: 'marquee 30s linear infinite',
      },
      backgroundImage: {
        'crt-noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E\")",
        'crt-scanlines': "linear-gradient(transparent 50%, rgba(0,0,0,0.25) 50%)",
      },
      backgroundSize: {
        'scan': '100% 4px',
      },
    },
  },
  plugins: [],
};

export default config;
