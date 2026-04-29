'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

interface SidebarProps {
  sections: SidebarSection[];
  isOpen?: boolean;
  onClose?: () => void;
  logo?: React.ReactNode;
  footer?: React.ReactNode;
}

function NavItem({ item, onClick }: { item: SidebarItem; onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 500,
        textDecoration: 'none',
        transition: 'all 0.2s',
        fontFamily: 'var(--font-body)',
        ...(isActive ? {
          background: 'linear-gradient(135deg,rgba(34,211,238,0.15),rgba(167,139,250,0.1))',
          color: '#22d3ee',
          borderLeft: '2px solid #22d3ee',
          paddingLeft: 10,
        } : {
          background: hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
          color: hovered ? '#ffffff' : 'rgba(255,255,255,0.55)',
          borderLeft: '2px solid transparent',
          paddingLeft: 10,
        }),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{
        flexShrink: 0,
        display: 'flex',
        color: isActive ? '#22d3ee' : (hovered ? '#ffffff' : 'rgba(255,255,255,0.45)'),
        transition: 'color 0.2s',
      }}>
        {item.icon}
      </span>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {item.label}
      </span>
      {item.badge !== undefined && (
        <span style={{
          fontSize: 11,
          padding: '2px 8px',
          borderRadius: 999,
          fontWeight: 600,
          ...(isActive
            ? { background: 'rgba(34,211,238,0.2)', color: '#22d3ee' }
            : { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }
          ),
        }}>
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar({ sections, isOpen = true, onClose, logo, footer }: SidebarProps) {
  return (
    <>
      {isOpen && onClose && (
        <div
          className="fixed inset-0 z-[290] lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-[260px] flex flex-col z-[300]',
          'transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
        style={{
          background: '#0b1020',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
        }}
      >
        {logo && (
          <div style={{ padding: 20, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            {logo}
          </div>
        )}
        <nav style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {sections.map((section, si) => (
            <div key={si}>
              {section.title && (
                <p style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.35)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  padding: '0 12px',
                  marginBottom: 8,
                  fontFamily: 'var(--font-body)',
                }}>
                  {section.title}
                </p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {section.items.map((item) => (
                  <NavItem key={item.href} item={item} onClick={onClose} />
                ))}
              </div>
            </div>
          ))}
        </nav>
        {footer && (
          <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            {footer}
          </div>
        )}
      </aside>
    </>
  );
}
