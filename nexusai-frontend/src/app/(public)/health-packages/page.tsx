'use client';

import { useEffect, useState } from 'react';
import { PackageCard } from '@/components/ui/PackageCard';
import { packagesApi } from '@/lib/api';

export default function HealthPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    packagesApi.getAll().then(setPackages).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <section className="bg-gradient-to-br from-[#0a3560] to-[#0f4c81] text-white py-24 text-center">
        <div className="max-w-[1280px] mx-auto px-6">
          <p className="text-[#e8734a] text-sm font-semibold uppercase tracking-wider mb-3">Preventive Care</p>
          <h1 className="text-5xl font-bold font-[var(--font-heading)] mb-4">Health Wellness Packages</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Invest in your health with our comprehensive screening packages. Early detection saves lives.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {['Comprehensive Tests', 'Specialist Consultation', 'Digital Reports', 'Expert Analysis'].map((f) => (
              <span key={f} className="px-4 py-2 bg-white/10 rounded-full text-sm border border-white/20">✓ {f}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-[1280px] mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(4).fill(null).map((_, i) => <div key={i} className="h-[500px] rounded-2xl skeleton" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[#1a1a2e] mb-6">
            Need help choosing the right package?
          </h2>
          <p className="text-[#6b7280] mb-8">Our wellness coordinators will help you select the best package for your needs.</p>
          <div className="flex gap-4 justify-center">
            <a href="tel:+912268000000">
              <button className="px-6 py-3 bg-[#0f4c81] text-white font-semibold rounded-xl hover:bg-[#0a3560] transition-colors">
                Call Us: +91-22-6800-0000
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
