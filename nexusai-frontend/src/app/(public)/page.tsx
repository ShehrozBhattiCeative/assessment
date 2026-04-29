'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { DoctorCard } from '@/components/ui/DoctorCard';
import { BlogCard } from '@/components/ui/BlogCard';
import { PackageCard } from '@/components/ui/PackageCard';
import { TestimonialCard } from '@/components/ui/TestimonialCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { doctorsApi, blogsApi, packagesApi, testimonialsApi, statsApi, departmentsApi } from '@/lib/api';

const HERO_IMG  = 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1600&q=80';
const ABOUT_IMG = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=80';

const SPECIALTIES = [
  { icon: '🚑', name: '24/7 Ambulance Response',  desc: 'Round-the-clock emergency response with advanced life support.' },
  { icon: '👁️', name: 'LASIK Vision Centre',       desc: 'Latest-generation laser eye surgery for lasting clarity.' },
  { icon: '🧠', name: 'Dedicated Stroke Centre',   desc: 'Rapid response neurology team for acute stroke management.' },
  { icon: '🔬', name: '17 Operation Theatres',     desc: 'Robotic, hybrid, and laparoscopic surgical suites.' },
  { icon: '🦴', name: 'Joint Replacement',         desc: 'Minimally invasive knee and hip replacement procedures.' },
  { icon: '❤️', name: 'Cardiac Sciences',          desc: 'Catheterisation labs and cardiac ICU for heart care.' },
];

function useCountUp(end: number, duration = 1800) {
  const [count, setCount]   = useState(0);
  const ref                  = useRef<HTMLDivElement>(null);
  const started              = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const startTime = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          setCount(Math.floor(progress * end));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

function StatItem({ end, suffix = '', label }: { end: number | string; suffix?: string; label: string }) {
  const isNum = typeof end === 'number';
  const { count, ref } = useCountUp(isNum ? end : 0);
  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '0 24px', flex: 1 }}>
      <div style={{ fontSize: 48, fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent)', lineHeight: 1 }}>
        {isNum ? count.toLocaleString() : end}{suffix}
      </div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginTop: 8 }}>{label}</div>
    </div>
  );
}

export default function HomePage() {
  const [doctors,      setDoctors]      = useState<any[]>([]);
  const [blogs,        setBlogs]        = useState<any[]>([]);
  const [packages,     setPackages]     = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [stats,        setStats]        = useState<any>(null);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    Promise.all([
      doctorsApi.getAll().catch(() => []),
      blogsApi.getAll({ status: 'published' }).catch(() => []),
      packagesApi.getAll().catch(() => []),
      testimonialsApi.getAll().catch(() => []),
      statsApi.get().catch(() => ({})),
      departmentsApi.getAll().catch(() => []),
    ]).then(([d, b, p, t, s]) => {
      setDoctors((d as any[]).slice(0, 4));
      setBlogs((b as any[]).slice(0, 3));
      setPackages(p as any[]);
      setTestimonials((t as any[]).slice(0, 3));
      setStats(s);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: 'var(--bg-primary)' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Full-page background image */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <img
            src={HERO_IMG}
            alt="Unity Hospital"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'var(--hero-overlay)', transition: 'background 0.4s ease' }} />
        </div>

        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '80px 24px', width: '100%' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px',
            background: 'rgba(34,211,238,0.12)',
            border: '1px solid rgba(34,211,238,0.35)',
            borderRadius: 30, marginBottom: 28,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#22d3ee', letterSpacing: '0.06em' }}>
              24/7 Emergency Care · NABH Accredited
            </span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 700,
            color: '#ffffff', lineHeight: 1.15,
            maxWidth: 700, marginBottom: 24,
          }}>
            Healthcare,{' '}
            <span style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              reimagined
            </span>{' '}
            for you.
          </h1>

          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, maxWidth: 560, marginBottom: 40 }}>
            Unity Hospital brings together 45+ super-specialities, 300+ beds and an ensemble of experienced clinicians — delivered with warmth, precision, and uncompromising quality.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link
              href="/appointment"
              style={{
                padding: '14px 28px', fontSize: 15, fontWeight: 600,
                color: '#04060c', background: 'var(--grad-primary)',
                borderRadius: 999, textDecoration: 'none',
                boxShadow: '0 10px 30px -10px rgba(34,211,238,0.6)',
                transition: 'filter 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
              onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
            >
              Book Appointment
            </Link>
            <Link
              href="/doctors"
              style={{
                padding: '14px 28px', fontSize: 15, fontWeight: 600,
                color: '#ffffff',
                background: 'transparent',
                border: '2px solid rgba(255,255,255,0.4)',
                borderRadius: 999, textDecoration: 'none', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = '#22d3ee'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = '#ffffff'; }}
            >
              Meet our doctors
            </Link>
          </div>

          {/* Floating info badges */}
          <div style={{ display: 'flex', gap: 16, marginTop: 56, flexWrap: 'wrap' }}>
            {[
              { color: '#10b981', icon: '●', title: 'Live Monitoring',  sub: '96 ICU beds online' },
              { color: '#a78bfa', icon: '★', title: 'NABH Accredited', sub: 'Best Hospital — 2024' },
            ].map(c => (
              <div key={c.title} style={{
                background: 'rgba(11,16,32,0.75)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12, padding: '14px 18px',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{ fontSize: 18, color: c.color }}>{c.icon}</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>{c.title}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{c.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-nav)', padding: '48px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0 }}>
          {[
            { end: stats?.beds || 300,              suffix: '+', label: 'Beds' },
            { end: stats?.specialties || 45,        suffix: '+', label: 'Specialities' },
            { end: stats?.operationTheatres || 17,  suffix: '',  label: 'Operation Theatres' },
            { end: '24/7' as string,                suffix: '',  label: 'Emergency' },
          ].map((s, i, arr) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', flex: '1 1 160px' }}>
              <StatItem end={s.end as any} suffix={s.suffix} label={s.label} />
              {i < arr.length - 1 && (
                <div style={{ width: 1, height: 60, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── WELCOME TO UNITY ─────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }} className="two-col">
          {/* Text */}
          <div>
            <span className="section-label">Welcome to Unity</span>
            <h2 style={{
              fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 700,
              fontFamily: 'var(--font-heading)', color: 'var(--text-primary)',
              lineHeight: 1.2, marginBottom: 20, letterSpacing: '-0.025em',
            }}>
              A modern sanctuary for every heartbeat.
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16, fontSize: 16 }}>
              Spread across 10 acres and 440,000+ sq ft, Unity Hospital is a landmark of modern healthcare. Our 300+ bed facility is home to Centres of Excellence that deliver internationally benchmarked care.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 36, fontSize: 16 }}>
              From cardiac catheterisation labs to robotic surgery suites and a Level-III NICU, every element of Unity Hospital is designed around one goal: your complete recovery.
            </p>
            <div style={{ display: 'flex', gap: 28 }}>
              <Link
                href="/about"
                style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', fontSize: 15, transition: 'opacity 0.18s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Our story →
              </Link>
              <Link
                href="/contact"
                style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', fontSize: 15, transition: 'opacity 0.18s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Get in touch
              </Link>
            </div>
          </div>

          {/* Image */}
          <div style={{
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            border: '1px solid var(--border)',
            boxShadow: '0 24px 60px -16px rgba(0,0,0,0.3)',
          }}>
            <img
              src={ABOUT_IMG}
              alt="Unity Hospital interior"
              style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* ── SPECIALTIES ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionHeader
            label="Our Specialities"
            heading="Care that spans every system."
            subtitle="From advanced cardiac sciences to reproductive medicine, our 45+ specialities provide comprehensive care under one roof."
          />
          <div className="cards-grid-3">
            {SPECIALTIES.map(sp => (
              <div
                key={sp.name}
                className="card-hover"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '28px 24px',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'rgba(34,211,238,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
              >
                <div style={{ fontSize: 36, marginBottom: 16 }}>{sp.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 17, color: 'var(--text-primary)', marginBottom: 8 }}>{sp.name}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{sp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HEALTH PACKAGES ──────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionHeader
            label="Health Packages"
            heading="Preventive plans, priced for everyone."
            align="left"
            action={
              <Link href="/health-packages" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>
                Book a screening →
              </Link>
            }
          />
          <div className="packages-grid">
            {loading
              ? Array(4).fill(null).map((_, i) => <div key={i} className="skeleton" style={{ height: 360, borderRadius: 'var(--radius)' }} />)
              : packages.map((pkg: any) => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
        </div>
      </section>

      {/* ── FEATURED DOCTORS ─────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionHeader
            label="Meet the Team"
            heading="Clinicians who care deeply."
            align="left"
            action={
              <Link href="/doctors" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>
                View all →
              </Link>
            }
          />
          <div className="doctors-grid">
            {loading
              ? Array(4).fill(null).map((_, i) => <div key={i} className="skeleton" style={{ height: 320, borderRadius: 'var(--radius)' }} />)
              : doctors.map((doc: any) => <DoctorCard key={doc.id} doctor={doc} />)}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionHeader
            label="Testimonials"
            heading="Voices that matter most."
            subtitle="Real stories from patients whose lives we've had the privilege to touch."
          />
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24 }}>
              {Array(3).fill(null).map((_, i) => <div key={i} className="skeleton" style={{ height: 240, borderRadius: 'var(--radius)' }} />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24 }}>
              {testimonials.map((t: any) => <TestimonialCard key={t.id} testimonial={t} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── BLOG PREVIEW ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionHeader
            label="Journal"
            heading="Insights from our clinicians."
            align="left"
            action={
              <Link href="/blog" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>
                Read all →
              </Link>
            }
          />
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24 }}>
              {Array(3).fill(null).map((_, i) => <div key={i} className="skeleton" style={{ height: 300, borderRadius: 'var(--radius)' }} />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24 }}>
              {blogs.map((blog: any) => <BlogCard key={blog.id} blog={blog} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: 'var(--bg-nav)', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <span className="section-label">24/7 Emergency</span>
          <h2 style={{
            fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700,
            fontFamily: 'var(--font-heading)', color: '#ffffff',
            lineHeight: 1.2, marginBottom: 18, letterSpacing: '-0.025em',
          }}>
            Ready to see a specialist?<br />We are ready for you.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 17, marginBottom: 40 }}>
            Book an appointment with our world-class specialists and take the first step toward better health.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/appointment"
              style={{
                padding: '14px 28px', fontSize: 15, fontWeight: 600,
                color: '#04060c', background: 'var(--grad-primary)',
                borderRadius: 999, textDecoration: 'none',
                boxShadow: '0 10px 30px -10px rgba(34,211,238,0.5)',
                transition: 'filter 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
              onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
            >
              Book Appointment
            </Link>
            <Link
              href="/contact"
              style={{
                padding: '14px 28px', fontSize: 15, fontWeight: 600,
                color: '#ffffff', background: 'transparent',
                border: '2px solid rgba(255,255,255,0.25)',
                borderRadius: 999, textDecoration: 'none', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = '#22d3ee'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#ffffff'; }}
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
