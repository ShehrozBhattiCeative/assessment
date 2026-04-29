'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/auth.store';
import { NAV_LINKS } from '@/constants';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: 'var(--bg-nav)',
      boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.4)' : 'none',
      transition: 'box-shadow 0.3s',
      height: 68,
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        height: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 16,
      }}>

        {/* ── Logo ───────────────────────────────────────────────────── */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          {/* Hospital cross icon */}
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
              <rect x="8" y="2" width="4" height="16" rx="1"/>
              <rect x="2" y="8" width="16" height="4" rx="1"/>
            </svg>
          </div>
          <div style={{ lineHeight: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 16, color: '#ffffff', marginBottom: 1 }}>Unity</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>Hospital</p>
          </div>
        </Link>

        {/* ── Desktop Nav ────────────────────────────────────────────── */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 0, flex: 1, justifyContent: 'center' }}
          className="hidden lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '8px 12px',
                  fontSize: 14, fontWeight: 500,
                  color: active ? 'var(--accent)' : 'rgba(255,255,255,0.78)',
                  textDecoration: 'none',
                  borderRadius: 6,
                  transition: 'color 0.18s',
                  whiteSpace: 'nowrap',
                  borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.78)'; }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right side (desktop) ───────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}
          className="hidden lg:flex">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  style={{
                    padding: '7px 14px', fontSize: 13, fontWeight: 500,
                    color: 'rgba(255,255,255,0.78)', textDecoration: 'none',
                    borderRadius: 6, transition: 'color 0.18s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.78)')}
                >
                  Dashboard
                </Link>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar name={user?.name} size="sm" />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name}
                </span>
              </div>
              <button
                onClick={() => logout()}
                style={{
                  padding: '7px 16px', fontSize: 13, fontWeight: 500,
                  color: 'rgba(255,255,255,0.78)', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6,
                  cursor: 'pointer', transition: 'all 0.18s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.78)'; }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                style={{
                  padding: '7px 16px', fontSize: 13, fontWeight: 500,
                  color: 'rgba(255,255,255,0.78)', textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6,
                  transition: 'all 0.18s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.78)'; }}
              >
                Login
              </Link>
              <Link
                href="/appointment"
                style={{
                  padding: '8px 18px', fontSize: 13, fontWeight: 600,
                  color: '#ffffff', background: 'var(--accent)',
                  borderRadius: 6, textDecoration: 'none', transition: 'background 0.18s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent)')}
              >
                Book Now
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
