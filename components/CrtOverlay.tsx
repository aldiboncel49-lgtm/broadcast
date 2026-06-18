'use client';
export default function CrtOverlay() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[9998]"
        style={{
          background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.18) 50%)',
          backgroundSize: '100% 3px',
          animation: 'scan 8s linear infinite',
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </>
  );
}
