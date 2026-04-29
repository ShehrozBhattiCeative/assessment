'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { departmentsApi } from '@/lib/api';

const DEPT_ICONS: Record<string, string> = {
  'Paediatrics': '👶', 'Neurology': '🧠', 'General Surgery': '🔬', 'Dermatology': '✨',
  'Cardiology': '❤️', 'Orthopaedics': '🦴', 'Nephrology & Urology': '💧', 'Nutrition & Dietetics': '🥗',
  'Gastroenterology': '🫀', 'Obstetrics & Gynaecology': '🌸', 'Oncology': '🎗️', 'Pulmonology': '🫁',
  'Endocrinology': '⚗️', 'Ophthalmology': '👁️', 'ENT (Ear, Nose & Throat)': '👂',
  'Psychiatry & Mental Health': '🧘', 'Rheumatology': '🦾', 'Haematology': '🩸',
  'Neurosurgery': '🧠', 'Plastic & Reconstructive Surgery': '💎', 'Cardiothoracic Surgery': '❤️‍🔥',
  'Vascular Surgery': '🩺', 'Transplant Medicine': '🤝', 'Reproductive Medicine & IVF': '🧬',
  'Neonatology': '🐣', 'Physiotherapy & Rehabilitation': '🏃', 'Pain Management': '💊',
  'Palliative Care': '🕊️', 'Emergency & Trauma': '🚨', 'Critical Care & ICU': '🏥',
  'Anaesthesiology': '💉', 'Radiology & Imaging': '📡', 'Pathology & Laboratory': '🔭',
  'Nuclear Medicine': '⚛️', 'Sports Medicine': '🏅', 'Dental & Maxillofacial Surgery': '🦷',
  'Geriatrics': '🧓', 'Allergy & Immunology': '🛡️', 'Infectious Disease': '🦠',
  'Internal Medicine': '🩺', 'Spine Surgery': '⬆️', 'Bariatric Surgery': '⚖️',
  'Liver & Hepatology': '🫁', 'Diabetes & Endocrinology': '🍬', 'Preventive Health & Wellness': '✅',
};

export default function ServicesPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    departmentsApi.getAll().then(setDepartments).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-[#0a3560] to-[#0f4c81] text-white py-24">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <p className="text-[#e8734a] text-sm font-semibold uppercase tracking-wider mb-3">What We Offer</p>
          <h1 className="text-5xl font-bold font-[var(--font-heading)] mb-4">Care That Spans Every System</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            45+ super-specialities, all under one roof. Comprehensive, compassionate care for every stage of life.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            {['24/7 Emergency', 'NABH Accredited', '17 OTs', '96 ICU Beds', 'Robotic Surgery'].map((tag) => (
              <span key={tag} className="px-4 py-2 bg-white/10 rounded-full text-sm border border-white/20">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(15).fill(null).map((_, i) => <div key={i} className="h-40 rounded-2xl skeleton" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  id={dept.slug}
                  className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {DEPT_ICONS[dept.name] || '🏥'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#1a1a2e] mb-1 font-[var(--font-heading)]">{dept.name}</h3>
                      <p className="text-[#6b7280] text-sm leading-relaxed line-clamp-2 mb-3">{dept.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#0f4c81] font-medium">{dept.doctorCount} specialists</span>
                        <Link href="/doctors" className="text-xs text-[#e8734a] font-semibold hover:underline">
                          Meet the team →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[#0a3560] to-[#0f4c81] text-white">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold font-[var(--font-heading)] mb-4">Ready to Book a Consultation?</h2>
          <p className="text-white/80 mb-8">Our specialists are ready to provide the care you deserve.</p>
          <Link href="/appointment">
            <button className="px-8 py-4 bg-[#e8734a] text-white font-semibold rounded-xl hover:bg-[#c05a35] transition-colors shadow-xl text-lg">
              Book an Appointment
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
