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
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.025em' }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Register as a patient to book appointments</p>
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
          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
            style={{
              background: 'var(--grad-primary)',
              color: '#04060c',
              borderRadius: '999px',
              border: 'none',
              fontWeight: 600,
            }}
          >
            Create Account
          </Button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14, marginTop: 24 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 24 }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
        >
          ← Back to Home
        </Link>
      </p>
    </div>
  );
}
