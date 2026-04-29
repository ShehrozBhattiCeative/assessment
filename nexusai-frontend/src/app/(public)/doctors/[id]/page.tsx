'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { doctorsApi } from '@/lib/api';

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorsApi.getOne(id).then(setDoctor).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#0f4c81] border-t-transparent" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-bold text-[#1a1a2e]">Doctor not found</p>
        <Link href="/doctors"><Button>Back to Doctors</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#0a3560] to-[#0f4c81] text-white py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl shrink-0">
              <Avatar src={doctor.image} name={doctor.name} size="2xl" shape="square" className="w-full h-full" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold font-[var(--font-heading)] mb-2">{doctor.name}</h1>
              <p className="text-[#e8734a] font-semibold text-lg mb-2">{doctor.specialty}</p>
              <p className="text-white/70 mb-4">{doctor.qualification}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="px-4 py-2 bg-white/10 rounded-full text-sm">{doctor.experience}+ Years Experience</span>
                <span className="px-4 py-2 bg-white/10 rounded-full text-sm">⭐ {doctor.rating} Rating</span>
                <span className="px-4 py-2 bg-white/10 rounded-full text-sm">{doctor.totalPatients?.toLocaleString()}+ Patients</span>
                <span className="px-4 py-2 bg-[#e8734a]/20 rounded-full text-sm font-semibold">₹{doctor.fee} Consult Fee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-6 py-16 grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl p-8 border border-[#e2e8f0] shadow-sm">
            <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[#1a1a2e] mb-4">About Dr. {doctor.name.split(' ').slice(1).join(' ')}</h2>
            <p className="text-[#6b7280] leading-relaxed">{doctor.bio}</p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-[#e2e8f0] shadow-sm">
            <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[#1a1a2e] mb-6">Qualifications</h2>
            <div className="flex flex-wrap gap-2">
              {doctor.qualification.split(' · ').map((q: string) => (
                <span key={q} className="px-4 py-2 bg-[#eff6ff] text-[#0f4c81] rounded-full text-sm font-medium border border-[#bfdbfe]">
                  {q}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm">
            <h3 className="font-bold text-[#1a1a2e] mb-4 font-[var(--font-heading)]">Availability</h3>
            <div className="space-y-3">
              {doctor.availability?.map((slot: any) => (
                <div key={slot.day} className="flex items-center justify-between py-2 border-b border-[#f1f5f9] last:border-0">
                  <span className="font-medium text-sm text-[#374151]">{slot.day}</span>
                  <span className="text-xs text-[#6b7280] bg-[#f0f7ff] px-3 py-1 rounded-full">{slot.startTime} – {slot.endTime}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0f4c81] to-[#1a6bb5] rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-2 font-[var(--font-heading)]">Book an Appointment</h3>
            <p className="text-white/70 text-sm mb-5">Consultation fee: <span className="text-[#e8734a] font-bold text-xl">₹{doctor.fee}</span></p>
            <Link href={`/appointment?doctor=${doctor.id}`}>
              <Button variant="accent" fullWidth size="lg">Book Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
