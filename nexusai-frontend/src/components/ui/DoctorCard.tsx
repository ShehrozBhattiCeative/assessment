'use client';

import Link from 'next/link';
import { Avatar } from './Avatar';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  image?: string;
  experience?: number;
  rating?: number;
  fee?: number;
}

interface DoctorCardProps {
  doctor: Doctor;
  className?: string;
  compact?: boolean;
}

export function DoctorCard({ doctor, className = '', compact = false }: DoctorCardProps) {
  return (
    <Link href={`/doctors/${doctor.id}`} style={{ textDecoration: 'none', display: 'block' }} className={className}>
      <div
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', transition: 'all 0.25s var(--ease)', cursor: 'pointer' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 20px 40px -12px rgba(34,211,238,0.2)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
          <Avatar src={doctor.image} name={doctor.name} shape="square" className="w-full h-full" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(5,7,13,0.7) 0%,transparent 50%)' }} />
          <div style={{ position: 'absolute', bottom: 10, left: 10, padding: '3px 10px', background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: 999, fontSize: 10, fontWeight: 600, color: '#22d3ee', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {doctor.specialty}
          </div>
        </div>
        {/* Info */}
        <div style={{ padding: '16px 18px 18px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3 }}>{doctor.name}</h3>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: compact ? 0 : 10 }}>{doctor.qualification}</p>
          {!compact && doctor.fee && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Consultation</span>
              <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>₹{doctor.fee}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
