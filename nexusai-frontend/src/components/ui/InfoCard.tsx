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
      borderRadius: 'var(--radius)', padding: '20px 24px',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        background: 'var(--accent-light)', color: 'var(--accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 4 }}>
          {label}
        </p>
        <p style={{ fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>{value}</p>
        {sub && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{sub}</p>}
      </div>
    </div>
  );
}
