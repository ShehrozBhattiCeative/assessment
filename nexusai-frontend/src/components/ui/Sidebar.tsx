'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
        isActive
          ? 'bg-[#0f4c81] text-white shadow-md'
          : 'text-[#374151] hover:bg-[#f0f7ff] hover:text-[#0f4c81]'
      )}
    >
      <span className={cn('shrink-0', isActive ? 'text-white' : 'text-[#6b7280] group-hover:text-[#0f4c81]')}>
        {item.icon}
      </span>
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge !== undefined && (
        <span className={cn(
          'text-xs px-2 py-0.5 rounded-full font-semibold',
          isActive ? 'bg-white/20 text-white' : 'bg-[#eff6ff] text-[#0f4c81]'
        )}>
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
          className="fixed inset-0 bg-black/50 z-[290] lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-[260px] bg-white border-r border-[#e2e8f0] flex flex-col z-[300]',
          'transition-transform duration-300 shadow-xl',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:shadow-none'
        )}
      >
        {logo && (
          <div className="p-5 border-b border-[#e2e8f0] shrink-0">
            {logo}
          </div>
        )}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {sections.map((section, si) => (
            <div key={si}>
              {section.title && (
                <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider px-3 mb-2">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavItem key={item.href} item={item} onClick={onClose} />
                ))}
              </div>
            </div>
          ))}
        </nav>
        {footer && (
          <div className="p-4 border-t border-[#e2e8f0] shrink-0">
            {footer}
          </div>
        )}
      </aside>
    </>
  );
}
