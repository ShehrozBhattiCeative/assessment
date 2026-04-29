'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api';
import { Eye, EyeOff } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  dateOfBirth: z.string().optional(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await authApi.register({ name: data.name, email: data.email, password: data.password, phone: data.phone });
      toast.success('Account created! Please login.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[#1a1a2e] mb-2">Create Account</h1>
          <p className="text-[#6b7280]">Register as a patient to book appointments</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input label="Full Name" placeholder="Jane Doe" {...register('name')} error={errors.name?.message} required />
          <Input label="Email Address" type="email" placeholder="you@example.com" {...register('email')} error={errors.email?.message} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" type="tel" placeholder="+91-" {...register('phone')} />
            <Input label="Date of Birth" type="date" {...register('dateOfBirth')} />
          </div>
          <Select
            label="Gender"
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ]}
            placeholder="Select gender"
            {...register('gender')}
          />
          <Input
            label="Password"
            type={showPass ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            {...register('password')}
            error={errors.password?.message}
            required
            rightIcon={showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            onRightIconClick={() => setShowPass(!showPass)}
          />
          <Input
            label="Confirm Password"
            type={showPass ? 'text' : 'password'}
            placeholder="Repeat password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            required
          />
          <Button type="submit" fullWidth size="lg" loading={loading}>Create Account</Button>
        </form>

        <p className="text-center text-[#6b7280] text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#0f4c81] font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
      <p className="text-center text-white/60 text-sm mt-6">
        <Link href="/" className="hover:text-white transition-colors">← Back to Home</Link>
      </p>
    </div>
  );
}
