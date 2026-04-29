'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { doctorsApi, departmentsApi } from '@/lib/api';

const schema = z.object({
  name: z.string().min(2),
  specialty: z.string().min(2),
  qualification: z.string().min(2),
  bio: z.string().min(10),
  fee: z.number().min(0),
  experience: z.number().min(0),
  departmentId: z.string().min(1),
});
type FormData = z.infer<typeof schema>;

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({ resolver: zodResolver(schema) });

  const fetchData = () => {
    setLoading(true);
    Promise.all([doctorsApi.getAll(), departmentsApi.getAll()]).then(([d, depts]) => {
      setDoctors(d);
      setDepartments(depts);
      setLoading(false);
    });
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditingDoctor(null); reset(); setModalOpen(true); };
  const openEdit = (doc: any) => {
    setEditingDoctor(doc);
    reset({ name: doc.name, specialty: doc.specialty, qualification: doc.qualification, bio: doc.bio, fee: doc.fee, experience: doc.experience, departmentId: doc.departmentId });
    setModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      if (editingDoctor) {
        await doctorsApi.update(editingDoctor.id, data);
        toast.success('Doctor updated');
      } else {
        await doctorsApi.create(data);
        toast.success('Doctor added');
      }
      setModalOpen(false);
      fetchData();
    } catch {
      toast.error('Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await doctorsApi.delete(deleteId);
      toast.success('Doctor removed');
      setDeleteId(null);
      fetchData();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = doctors.filter((d) =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<any>[] = [
    { key: 'name', header: 'Doctor', render: (v: any, row: any) => (
      <div className="flex items-center gap-3">
        <Avatar src={row.image} name={row.name} size="sm" shape="circle" />
        <div><p className="font-medium text-[#1a1a2e]">{v as string}</p><p className="text-xs text-[#9ca3af]">{row.qualification.split(' · ')[0]}</p></div>
      </div>
    )},
    { key: 'specialty', header: 'Specialty', render: (v: any) => <Badge variant="primary" size="sm">{v as string}</Badge> },
    { key: 'experience', header: 'Exp.', render: (v: any) => `${v}+ yrs` },
    { key: 'fee', header: 'Fee', render: (v: any) => `₹${(v as number).toLocaleString()}` },
    { key: 'rating', header: 'Rating', render: (v: any) => `⭐ ${v}` },
    { key: 'id', header: 'Actions', render: (_: any, row: any) => (
      <div className="flex gap-2">
        <Button size="xs" variant="secondary" onClick={(e) => { e.stopPropagation(); openEdit(row); }}>Edit</Button>
        <Button size="xs" variant="danger" onClick={(e) => { e.stopPropagation(); setDeleteId(row.id); }}>Delete</Button>
      </div>
    )},
  ];

  const deptOptions = departments.map((d) => ({ value: d.id, label: d.name }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[#1a1a2e]">Doctors</h1>
          <p className="text-[#6b7280] text-sm">{doctors.length} doctors registered</p>
        </div>
        <Button onClick={openAdd} leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}>
          Add Doctor
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div className="p-4 border-b border-[#e2e8f0]">
          <input
            placeholder="Search doctors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xs rounded-xl border border-[#e2e8f0] px-4 py-2 text-sm focus:outline-none focus:border-[#0f4c81]"
          />
        </div>
        <DataTable columns={columns} data={filtered} keyField="id" loading={loading} className="border-0" />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)} loading={submitting}>
              {editingDoctor ? 'Save Changes' : 'Add Doctor'}
            </Button>
          </>
        }
      >
        <form className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" {...register('name')} error={errors.name?.message} required />
            <Input label="Specialty" {...register('specialty')} error={errors.specialty?.message} required />
          </div>
          <Input label="Qualifications" {...register('qualification')} error={errors.qualification?.message} required placeholder="MBBS · MD · DM" />
          <div className="grid grid-cols-3 gap-4">
            <Input label="Fee (₹)" type="number" {...register('fee', { valueAsNumber: true })} error={errors.fee?.message} required />
            <Input label="Experience (yrs)" type="number" {...register('experience', { valueAsNumber: true })} error={errors.experience?.message} required />
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Department <span className="text-[#ef4444]">*</span></label>
              <select {...register('departmentId')} className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:outline-none focus:border-[#0f4c81]">
                <option value="">Select department</option>
                {deptOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {errors.departmentId && <p className="text-xs text-[#ef4444] mt-1">{errors.departmentId.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Bio <span className="text-[#ef4444]">*</span></label>
            <textarea {...register('bio')} rows={4} className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:outline-none focus:border-[#0f4c81] resize-none" />
            {errors.bio && <p className="text-xs text-[#ef4444] mt-1">{errors.bio.message}</p>}
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Doctor"
        message="Are you sure you want to remove this doctor? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
}
