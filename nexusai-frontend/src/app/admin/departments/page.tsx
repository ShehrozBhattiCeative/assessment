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
import { departmentsApi } from '@/lib/api';

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  icon: z.string().optional(),
  doctorCount: z.number().min(0),
});
type FormData = z.infer<typeof schema>;

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { doctorCount: 0 } });

  const fetchData = () => { setLoading(true); departmentsApi.getAll().then(setDepartments).finally(() => setLoading(false)); };
  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditing(null); reset({ doctorCount: 0 }); setModalOpen(true); };
  const openEdit = (dept: any) => { setEditing(dept); reset({ name: dept.name, description: dept.description, icon: dept.icon, doctorCount: dept.doctorCount }); setModalOpen(true); };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (editing) { await departmentsApi.update(editing.id, { ...data, slug }); toast.success('Department updated'); }
      else { await departmentsApi.create({ ...data, slug }); toast.success('Department added'); }
      setModalOpen(false); fetchData();
    } catch { toast.error('Operation failed'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await departmentsApi.delete(deleteId); toast.success('Department deleted'); setDeleteId(null); fetchData(); }
    catch { toast.error('Failed to delete'); }
    finally { setDeleting(false); }
  };

  const columns: Column<any>[] = [
    { key: 'name', header: 'Department', render: (v: any) => <span className="font-medium text-[#1a1a2e]">{v as string}</span> },
    { key: 'doctorCount', header: 'Doctors', render: (v: any) => `${v} specialists` },
    { key: 'description', header: 'Description', render: (v: any) => <span className="text-[#6b7280] text-xs line-clamp-1">{v as string}</span>, className: 'max-w-xs' },
    { key: 'id', header: 'Actions', render: (_: any, row: any) => (
      <div className="flex gap-2">
        <Button size="xs" variant="secondary" onClick={(e) => { e.stopPropagation(); openEdit(row); }}>Edit</Button>
        <Button size="xs" variant="danger" onClick={(e) => { e.stopPropagation(); setDeleteId(row.id); }}>Delete</Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[#1a1a2e]">Departments</h1>
          <p className="text-[#6b7280] text-sm">{departments.length} departments</p>
        </div>
        <Button onClick={openAdd}>+ Add Department</Button>
      </div>
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm">
        <DataTable columns={columns} data={departments} keyField="id" loading={loading} className="border-0" />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Department' : 'Add Department'} size="md"
        footer={<><Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit(onSubmit)} loading={submitting}>{editing ? 'Save' : 'Add'}</Button></>}>
        <form className="space-y-4">
          <Input label="Department Name" {...register('name')} error={errors.name?.message} required />
          <Input label="Doctor Count" type="number" {...register('doctorCount', { valueAsNumber: true })} />
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Description</label>
            <textarea {...register('description')} rows={4} className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:outline-none focus:border-[#0f4c81] resize-none" />
            {errors.description && <p className="text-xs text-[#ef4444] mt-1">{errors.description.message}</p>}
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Department" message="Delete this department? This action cannot be undone." loading={deleting} />
    </div>
  );
}
