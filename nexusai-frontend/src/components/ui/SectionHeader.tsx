interface SectionHeaderProps {
  label: string;
  heading: string;
  subtitle?: string;
  align?: 'left' | 'center';
  action?: React.ReactNode;
}

export function SectionHeader({ label, heading, subtitle, align = 'center', action }: SectionHeaderProps) {
  const isCenter = align === 'center';
  return (
    <div className={`mb-14 ${isCenter ? 'text-center' : ''}`} style={{ display: action ? 'flex' : undefined, alignItems: action ? 'flex-end' : undefined, justifyContent: action ? 'space-between' : undefined }}>
      <div>
        <span className="section-label">{label}</span>
        <h2 style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: subtitle ? 16 : 0 }}>
          {heading}
        </h2>
        {subtitle && (
          <p style={{ color: 'var(--text-secondary)', fontSize: 17, maxWidth: isCenter ? 560 : undefined, margin: isCenter ? '0 auto' : undefined }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
