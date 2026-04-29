'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';

const DEPARTMENTS = [
  { icon: '❤️', name: 'Cardiology', desc: 'Advanced cardiac care with state-of-the-art cath labs and cardiac ICU.' },
  { icon: '🧠', name: 'Neurology', desc: 'Dedicated stroke centre and comprehensive neuro-diagnostics.' },
  { icon: '🦴', name: 'Orthopaedics', desc: 'Joint replacement, sports injuries and spine surgery.' },
  { icon: '🔬', name: 'Oncology', desc: 'PET-CT, chemotherapy and surgical oncology under one roof.' },
  { icon: '👁️', name: 'Eye Specialist', desc: 'LASIK, cataract and retinal care with expert eye surgeons.' },
  { icon: '🏥', name: 'General Surgery', desc: 'Minimally invasive laparoscopic procedures and robotic surgery.' },
];

const CORE_VALUES = [
  { num: '01', title: 'Teamwork', desc: 'Collaboration across specialities for the best patient outcomes.' },
  { num: '02', title: 'Integrity', desc: 'Transparent, honest communication at every step of care.' },
  { num: '03', title: 'Responsibility', desc: 'Accountability to patients, families, and the community.' },
  { num: '04', title: 'Compassion', desc: 'Treating every patient with empathy and human dignity.' },
  { num: '05', title: 'Ethics', desc: 'Upholding the highest medical and professional standards.' },
];

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <PageHeader
        breadcrumb="About"
        heading="About Unity Hospital."
        subtitle="Trusted by thousands of families across Ahmedabad since 2000."
      />

      {/* Our Story */}
      <section style={{ padding: '80px 0', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <span className="section-label">Our Story</span>
            <h2 style={{ fontSize: 38, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 20 }}>
              Built on trust, powered by science.
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 16 }}>
              Unity Hospital stands at Vaishnodevi Circle, SG Road, Ahmedabad — a modern sanctuary built on the conviction that world-class healthcare should be available to everyone. Since our founding, we have grown to house 300+ beds, 17 operation theatres, a 96-bed ICU and 45+ super-specialities under one roof.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 32 }}>
              Awarded Best Hospital 2020, NABH accredited, and trusted by over a million patients — we combine clinical excellence with genuine human warmth in every interaction.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <Link href="/appointment" style={{
                background: 'var(--accent)', color: '#fff', padding: '12px 28px',
                borderRadius: 'var(--radius-btn)', fontWeight: 600, fontSize: 14,
                textDecoration: 'none', display: 'inline-block',
              }}>
                Book Appointment
              </Link>
              <Link href="/contact" style={{
                color: 'var(--accent)', padding: '12px 28px',
                borderRadius: 'var(--radius-btn)', fontWeight: 600, fontSize: 14,
                textDecoration: 'none', border: '2px solid var(--accent)', display: 'inline-block',
              }}>
                Get in touch
              </Link>
            </div>
          </div>
          <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', aspectRatio: '4/3' }}>
            <img
              src="https://nirravv.github.io/Hospital-Management-Html/assets/img/gallery/hospital.jpg"
              alt="Unity Hospital"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
            />
          </div>
        </div>
      </section>

      {/* CEO Quote */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            background: 'var(--bg-nav)', borderRadius: 'var(--radius)',
            padding: '56px 64px', textAlign: 'center', position: 'relative',
          }}>
            <div style={{ fontSize: 96, lineHeight: 0.7, color: 'var(--accent)', fontFamily: 'Georgia, serif', marginBottom: 32, opacity: 0.8 }}>
              "
            </div>
            <p style={{ fontSize: 24, fontStyle: 'italic', color: '#f1f5f9', lineHeight: 1.7, marginBottom: 32 }}>
              Well-being as a humane commitment to enliven humanity.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, letterSpacing: '0.05em' }}>
              — Harshil Patel, Chief Executive Officer
            </p>
          </div>
        </div>
      </section>

      {/* Vision / Mission / Values */}
      <section style={{ padding: '80px 0', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <SectionHeader label="Our Purpose" heading="Why we exist." align="center" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { title: 'Vision', icon: '🔭', text: 'Enlivening humanity, one patient at a time — to be the most trusted and innovative hospital in India.' },
              { title: 'Mission', icon: '🎯', text: 'Available. Accessible. Affordable. Delivering compassionate, clinically excellent healthcare that transforms lives.' },
              { title: 'Values', icon: '⭐', text: 'Teamwork · Integrity · Responsibility · Compassion · Ethics — the five pillars that guide every decision we make.' },
            ].map((item) => (
              <div key={item.title} className="card-hover" style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: 32, textAlign: 'center',
              }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: 20, color: 'var(--text-primary)', marginBottom: 12 }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 14 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <SectionHeader label="Core Values" heading="What we stand for." align="left" />
          <div style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 8 }}>
            {CORE_VALUES.map((v) => (
              <div key={v.num} className="card-hover" style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '28px 24px',
                minWidth: 200, flex: '0 0 auto',
              }}>
                <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent)', marginBottom: 10, lineHeight: 1 }}>{v.num}</p>
                <h4 style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-primary)', marginBottom: 8 }}>{v.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.65 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Grid */}
      <section style={{ padding: '80px 0', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <SectionHeader label="Departments" heading="Care that spans every system." align="center" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {DEPARTMENTS.map((dept) => (
              <div key={dept.name} className="card-hover" style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: 28,
              }}>
                <div style={{
                  width: 52, height: 52, background: 'var(--accent-light)',
                  borderRadius: 12, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 24, marginBottom: 16,
                }}>
                  {dept.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-primary)', marginBottom: 8 }}>{dept.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.65 }}>{dept.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', background: 'var(--bg-nav)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 38, fontWeight: 700, color: '#ffffff', marginBottom: 16 }}>
            Your care journey starts here.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 36, fontSize: 17 }}>
            Schedule a consultation with our specialists today.
          </p>
          <Link href="/appointment" style={{
            background: 'var(--accent)', color: '#fff', padding: '14px 36px',
            borderRadius: 'var(--radius-btn)', fontWeight: 600, fontSize: 16,
            textDecoration: 'none', display: 'inline-block',
          }}>
            Book Appointment
          </Link>
        </div>
      </section>
    </div>
  );
}
