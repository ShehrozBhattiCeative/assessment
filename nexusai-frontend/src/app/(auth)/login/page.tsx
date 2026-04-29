'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth.store';
import { Eye, EyeOff } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      const user = useAuthStore.getState().user;
      toast.success(`Welcome back, ${user?.name?.split(' ')[0]}!`);
      router.push(user?.role === 'admin' ? '/admin' : '/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="w-full max-w-md">
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
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Sign in to your Unity Hospital account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            error={errors.email?.message}
            required
          />
          <Input
            label="Password"
            type={showPass ? 'text' : 'password'}
            placeholder="Your password"
            {...register('password')}
            error={errors.password?.message}
            required
            rightIcon={showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            onRightIconClick={() => setShowPass(!showPass)}
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isLoading}
            style={{
              background: 'var(--grad-primary)',
              color: '#04060c',
              borderRadius: '999px',
              border: 'none',
              fontWeight: 600,
            }}
          >
            Sign In
          </Button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Register as Patient
            </Link>
          </p>
          <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Demo credentials:</p>
            <div style={{ background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 10, padding: '12px 16px' }}>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>Admin: admin@nexusai.com</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>Patient: aditi.sharma@email.com</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Password: <span style={{ fontFamily: 'monospace' }}>password123</span> (hashed in DB)</p>
            </div>
          </div>
        </div>
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
