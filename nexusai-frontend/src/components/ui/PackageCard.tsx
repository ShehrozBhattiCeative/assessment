'use client';

import Link from 'next/link';

interface Package {
  id: string;
  name: string;
  tier: string;
  price: number;
  description: string;
  tests: string[];
  isPopular: boolean;
  color: string;
}

interface PackageCardProps {
  pkg: Package;
  className?: string;
}

export function PackageCard({ pkg, className = '' }: PackageCardProps) {
  return (
    <div
      className={`card-hover ${className}`}
      style={{
        background: 'var(--bg-card)',
        border: pkg.isPopular ? '2px solid var(--accent)' : '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {pkg.isPopular && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: 'var(--accent)', color: '#fff',
          fontSize: 10, fontWeight: 700, padding: '3px 10px',
          borderRadius: 20, letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>
          Most Popular
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--border)' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
          Unity
        </p>
        <h3 style={{ fontWeight: 700, fontSize: 20, color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.2 }}>{pkg.name}</h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)' }}>₹{pkg.price.toLocaleString()}</span>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>/one-time</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.6 }}>{pkg.description}</p>
      </div>

      {/* Tests */}
      <div style={{ padding: '20px 24px', flex: 1 }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pkg.tests.map((test, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
              <svg width="14" height="14" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M20 6L9 17l-5-5" />
              </svg>
              {test}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div style={{ padding: '0 24px 24px' }}>
        <Link href="/appointment" style={{ textDecoration: 'none', display: 'block' }}>
          <button style={{
            width: '100%', padding: '11px', fontSize: 14, fontWeight: 600,
            background: pkg.isPopular ? 'var(--accent)' : 'transparent',
            color: pkg.isPopular ? '#fff' : 'var(--accent)',
            border: `2px solid var(--accent)`,
            borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s',
          }}
            onMouseEnter={(e) => { const b = e.currentTarget; b.style.background = 'var(--accent)'; b.style.color = '#fff'; }}
            onMouseLeave={(e) => { const b = e.currentTarget; if (!pkg.isPopular) { b.style.background = 'transparent'; b.style.color = 'var(--accent)'; } }}
          >
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
