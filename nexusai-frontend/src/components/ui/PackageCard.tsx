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
      className={className}
      style={{
        background: 'var(--bg-card)',
        border: pkg.isPopular ? '2px solid rgba(34,211,238,0.5)' : '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        padding: '28px',
        transition: 'all 0.25s var(--ease)',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 20px 40px -12px rgba(34,211,238,0.15)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = pkg.isPopular ? 'rgba(34,211,238,0.5)' : 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {pkg.isPopular && (
        <div style={{
          position: 'absolute', top: 16, right: 16,
          background: 'var(--grad-primary)', color: '#04060c',
          fontSize: 10, fontWeight: 700, padding: '4px 12px',
          borderRadius: 999, letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>
          Most Popular
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
          Unity
        </p>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.2 }}>{pkg.name}</h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 28, fontWeight: 700, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>₹{pkg.price.toLocaleString()}</span>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>/one-time</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.6 }}>{pkg.description}</p>
      </div>

      {/* Tests */}
      <div style={{ flex: 1, marginBottom: 24 }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pkg.tests.map((test, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 5 }} />
              {test}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <Link href="/appointment" style={{ textDecoration: 'none', display: 'block' }}>
        <button
          style={{
            width: '100%', padding: '12px', fontSize: 14, fontWeight: 600,
            background: 'var(--grad-primary)',
            color: '#04060c',
            border: 'none',
            borderRadius: 999, cursor: 'pointer', transition: 'all 0.2s var(--ease)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'none'; }}
        >
          Get Started
        </button>
      </Link>
    </div>
  );
}
