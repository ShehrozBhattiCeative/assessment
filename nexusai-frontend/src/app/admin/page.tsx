'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { usersApi, appointmentsApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';

function StatCard({ label, value, icon, gradient, href }: { label: string; value: string | number; icon: React.ReactNode; gradient: string; href?: string }) {
  const content = (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '24px',
      transition: 'all 0.25s var(--ease)',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 20px 40px -12px rgba(34,211,238,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8 }}>{label}</p>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</p>
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: 12, flexShrink: 0,
          background: gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
  return href ? <Link href={href} style={{ textDecoration: 'none' }}>{content}</Link> : content;
}

const aptColumns: Column<any>[] = [
  { key: 'patientName', header: 'Patient' },
  { key: 'doctorName', header: 'Doctor' },
  { key: 'date', header: 'Date', render: (v: any) => formatDate(v as string, { day: 'numeric', month: 'short', year: 'numeric' }) },
  { key: 'time', header: 'Time' },
  { key: 'status', header: 'Status', render: (v: any) => <StatusBadge status={v as string} /> },
  { key: 'fee', header: 'Fee', render: (v: any) => `₹${v?.toLocaleString()}` },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentApts, setRecentApts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      usersApi.getDashboard().catch(() => null),
      appointmentsApi.getAll().catch(() => []),
    ]).then(([dashStats, apts]) => {
      setStats(dashStats);
      setRecentApts((apts as any[]).slice(0, 8));
      setLoading(false);
    });
  }, []);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.025em', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{today}</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }} className="stats-grid">
        <StatCard
          label="Total Patients"
          value={loading ? '—' : stats?.totalPatients ?? 0}
          href="/admin/patients"
          gradient="linear-gradient(135deg,rgba(34,211,238,0.2),rgba(34,211,238,0.08))"
          icon={<svg width="22" height="22" fill="none" stroke="#22d3ee" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard
          label="Appointments Today"
          value={loading ? '—' : stats?.appointmentsToday ?? 0}
          href="/admin/appointments"
          gradient="linear-gradient(135deg,rgba(245,158,11,0.2),rgba(245,158,11,0.08))"
          icon={<svg width="22" height="22" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
        <StatCard
          label="Total Doctors"
          value={loading ? '—' : stats?.totalDoctors ?? 10}
          href="/admin/doctors"
          gradient="linear-gradient(135deg,rgba(52,211,153,0.2),rgba(52,211,153,0.08))"
          icon={<svg width="22" height="22" fill="none" stroke="#34d399" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
        />
        <StatCard
          label="Total Revenue"
          value={loading ? '—' : `₹${(stats?.totalRevenue ?? 0).toLocaleString()}`}
          gradient="linear-gradient(135deg,rgba(244,114,182,0.2),rgba(244,114,182,0.08))"
          icon={<svg width="22" height="22" fill="none" stroke="#f472b6" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {[
          { href: '/admin/doctors', label: 'Add Doctor', icon: '👨‍⚕️' },
          { href: '/admin/appointments', label: 'View Appointments', icon: '📅' },
          { href: '/admin/blogs', label: 'Write Article', icon: '✍️' },
          { href: '/admin/packages', label: 'Manage Packages', icon: '📦' },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '20px', textAlign: 'center',
              transition: 'all 0.25s var(--ease)', cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{action.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{action.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Appointments */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Recent Appointments</h2>
          <Link href="/admin/appointments" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>View all →</Link>
        </div>
        <DataTable
          columns={aptColumns}
          data={recentApts}
          keyField="id"
          loading={loading}
          emptyMessage="No appointments yet"
          className="border-0 rounded-none"
        />
      </div>
    </div>
  );
}
