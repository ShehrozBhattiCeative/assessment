interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}

export function InfoCard({ icon, label, value, sub }: InfoCardProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 16,
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '24px',
      transition: 'all 0.25s var(--ease)',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, flexShrink: 0,
        background: 'var(--grad-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 4 }}>
          {label}
        </p>
        <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 28, color: 'var(--accent)', lineHeight: 1.2 }}>{value}</p>
        {sub && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{sub}</p>}
      </div>
    </div>
  );
}
