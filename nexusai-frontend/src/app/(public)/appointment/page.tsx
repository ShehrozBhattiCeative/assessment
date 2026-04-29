'use client';

import { Suspense, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { DoctorCard } from '@/components/ui/DoctorCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { doctorsApi, appointmentsApi } from '@/lib/api';
import { APPOINTMENT_TIMES } from '@/constants';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';

const schema = z.object({
  patientName: z.string().min(2, 'Name required'),
  patientEmail: z.string().email('Valid email required'),
  patientPhone: z.string().min(10, 'Phone required'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
  borderRadius: 8, fontSize: 14, color: 'var(--text-primary)',
  outline: 'none',
};

function AppointmentContent() {
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { patientName: user?.name || '', patientEmail: '' },
  });

  useEffect(() => {
    doctorsApi.getAll().then(setDoctors);
    const docId = searchParams.get('doctor');
    if (docId) {
      doctorsApi.getOne(docId).then((doc) => { setSelectedDoctor(doc); setStep(2); });
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setValue('patientName', user.name || '');
      setValue('patientEmail', user.email || '');
    }
  }, [user, setValue]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const onSubmit = async (data: FormData) => {
    if (!isAuthenticated) { toast.error('Please login to book an appointment'); router.push('/login'); return; }
    if (!selectedDoctor || !selectedDate || !selectedTime) { toast.error('Please complete all steps'); return; }
    setLoading(true);
    try {
      await appointmentsApi.create({
        ...data,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: selectedDate,
        time: selectedTime,
        fee: selectedDoctor.fee,
      });
      toast.success('Appointment booked successfully!');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Select Doctor' },
    { num: 2, label: 'Date & Time' },
    { num: 3, label: 'Your Details' },
  ];

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <PageHeader
        breadcrumb="Appointment"
        heading="Book an appointment."
        subtitle="Complete 3 simple steps to schedule your consultation."
      />

      {/* Progress Steps */}
      <div style={{
        background: 'var(--bg-nav)', borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '16px 0', position: 'sticky', top: 68, zIndex: 40,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700,
                  background: step >= s.num ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                  color: '#fff',
                }}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span style={{
                  fontSize: 14, fontWeight: 500,
                  color: step >= s.num ? '#fff' : 'rgba(255,255,255,0.4)',
                }}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 48, height: 2, background: step > s.num ? 'var(--accent)' : 'rgba(255,255,255,0.15)' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        {/* Step 1: Select Doctor */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>Choose Your Doctor</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => { setSelectedDoctor(doc); setStep(2); }}
                  style={{
                    cursor: 'pointer', borderRadius: 'var(--radius)',
                    border: selectedDoctor?.id === doc.id ? '2px solid var(--accent)' : '2px solid transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  <DoctorCard doctor={doc} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && selectedDoctor && (
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>
              Date & Time for {selectedDoctor.name}
            </h2>
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: 36,
            }}>
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
                  Select Date <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="date"
                  min={minDate}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ ...inputStyle }}
                  className="input-base"
                />
              </div>

              {selectedDate && (
                <div style={{ marginBottom: 28 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: 12 }}>
                    Select Time Slot <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                    {APPOINTMENT_TIMES.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        style={{
                          padding: '10px 8px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                          background: selectedTime === time ? 'var(--accent)' : 'var(--bg-secondary)',
                          color: selectedTime === time ? '#fff' : 'var(--text-primary)',
                          border: `1px solid ${selectedTime === time ? 'var(--accent)' : 'var(--border)'}`,
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 12 }}>
                    Bookings available 8:00 AM – 10:00 PM. For outside-hours emergencies, our 24/7 ambulance service is always available.
                  </p>
                </div>
              )}

              {selectedDoctor.availability?.length > 0 && (
                <div style={{ background: 'var(--accent-light)', borderRadius: 10, padding: '16px 20px', marginBottom: 28 }}>
                  <p style={{ fontWeight: 600, color: 'var(--accent)', marginBottom: 10, fontSize: 13 }}>Doctor Availability</p>
                  {selectedDoctor.availability.map((slot: any) => (
                    <div key={slot.day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{slot.day}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{slot.startTime} – {slot.endTime}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    padding: '12px 24px', borderRadius: 'var(--radius-btn)', fontWeight: 600, fontSize: 14,
                    background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer',
                  }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => { if (!selectedDate || !selectedTime) { toast.error('Please select date and time'); return; } setStep(3); }}
                  style={{
                    flex: 1, padding: '12px', borderRadius: 'var(--radius-btn)', fontWeight: 600, fontSize: 14,
                    background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer',
                  }}
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Patient Info */}
        {step === 3 && (
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>Your Information</h2>

            {!isAuthenticated && (
              <div style={{
                marginBottom: 20, padding: '14px 18px',
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.35)',
                borderRadius: 10, fontSize: 14, color: 'var(--text-primary)',
              }}>
                <strong>Login required</strong> —{' '}
                <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Login</Link> or{' '}
                <Link href="/register" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>register</Link> to complete booking.
              </div>
            )}

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 36 }}>
              {/* Summary */}
              <div style={{ background: 'var(--accent-light)', borderRadius: 10, padding: '18px 20px', marginBottom: 28 }}>
                <p style={{ fontWeight: 600, color: 'var(--accent)', marginBottom: 12, fontSize: 13 }}>Appointment Summary</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13 }}>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Doctor: </span><span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{selectedDoctor?.name}</span></div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Specialty: </span><span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{selectedDoctor?.specialty}</span></div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Date: </span><span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{selectedDate}</span></div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Time: </span><span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{selectedTime}</span></div>
                  <div style={{ gridColumn: '1/-1' }}><span style={{ color: 'var(--text-secondary)' }}>Fee: </span><span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 16 }}>₹{selectedDoctor?.fee}</span></div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input type="text" {...register('patientName')} style={inputStyle} className="input-base" placeholder="Your full name" />
                  {errors.patientName && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.patientName.message}</p>}
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                    Email Address <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input type="email" {...register('patientEmail')} style={inputStyle} className="input-base" placeholder="your@email.com" />
                  {errors.patientEmail && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.patientEmail.message}</p>}
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                    Phone Number <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input type="tel" {...register('patientPhone')} style={inputStyle} className="input-base" placeholder="+91 XXXXX XXXXX" />
                  {errors.patientPhone && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.patientPhone.message}</p>}
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                    Notes (optional)
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    placeholder="Symptoms, previous records, or any other information…"
                    style={{ ...inputStyle, resize: 'none' }}
                    className="input-base"
                  />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    style={{
                      padding: '12px 24px', borderRadius: 'var(--radius-btn)', fontWeight: 600, fontSize: 14,
                      background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer',
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 1, padding: '12px', borderRadius: 'var(--radius-btn)', fontWeight: 600, fontSize: 14,
                      background: loading ? 'var(--text-secondary)' : 'var(--accent)',
                      color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {loading ? 'Booking…' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AppointmentPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    }>
      <AppointmentContent />
    </Suspense>
  );
}
