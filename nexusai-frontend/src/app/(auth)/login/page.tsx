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
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[#1a1a2e] mb-2">Welcome Back</h1>
          <p className="text-[#6b7280]">Sign in to your Unity Hospital account</p>
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

          <Button type="submit" fullWidth size="lg" loading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <p className="text-[#6b7280] text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#0f4c81] font-semibold hover:underline">
              Register as Patient
            </Link>
          </p>
          <div className="pt-4 border-t border-[#e2e8f0]">
            <p className="text-xs text-[#9ca3af] mb-2">Demo credentials:</p>
            <p className="text-xs text-[#6b7280]">Admin: admin@nexusai.com</p>
            <p className="text-xs text-[#6b7280]">Patient: aditi.sharma@email.com</p>
            <p className="text-xs text-[#6b7280]">Password: <span className="font-mono">password123</span> (hashed in DB)</p>
          </div>
        </div>
      </div>

      <p className="text-center text-white/60 text-sm mt-6">
        <Link href="/" className="hover:text-white transition-colors">← Back to Home</Link>
      </p>
    </div>
  );
}
