'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/auth.store';
import { NAV_LINKS } from '@/constants';

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const lastY    = useRef(0);

  const { isAuthenticated, user, logout } = useAuthStore();

  /* Hide nav on scroll-down, reveal on scroll-up */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 120 && y > lastY.current) setHidden(true);
      else setHidden(false);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  /* Floating-pill nav transform */
  const navTransform = hidden
    ? 'translateX(-50%) translateY(-140%)'
    : 'translateX(-50%) translateY(0)';

  return (
    <>
      {/* ── FLOATING PILL NAV ──────────────────────────────────────────────── */}
      <nav
        style={{
          position: 'fixed',
          top: 18,
          left: '50%',
          transform: navTransform,
          width: 'calc(100% - 32px)',
          maxWidth: 1240,
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px 10px 20px',
          borderRadius: 999,
          background: 'rgba(11, 16, 32, 0.60)',
          backdropFilter: 'saturate(140%) blur(20px)',
          WebkitBackdropFilter: 'saturate(140%) blur(20px)',
          border: '1px solid var(--border)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1)',
        }}
        aria-label="Primary"
      >
        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <Link
          href="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}
        >
          {/* Brand mark — gradient square with + cross */}
          <span style={{
            width: 34, height: 34,
            display: 'grid', placeItems: 'center',
            borderRadius: 10,
            background: 'var(--grad-primary)',
            flexShrink: 0,
            position: 'relative',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="#04060c">
              <rect x="7.5" y="2" width="3" height="14" rx="1.5" />
              <rect x="2" y="7.5" width="14" height="3" rx="1.5" />
            </svg>
          </span>
          {/* Brand name */}
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 17, color: '#ffffff', letterSpacing: '-0.01em' }}>Unity</span>
            <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.22em', marginTop: 3, textTransform: 'uppercase', fontWeight: 500 }}>Hospital</span>
          </span>
        </Link>

        {/* ── Desktop nav links ─────────────────────────────────────────── */}
        <ul
          style={{ display: 'flex', gap: 2, listStyle: 'none', margin: 0, padding: 0 }}
          className="hidden lg:flex"
        >
          {NAV_LINKS.map(link => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    display: 'inline-block',
                    padding: '7px 13px',
                    fontSize: 14,
                    fontWeight: 500,
                    color: active ? '#ffffff' : 'rgba(255,255,255,0.62)',
                    textDecoration: 'none',
                    borderRadius: 999,
                    background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
                    transition: 'color 0.18s, background 0.18s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.62)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Right actions ────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  style={{
                    padding: '7px 14px', fontSize: 13, fontWeight: 500,
                    color: 'rgba(255,255,255,0.72)', textDecoration: 'none',
                    borderRadius: 999, transition: 'color 0.18s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#22d3ee')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.72)')}
                >
                  Dashboard
                </Link>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Avatar name={user?.name} size="sm" />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name}
                </span>
              </div>
              <button
                onClick={() => logout()}
                style={{
                  padding: '8px 16px', fontSize: 13, fontWeight: 500,
                  color: 'rgba(255,255,255,0.72)', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.18)', borderRadius: 999,
                  cursor: 'pointer', transition: 'all 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = 'rgba(255,255,255,0.72)'; }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                style={{
                  padding: '8px 16px', fontSize: 13, fontWeight: 500,
                  color: 'rgba(255,255,255,0.72)', textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.18)', borderRadius: 999,
                  transition: 'all 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = 'rgba(255,255,255,0.72)'; }}
              >
                Sign in
              </Link>
              <Link
                href="/appointment"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '9px 18px', fontSize: 13, fontWeight: 600,
                  color: '#04060c', background: 'var(--grad-primary)',
                  borderRadius: 999, textDecoration: 'none',
                  boxShadow: '0 6px 20px -6px rgba(34,211,238,0.5)',
                  transition: 'filter 0.18s',
                }}
                onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
                onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
              >
                Book
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
            </>
          )}
        </div>

      </nav>

    </>
  );
}
