'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { appointmentsApi } from '@/lib/api';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/lib/utils';
import { APPOINTMENT_STATUSES } from '@/constants';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApt, setSelectedApt] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  const fetchData = () => {
    setLoading(true);
    appointmentsApi.getAll(statusFilter ? { status: statusFilter } : undefined)
      .then(setAppointments)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [statusFilter]);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(true);
    try {
      await appointmentsApi.updateStatus(id, status);
      toast.success('Status updated');
      setSelectedApt(null);
      fetchData();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const columns: Column<any>[] = [
    { key: 'id', header: 'ID', render: (v: any) => <span className="text-xs text-[#9ca3af] font-mono">{(v as string).slice(0, 10)}</span> },
    { key: 'patientName', header: 'Patient', render: (v: any, row: any) => (
      <div className="flex items-center gap-3">
        <Avatar name={v as string} size="sm" />
        <div><p className="font-medium text-[#1a1a2e]">{v as string}</p><p className="text-xs text-[#9ca3af]">{row.patientEmail}</p></div>
      </div>
    )},
    { key: 'doctorName', header: 'Doctor', render: (v: any, row: any) => (
      <div className="flex items-center gap-3">
        <Avatar name={v as string} size="sm" />
        <div><p className="font-medium text-[#1a1a2e]">{v as string}</p><p className="text-xs text-[#9ca3af]">{row.specialty}</p></div>
      </div>
    )},
    { key: 'date', header: 'Date & Time', render: (v: any, row: any) => (
      <div><p className="text-[#374151]">{formatDate(v as string, { day: 'numeric', month: 'short' })}</p><p className="text-xs text-[#9ca3af]">{row.time}</p></div>
    )},
    { key: 'status', header: 'Status', render: (v: any) => <StatusBadge status={v as string} /> },
    { key: 'fee', header: 'Fee', render: (v: any) => <span className="font-semibold text-[#0f4c81]">₹{(v as number).toLocaleString()}</span> },
    { key: 'id', header: 'Actions', render: (_: any, row: any) => (
      <Button size="xs" variant="ghost" onClick={(e) => { e.stopPropagation(); setSelectedApt(row); }}>
        Manage
      </Button>
    )},
  ];

  const statusOptions = [{ value: '', label: 'All Statuses' }, ...APPOINTMENT_STATUSES];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[#1a1a2e]">Appointments</h1>
          <p className="text-[#6b7280] text-sm">{appointments.length} total appointments</p>
        </div>
        <div className="w-48">
          <Select options={statusOptions} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm">
        <DataTable columns={columns} data={appointments} keyField="id" loading={loading} emptyMessage="No appointments found" className="border-0" />
      </div>

      {/* Appointment Detail Modal */}
      <Modal isOpen={!!selectedApt} onClose={() => setSelectedApt(null)} title="Manage Appointment" size="md">
        {selectedApt && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Patient', selectedApt.patientName],
                ['Email', selectedApt.patientEmail],
                ['Phone', selectedApt.patientPhone],
                ['Doctor', selectedApt.doctorName],
                ['Specialty', selectedApt.specialty],
                ['Date', selectedApt.date],
                ['Time', selectedApt.time],
                ['Fee', `₹${selectedApt.fee?.toLocaleString()}`],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <p className="text-[#9ca3af] text-xs">{label}</p>
                  <p className="font-medium text-[#374151]">{value}</p>
                </div>
              ))}
            </div>
            {selectedApt.notes && (
              <div>
                <p className="text-[#9ca3af] text-xs mb-1">Notes</p>
                <p className="text-sm text-[#374151] bg-[#f8fafc] p-3 rounded-xl">{selectedApt.notes}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-[#374151] mb-3">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {APPOINTMENT_STATUSES.map((s) => (
                  <Button
                    key={s.value}
                    size="sm"
                    variant={selectedApt.status === s.value ? 'primary' : 'ghost'}
                    onClick={() => handleStatusChange(selectedApt.id, s.value)}
                    loading={updating}
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
