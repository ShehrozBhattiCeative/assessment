'use client';

import { useEffect, useState } from 'react';
import { DoctorCard } from '@/components/ui/DoctorCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { doctorsApi, departmentsApi } from '@/lib/api';
import Link from 'next/link';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');

  useEffect(() => {
    Promise.all([doctorsApi.getAll(), departmentsApi.getAll()]).then(([d, depts]) => {
      setDoctors(d);
      setDepartments(depts);
      setLoading(false);
    });
  }, []);

  const filtered = doctors.filter((d) => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchSpec = !specialty || d.specialty.toLowerCase().includes(specialty.toLowerCase());
    return matchSearch && matchSpec;
  });

  const specialtyOptions = [{ value: '', label: 'All Specialties' }, ...departments.map((d) => ({ value: d.name, label: d.name }))];

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <PageHeader
        breadcrumb="Doctors"
        heading="Meet our specialists."
        subtitle="An ensemble of experienced clinicians delivering care with warmth, precision, and uncompromising quality."
      />

      {/* Filters */}
      <section style={{ background: 'var(--bg-nav)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 0', position: 'sticky', top: 68, zIndex: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
            <svg
              width="16" height="16" fill="none" stroke="rgba(255,255,255,0.45)"
              strokeWidth="2" viewBox="0 0 24 24"
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
            >
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or specialty…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '9px 14px 9px 38px',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 8, fontSize: 14, color: '#fff', outline: 'none',
              }}
            />
          </div>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            style={{
              padding: '9px 14px', background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
              fontSize: 14, color: specialty ? '#fff' : 'rgba(255,255,255,0.55)',
              minWidth: 200, outline: 'none', cursor: 'pointer',
            }}
          >
            {specialtyOptions.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ background: '#0d1b2a', color: '#fff' }}>
                {opt.label}
              </option>
            ))}
          </select>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
            {filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: '64px 0', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              {Array(8).fill(null).map((_, i) => (
                <div key={i} style={{ height: 320, borderRadius: 'var(--radius)', background: 'var(--border)', opacity: 0.5 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>No doctors found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search filters.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              {filtered.map((doc) => <DoctorCard key={doc.id} doctor={doc} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
            Need a second opinion?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>
            Our specialists are ready to help you find the right path to recovery.
          </p>
          <Link href="/appointment" style={{
            background: 'var(--accent)', color: '#fff', padding: '13px 32px',
            borderRadius: 'var(--radius-btn)', fontWeight: 600, fontSize: 15,
            textDecoration: 'none', display: 'inline-block',
          }}>
            Request Appointment →
          </Link>
        </div>
      </section>
    </div>
  );
}
