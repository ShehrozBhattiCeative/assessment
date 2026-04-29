'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { usersApi, appointmentsApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';

function StatCard({ label, value, icon, color, href }: { label: string; value: string | number; icon: React.ReactNode; color: string; href?: string }) {
  const content = (
    <div className={`bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#6b7280] font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-[#1a1a2e] font-[var(--font-heading)]">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[#1a1a2e]">Dashboard</h1>
        <p className="text-[#6b7280] text-sm mt-1">{today}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Patients"
          value={loading ? '—' : stats?.totalPatients ?? 0}
          href="/admin/patients"
          color="bg-[#eff6ff]"
          icon={<svg className="w-6 h-6 text-[#0f4c81]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard
          label="Appointments Today"
          value={loading ? '—' : stats?.appointmentsToday ?? 0}
          href="/admin/appointments"
          color="bg-[#fef3c7]"
          icon={<svg className="w-6 h-6 text-[#d97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
        <StatCard
          label="Total Doctors"
          value={loading ? '—' : stats?.totalDoctors ?? 10}
          href="/admin/doctors"
          color="bg-[#d1fae5]"
          icon={<svg className="w-6 h-6 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
        />
        <StatCard
          label="Total Revenue"
          value={loading ? '—' : `₹${(stats?.totalRevenue ?? 0).toLocaleString()}`}
          color="bg-[#fce7f3]"
          icon={<svg className="w-6 h-6 text-[#db2777]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { href: '/admin/doctors', label: 'Add Doctor', icon: '👨‍⚕️' },
          { href: '/admin/appointments', label: 'View Appointments', icon: '📅' },
          { href: '/admin/blogs', label: 'Write Article', icon: '✍️' },
          { href: '/admin/packages', label: 'Manage Packages', icon: '📦' },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">{action.icon}</div>
            <p className="text-sm font-medium text-[#374151] group-hover:text-[#0f4c81] transition-colors">{action.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-[#e2e8f0]">
          <h2 className="font-bold text-lg text-[#1a1a2e] font-[var(--font-heading)]">Recent Appointments</h2>
          <Link href="/admin/appointments" className="text-sm text-[#0f4c81] font-medium hover:underline">View all →</Link>
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
