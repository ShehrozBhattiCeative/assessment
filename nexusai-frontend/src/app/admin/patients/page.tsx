'use client';

import { useEffect, useState } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { usersApi, appointmentsApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [patientApts, setPatientApts] = useState<any[]>([]);

  useEffect(() => {
    usersApi.getAll({ role: 'patient' }).then(setPatients).finally(() => setLoading(false));
  }, []);

  const openDetail = async (patient: any) => {
    setSelected(patient);
    const apts = await appointmentsApi.getAll({ patientId: patient.id }).catch(() => []);
    setPatientApts(apts as any[]);
  };

  const columns: Column<any>[] = [
    { key: 'name', header: 'Patient', render: (v: any, row: any) => (
      <div className="flex items-center gap-3">
        <Avatar src={row.avatar} name={row.name} size="sm" />
        <div><p className="font-medium text-[#1a1a2e]">{v as string}</p><p className="text-xs text-[#9ca3af]">{row.email}</p></div>
      </div>
    )},
    { key: 'phone', header: 'Phone' },
    { key: 'bloodGroup', header: 'Blood Group', render: (v: any) => v ? <Badge variant="error" size="sm">{v as string}</Badge> : '—' },
    { key: 'gender', header: 'Gender', render: (v: any) => v ? (v as string).charAt(0).toUpperCase() + (v as string).slice(1) : '—' },
    { key: 'createdAt', header: 'Registered', render: (v: any) => formatDate(v as string, { day: 'numeric', month: 'short', year: 'numeric' }) },
    { key: 'isActive', header: 'Status', render: (v: any) => <Badge variant={v ? 'success' : 'neutral'} size="sm">{v ? 'Active' : 'Inactive'}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[#1a1a2e]">Patients</h1>
        <p className="text-[#6b7280] text-sm">{patients.length} registered patients</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm">
        <DataTable columns={columns} data={patients} keyField="id" loading={loading} onRowClick={openDetail} className="border-0" />
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Patient Details" size="lg">
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar src={selected.avatar} name={selected.name} size="xl" />
              <div>
                <h3 className="text-xl font-bold text-[#1a1a2e]">{selected.name}</h3>
                <p className="text-[#6b7280]">{selected.email}</p>
                <p className="text-[#6b7280] text-sm">{selected.phone}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Date of Birth', selected.dateOfBirth || '—'],
                ['Gender', selected.gender || '—'],
                ['Blood Group', selected.bloodGroup || '—'],
                ['Address', selected.address || '—'],
              ].map(([label, value]) => (
                <div key={label as string} className="bg-[#f8fafc] p-3 rounded-xl">
                  <p className="text-xs text-[#9ca3af] mb-1">{label}</p>
                  <p className="font-medium text-[#374151]">{value}</p>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-bold text-[#1a1a2e] mb-3">Appointment History ({patientApts.length})</h4>
              {patientApts.length === 0 ? (
                <p className="text-[#9ca3af] text-sm">No appointments found</p>
              ) : (
                <div className="space-y-2">
                  {patientApts.slice(0, 5).map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-xl text-sm">
                      <div>
                        <p className="font-medium text-[#374151]">{apt.doctorName}</p>
                        <p className="text-xs text-[#9ca3af]">{apt.specialty} · {apt.date} {apt.time}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${apt.status === 'completed' ? 'bg-[#d1fae5] text-[#065f46]' : apt.status === 'confirmed' ? 'bg-[#dbeafe] text-[#1e40af]' : apt.status === 'cancelled' ? 'bg-[#fee2e2] text-[#991b1b]' : 'bg-[#fef3c7] text-[#92400e]'}`}>
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
