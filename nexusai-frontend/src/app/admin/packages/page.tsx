'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { packagesApi } from '@/lib/api';

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPkg, setEditingPkg] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = () => {
    setLoading(true);
    packagesApi.getAllAdmin().then(setPackages).finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

  const handleUpdate = async () => {
    if (!editingPkg) return;
    setSubmitting(true);
    try {
      await packagesApi.update(editingPkg.id, editingPkg);
      toast.success('Package updated');
      setEditingPkg(null);
      fetchData();
    } catch { toast.error('Failed to update'); }
    finally { setSubmitting(false); }
  };

  const handleToggle = async (pkg: any) => {
    try {
      await packagesApi.update(pkg.id, { isActive: !pkg.isActive });
      toast.success(`Package ${pkg.isActive ? 'deactivated' : 'activated'}`);
      fetchData();
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await packagesApi.delete(deleteId);
      toast.success('Package deleted');
      setDeleteId(null);
      fetchData();
    } catch { toast.error('Failed to delete'); }
  };

  const tierColors: Record<string, string> = {
    basic: 'from-gray-500 to-gray-700',
    gold: 'from-yellow-600 to-yellow-800',
    'happy-heart': 'from-red-500 to-red-700',
    platinum: 'from-purple-600 to-purple-800',
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-2 border-[#0f4c81] border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[#1a1a2e]">Health Packages</h1>
        <p className="text-[#6b7280] text-sm">Manage wellness packages and pricing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className={`rounded-2xl overflow-hidden border-2 ${pkg.isActive ? 'border-[#e2e8f0]' : 'border-[#e2e8f0] opacity-60'}`}>
            <div className={`bg-gradient-to-br p-6 text-white ${tierColors[pkg.tier] || 'from-[#0f4c81] to-[#0a3560]'}`}>
              <p className="text-sm uppercase tracking-wider opacity-80 mb-1">{pkg.tier.replace('-', ' ')}</p>
              <h3 className="text-xl font-bold font-[var(--font-heading)]">{pkg.name}</h3>
              <p className="text-3xl font-bold mt-2">₹{pkg.price.toLocaleString()}</p>
            </div>
            <div className="bg-white p-5">
              <div className="flex gap-2 mb-4">
                {pkg.isPopular && <Badge variant="accent" size="sm">Popular</Badge>}
                <Badge variant={pkg.isActive ? 'success' : 'neutral'} size="sm">{pkg.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
              <p className="text-xs text-[#6b7280] mb-4">{pkg.tests?.length} tests included</p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" fullWidth onClick={() => setEditingPkg({ ...pkg })}>Edit</Button>
                <Button size="sm" variant={pkg.isActive ? 'ghost' : 'success'} onClick={() => handleToggle(pkg)}>
                  {pkg.isActive ? 'Disable' : 'Enable'}
                </Button>
              </div>
              <Button size="sm" variant="danger" fullWidth className="mt-2" onClick={() => setDeleteId(pkg.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!editingPkg} onClose={() => setEditingPkg(null)} title="Edit Package" size="md"
        footer={<><Button variant="ghost" onClick={() => setEditingPkg(null)}>Cancel</Button><Button onClick={handleUpdate} loading={submitting}>Save Changes</Button></>}>
        {editingPkg && (
          <div className="space-y-4">
            <Input label="Package Name" value={editingPkg.name} onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })} />
            <Input label="Price (₹)" type="number" value={editingPkg.price} onChange={(e) => setEditingPkg({ ...editingPkg, price: Number(e.target.value) })} />
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Description</label>
              <textarea rows={3} value={editingPkg.description} onChange={(e) => setEditingPkg({ ...editingPkg, description: e.target.value })} className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:outline-none focus:border-[#0f4c81] resize-none" />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editingPkg.isPopular} onChange={(e) => setEditingPkg({ ...editingPkg, isPopular: e.target.checked })} className="rounded" />
                <span className="text-sm">Mark as Popular</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editingPkg.isActive} onChange={(e) => setEditingPkg({ ...editingPkg, isActive: e.target.checked })} className="rounded" />
                <span className="text-sm">Active</span>
              </label>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Package" message="Delete this health package? This cannot be undone." />
    </div>
  );
}
