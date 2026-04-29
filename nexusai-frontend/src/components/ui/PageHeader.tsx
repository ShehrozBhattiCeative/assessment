import Link from 'next/link';

interface PageHeaderProps {
  breadcrumb?: string;
  heading: string;
  subtitle?: string;
}

export function PageHeader({ breadcrumb, heading, subtitle }: PageHeaderProps) {
  return (
    <section style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      padding: '72px 0 64px',
      transition: 'background-color 0.3s ease, border-color 0.3s ease',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {breadcrumb && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13 }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>
              Home
            </Link>
            <span style={{ color: 'var(--border)' }}>/</span>
            <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{breadcrumb}</span>
          </div>
        )}
        <h1 style={{
          fontSize: 'clamp(36px, 5vw, 52px)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.15,
          marginBottom: subtitle ? 16 : 0,
          transition: 'color 0.3s ease',
        }}>
          {heading}
        </h1>
        {subtitle && (
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: 18,
            maxWidth: 560,
            lineHeight: 1.65,
            transition: 'color 0.3s ease',
          }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
