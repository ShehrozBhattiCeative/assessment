'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { departmentsApi } from '@/lib/api';

const DEPT_ICONS: Record<string, string> = {
  'Paediatrics': '👶', 'Neurology': '🧠', 'General Surgery': '🔬', 'Dermatology': '✨',
  'Cardiology': '❤️', 'Orthopaedics': '🦴', 'Nephrology & Urology': '💧', 'Nutrition & Dietetics': '🥗',
  'Gastroenterology': '🫀', 'Obstetrics & Gynaecology': '🌸', 'Oncology': '🎗️', 'Pulmonology': '🫁',
  'Endocrinology': '⚗️', 'Ophthalmology': '👁️', 'ENT (Ear, Nose & Throat)': '👂',
  'Psychiatry & Mental Health': '🧘', 'Rheumatology': '🦾', 'Haematology': '🩸',
  'Neurosurgery': '🧠', 'Plastic & Reconstructive Surgery': '💎', 'Cardiothoracic Surgery': '❤️‍🔥',
  'Vascular Surgery': '🩺', 'Transplant Medicine': '🤝', 'Reproductive Medicine & IVF': '🧬',
  'Neonatology': '🐣', 'Physiotherapy & Rehabilitation': '🏃', 'Pain Management': '💊',
  'Palliative Care': '🕊️', 'Emergency & Trauma': '🚨', 'Critical Care & ICU': '🏥',
  'Anaesthesiology': '💉', 'Radiology & Imaging': '📡', 'Pathology & Laboratory': '🔭',
  'Nuclear Medicine': '⚛️', 'Sports Medicine': '🏅', 'Dental & Maxillofacial Surgery': '🦷',
  'Geriatrics': '🧓', 'Allergy & Immunology': '🛡️', 'Infectious Disease': '🦠',
  'Internal Medicine': '🩺', 'Spine Surgery': '⬆️', 'Bariatric Surgery': '⚖️',
  'Liver & Hepatology': '🫁', 'Diabetes & Endocrinology': '🍬', 'Preventive Health & Wellness': '✅',
};

export default function ServicesPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    departmentsApi.getAll().then(setDepartments).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <section style={{ padding: '100px 24px 80px', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,211,238,0.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(167,139,250,0.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <span className="section-label">What We Offer</span>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', letterSpacing: '-0.025em', marginBottom: 16 }}>
            Care That Spans Every System
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 32px' }}>
            45+ super-specialities, all under one roof. Comprehensive, compassionate care for every stage of life.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {['24/7 Emergency', 'NABH Accredited', '17 OTs', '96 ICU Beds', 'Robotic Surgery'].map((tag) => (
              <span key={tag} style={{
                padding: '6px 16px', background: 'rgba(34,211,238,0.08)',
                border: '1px solid rgba(34,211,238,0.2)', borderRadius: 999,
                fontSize: 13, color: 'var(--accent)', fontWeight: 500,
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Grid */}
      <section style={{ padding: '32px 0 96px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
              {Array(15).fill(null).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 140, borderRadius: 'var(--radius)' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  id={dept.slug}
                  style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', padding: '24px',
                    transition: 'all 0.25s var(--ease)', cursor: 'default',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 20px 40px -12px rgba(34,211,238,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 12, background: 'var(--accent-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
                      transition: 'transform 0.25s var(--ease)',
                    }}>
                      {DEPT_ICONS[dept.name] || '🏥'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.3 }}>{dept.name}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, marginBottom: 12 }} className="line-clamp-2">{dept.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{dept.doctorCount} specialists</span>
                        <Link href="/doctors" style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                          Meet the team →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg,rgba(34,211,238,0.08) 0%,rgba(167,139,250,0.08) 100%)',
            border: '1px solid rgba(34,211,238,0.2)', borderRadius: 'var(--radius-lg)',
            padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,211,238,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <span className="section-label">Get Started</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', letterSpacing: '-0.025em', marginBottom: 14 }}>
              Ready to Book a Consultation?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 32, maxWidth: 440, margin: '0 auto 32px' }}>
              Our specialists are ready to provide the care you deserve.
            </p>
            <Link href="/appointment" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 32px', background: 'var(--grad-primary)',
              color: '#04060c', borderRadius: 999, fontWeight: 600, fontSize: 15,
              textDecoration: 'none', boxShadow: '0 10px 30px -10px rgba(34,211,238,0.5)',
            }}>
              Book an Appointment →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
