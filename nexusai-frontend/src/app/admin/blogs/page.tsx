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
import { StatusBadge } from '@/components/ui/StatusBadge';
import { blogsApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { BLOG_CATEGORIES } from '@/constants';

const schema = z.object({
  title: z.string().min(5),
  excerpt: z.string().min(10),
  content: z.string().min(20),
  author: z.string().min(2),
  category: z.string().min(1),
  status: z.enum(['published', 'draft']),
  readTime: z.number().min(1),
  tags: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { status: 'draft', readTime: 5 } });

  const fetchData = () => {
    setLoading(true);
    blogsApi.getAll().then(setBlogs).finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditing(null); reset({ status: 'draft', readTime: 5 }); setModalOpen(true); };
  const openEdit = (blog: any) => {
    setEditing(blog);
    reset({ title: blog.title, excerpt: blog.excerpt, content: blog.content, author: blog.author, category: blog.category, status: blog.status, readTime: blog.readTime, tags: blog.tags?.join(', ') });
    setModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const payload = { ...data, tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [] };
      if (editing) { await blogsApi.update(editing.id, payload); toast.success('Blog updated'); }
      else { await blogsApi.create(payload); toast.success('Blog created'); }
      setModalOpen(false);
      fetchData();
    } catch { toast.error('Operation failed'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await blogsApi.delete(deleteId); toast.success('Blog deleted'); setDeleteId(null); fetchData(); }
    catch { toast.error('Failed to delete'); }
    finally { setDeleting(false); }
  };

  const columns: Column<any>[] = [
    { key: 'title', header: 'Title', render: (v: any, row: any) => (
      <div><p className="font-medium text-[#1a1a2e] line-clamp-1">{v as string}</p><p className="text-xs text-[#9ca3af]">{row.author}</p></div>
    )},
    { key: 'category', header: 'Category' },
    { key: 'status', header: 'Status', render: (v: any) => <StatusBadge status={v as string} /> },
    { key: 'readTime', header: 'Read Time', render: (v: any) => `${v} min` },
    { key: 'publishedAt', header: 'Published', render: (v: any) => v ? formatDate(v as string, { day: 'numeric', month: 'short' }) : '—' },
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
          <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[#1a1a2e]">Blog Posts</h1>
          <p className="text-[#6b7280] text-sm">{blogs.length} articles</p>
        </div>
        <Button onClick={openAdd}>+ New Article</Button>
      </div>
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm">
        <DataTable columns={columns} data={blogs} keyField="id" loading={loading} className="border-0" />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Article' : 'New Article'} size="xl"
        footer={<><Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit(onSubmit)} loading={submitting}>{editing ? 'Save' : 'Publish'}</Button></>}>
        <form className="space-y-5">
          <Input label="Title" {...register('title')} error={errors.title?.message} required />
          <div className="grid grid-cols-3 gap-4">
            <Input label="Author" {...register('author')} error={errors.author?.message} required />
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Category</label>
              <select {...register('category')} className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:outline-none focus:border-[#0f4c81]">
                <option value="">Select category</option>
                {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Status</label>
              <select {...register('status')} className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:outline-none focus:border-[#0f4c81]">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Excerpt</label>
            <textarea {...register('excerpt')} rows={2} className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:outline-none focus:border-[#0f4c81] resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Content (Markdown supported)</label>
            <textarea {...register('content')} rows={12} className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:outline-none focus:border-[#0f4c81] resize-none font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Read Time (min)" type="number" {...register('readTime', { valueAsNumber: true })} />
            <Input label="Tags (comma-separated)" {...register('tags')} placeholder="health, cardiology, tips" />
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Article" message="Are you sure you want to delete this article? This cannot be undone." loading={deleting} />
    </div>
  );
}
