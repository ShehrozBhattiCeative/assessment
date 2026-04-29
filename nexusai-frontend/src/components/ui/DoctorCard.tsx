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
    <Link
      href={`/doctors/${doctor.id}`}
      style={{ textDecoration: 'none', display: 'block' }}
      className={className}
    >
      <div
        className="card-hover"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; }}
      >
        {/* Image area */}
        <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
          <Avatar
            src={doctor.image}
            name={doctor.name}
            shape="square"
            className="w-full h-full"
          />
          {/* Specialty badge */}
          <div style={{
            position: 'absolute', bottom: 10, left: 10,
            background: 'var(--accent)', color: '#ffffff',
            fontSize: 11, fontWeight: 600, padding: '3px 10px',
            borderRadius: 20,
          }}>
            {doctor.specialty}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '14px 16px 16px' }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3 }}>
            {doctor.name}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {doctor.qualification}
          </p>
          {!compact && doctor.fee && (
            <p style={{ marginTop: 10, fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>
              ₹{doctor.fee} / consult
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
