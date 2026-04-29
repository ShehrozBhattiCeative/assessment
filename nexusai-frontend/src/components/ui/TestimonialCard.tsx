import { Avatar } from './Avatar';

interface Testimonial {
  id: string;
  patientName: string;
  patientAvatar?: string;
  rating: number;
  review: string;
  treatment: string;
  year: number;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({ testimonial, className = '' }: TestimonialCardProps) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        height: '100%',
      }}
    >
      {/* Stars */}
      <div style={{ display: 'flex', gap: 3 }}>
        {[1,2,3,4,5].map((s) => (
          <svg key={s} width="16" height="16" viewBox="0 0 20 20" fill={s <= testimonial.rating ? 'var(--star)' : 'var(--border)'}>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.75, fontStyle: 'italic', flex: 1 }} className="line-clamp-4">
        "{testimonial.review}"
      </p>

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <Avatar src={testimonial.patientAvatar} name={testimonial.patientName} size="md" />
        <div>
          <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{testimonial.patientName}</p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{testimonial.treatment} · {testimonial.year}</p>
        </div>
      </div>
    </div>
  );
}
