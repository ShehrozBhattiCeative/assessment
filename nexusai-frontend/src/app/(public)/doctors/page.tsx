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
      <section style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '16px 0', position: 'sticky', top: 68, zIndex: 40, backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
            <svg
              width="16" height="16" fill="none" stroke="var(--text-secondary)"
              strokeWidth="2" viewBox="0 0 24 24"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            >
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or specialty…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px 10px 40px',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 999, fontSize: 14, color: 'var(--text-primary)', outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            />
          </div>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            style={{
              padding: '10px 16px', background: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: 999,
              fontSize: 14, color: specialty ? 'var(--text-primary)' : 'var(--text-secondary)',
              minWidth: 200, outline: 'none', cursor: 'pointer',
            }}
          >
            {specialtyOptions.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                {opt.label}
              </option>
            ))}
          </select>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
            {filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: '64px 0', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          {loading ? (
            <div className="doctors-grid">
              {Array(8).fill(null).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 320, borderRadius: 'var(--radius)' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
              <h3 style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: 8 }}>No doctors found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search filters.</p>
            </div>
          ) : (
            <div className="doctors-grid">
              {filtered.map((doc) => <DoctorCard key={doc.id} doctor={doc} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <span className="section-label">Get Started</span>
          <h2 style={{ fontSize: 30, fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: 12, letterSpacing: '-0.025em' }}>
            Need a second opinion?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>
            Our specialists are ready to help you find the right path to recovery.
          </p>
          <Link href="/appointment" style={{
            background: 'var(--grad-primary)', color: '#04060c', padding: '13px 32px',
            borderRadius: 'var(--radius-btn)', fontWeight: 600, fontSize: 15,
            textDecoration: 'none', display: 'inline-block',
            boxShadow: '0 10px 30px -10px rgba(34,211,238,0.5)',
          }}>
            Request Appointment →
          </Link>
        </div>
      </section>
    </div>
  );
}
