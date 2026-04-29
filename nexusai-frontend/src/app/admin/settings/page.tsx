'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth.store';
import { HOSPITAL_INFO } from '@/constants';

const pwSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type PwForm = z.infer<typeof pwSchema>;

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'hospital' | 'seo' | 'password'>('hospital');
  const { user } = useAuthStore();
  const [saving, setSaving] = useState(false);

  const [hospitalInfo, setHospitalInfo] = useState({ ...HOSPITAL_INFO });

  const { register: regPw, handleSubmit: handlePw, formState: { errors: pwErrors }, reset: resetPw } = useForm<PwForm>({ resolver: zodResolver(pwSchema) });

  const handleSaveHospital = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Hospital information saved');
    setSaving(false);
  };

  const handlePasswordChange = async (data: PwForm) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Password updated successfully');
    resetPw();
    setSaving(false);
  };

  const tabs = [
    { id: 'hospital', label: 'Hospital Info' },
    { id: 'seo', label: 'SEO Settings' },
    { id: 'password', label: 'Change Password' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-[#1a1a2e]">Settings</h1>
        <p className="text-[#6b7280] text-sm">Manage hospital and account settings</p>
      </div>

      <div className="flex gap-2 border-b border-[#e2e8f0]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-[#0f4c81] text-[#0f4c81]' : 'border-transparent text-[#6b7280] hover:text-[#374151]'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'hospital' && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-8 max-w-2xl">
          <h2 className="text-lg font-bold text-[#1a1a2e] mb-6">Hospital Information</h2>
          <div className="space-y-5">
            <Input label="Hospital Name" value={hospitalInfo.name} onChange={(e) => setHospitalInfo({ ...hospitalInfo, name: e.target.value })} />
            <Input label="Address" value={hospitalInfo.address} onChange={(e) => setHospitalInfo({ ...hospitalInfo, address: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Phone" value={hospitalInfo.phone} onChange={(e) => setHospitalInfo({ ...hospitalInfo, phone: e.target.value })} />
              <Input label="Emergency" value={hospitalInfo.emergency} onChange={(e) => setHospitalInfo({ ...hospitalInfo, emergency: e.target.value })} />
            </div>
            <Input label="Email" type="email" value={hospitalInfo.email} onChange={(e) => setHospitalInfo({ ...hospitalInfo, email: e.target.value })} />
            <Input label="Hours" value={hospitalInfo.hours} onChange={(e) => setHospitalInfo({ ...hospitalInfo, hours: e.target.value })} />
            <Button onClick={handleSaveHospital} loading={saving}>Save Changes</Button>
          </div>
        </div>
      )}

      {activeTab === 'seo' && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-8 max-w-2xl">
          <h2 className="text-lg font-bold text-[#1a1a2e] mb-6">SEO Settings</h2>
          <div className="space-y-5">
            <Input label="Site Title" defaultValue="Unity Hospital — Healthcare, Reimagined" />
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Meta Description</label>
              <textarea rows={3} defaultValue="Unity Hospital brings together 45+ super-specialities, 300+ beds and an ensemble of experienced clinicians." className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm focus:outline-none focus:border-[#0f4c81] resize-none" />
            </div>
            <Input label="Keywords" defaultValue="hospital, healthcare, doctors, appointments, Mumbai, NABH" />
            <Button onClick={() => toast.success('SEO settings saved')} loading={saving}>Save SEO Settings</Button>
          </div>
        </div>
      )}

      {activeTab === 'password' && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-8 max-w-md">
          <h2 className="text-lg font-bold text-[#1a1a2e] mb-2">Change Password</h2>
          <p className="text-[#6b7280] text-sm mb-6">Logged in as: <strong>{user?.email}</strong></p>
          <form onSubmit={handlePw(handlePasswordChange)} className="space-y-5">
            <Input label="Current Password" type="password" {...regPw('currentPassword')} error={pwErrors.currentPassword?.message} required />
            <Input label="New Password" type="password" {...regPw('newPassword')} error={pwErrors.newPassword?.message} required />
            <Input label="Confirm New Password" type="password" {...regPw('confirmPassword')} error={pwErrors.confirmPassword?.message} required />
            <Button type="submit" loading={saving}>Update Password</Button>
          </form>
        </div>
      )}
    </div>
  );
}
