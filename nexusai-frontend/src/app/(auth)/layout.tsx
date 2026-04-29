import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: '#05070d',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Radial cyan glow blob — top center */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60vw',
        height: '60vw',
        maxWidth: 700,
        maxHeight: 700,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,211,238,0.09) 0%, rgba(167,139,250,0.06) 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Violet glow blob — bottom right */}
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '40vw',
        height: '40vw',
        maxWidth: 500,
        maxHeight: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Cyan glow blob — bottom left */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '-5%',
        width: '30vw',
        height: '30vw',
        maxWidth: 400,
        maxHeight: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <header className="p-6" style={{ position: 'relative', zIndex: 1 }}>
        <Link href="/" className="flex items-center gap-3 w-fit" style={{ textDecoration: 'none' }}>
          <div style={{
            width: 40, height: 40,
            borderRadius: 12,
            background: 'var(--grad-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 20px rgba(34,211,238,0.3)',
          }}>
            <svg className="w-5 h-5" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <p style={{ fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-heading)', margin: 0, lineHeight: 1.2 }}>Unity</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>Hospital</p>
          </div>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6" style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </main>
    </div>
  );
}
