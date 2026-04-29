'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

const INFO_ITEMS = [
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: 'Address',
    value: 'Vaishnodevi Circle, SG Road, Ahmedabad, IN',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.18 1.17 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    label: 'Phone',
    value: '+91 88666 00555',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: 'Email',
    value: 'unityhospital@gmail.com',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    label: 'Hours',
    value: 'Mon–Sat · Open 24/7  /  Sunday · 4:00 AM – 11:00 PM',
  },
];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
  borderRadius: 8, fontSize: 14, color: 'var(--text-primary)',
  outline: 'none', transition: 'border-color 0.2s',
};

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (_data: FormData) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Message sent! We'll get back to you within an hour during working hours.");
    reset();
    setLoading(false);
  };

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <PageHeader
        breadcrumb="Contact"
        heading="Let's talk."
        subtitle="Have a question or need assistance? Our team is here for you."
      />

      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 56 }}>
          {/* Info Cards */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              {INFO_ITEMS.map((item) => (
                <div key={item.label} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 16,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: '20px 24px',
                }}>
                  <div style={{
                    width: 44, height: 44, background: 'var(--accent-light)',
                    borderRadius: 10, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: 15, color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.5 }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Badge */}
            <div style={{
              background: '#dc2626', borderRadius: 'var(--radius)',
              padding: '20px 24px',
            }}>
              <p style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 4 }}>
                Emergency · 24/7
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
                Ambulance on call — dial +91 88666 00555 for immediate assistance.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '40px 40px',
          }}>
            <h3 style={{ fontWeight: 700, fontSize: 22, color: 'var(--text-primary)', marginBottom: 8 }}>
              Send us a message
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>
              We typically respond within an hour during working hours.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                    Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input type="text" {...register('name')} placeholder="Your full name" style={inputStyle} className="input-base" />
                  {errors.name && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.name.message}</p>}
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                    Email <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input type="email" {...register('email')} placeholder="your@email.com" style={inputStyle} className="input-base" />
                  {errors.email && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                  Mobile
                </label>
                <input type="tel" {...register('phone')} placeholder="+91 XXXXX XXXXX" style={inputStyle} className="input-base" />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                  Subject <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input type="text" {...register('subject')} placeholder="How can we help?" style={inputStyle} className="input-base" />
                {errors.subject && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.subject.message}</p>}
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                  Message <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  {...register('message')}
                  rows={5}
                  placeholder="Tell us more about your inquiry…"
                  style={{ ...inputStyle, resize: 'none' }}
                  className="input-base"
                />
                {errors.message && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '13px', fontSize: 15, fontWeight: 600,
                  background: loading ? 'var(--text-secondary)' : 'var(--accent)',
                  color: '#fff', border: 'none', borderRadius: 'var(--radius-btn)',
                  cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
                }}
              >
                {loading ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
