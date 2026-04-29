'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';

const IMAGES = [
  { src: 'https://nirravv.github.io/Hospital-Management-Html/assets/img/gallery/hospital.jpg', caption: 'The Hospital' },
  { src: 'https://nirravv.github.io/Hospital-Management-Html/assets/img/gallery/reception.jpg', caption: 'Reception' },
  { src: 'https://nirravv.github.io/Hospital-Management-Html/assets/img/gallery/opd.jpg', caption: 'OPD Area' },
  { src: 'https://nirravv.github.io/Hospital-Management-Html/assets/img/gallery/opd2.jpg', caption: 'OPD Waiting' },
  { src: 'https://nirravv.github.io/Hospital-Management-Html/assets/img/gallery/room1.jpg', caption: 'Patient Rooms' },
  { src: 'https://nirravv.github.io/Hospital-Management-Html/assets/img/gallery/cath_lab.jpg', caption: 'Cath Laboratory' },
  { src: 'https://nirravv.github.io/Hospital-Management-Html/assets/img/gallery/platinum_wing.jpg', caption: 'Platinum Wing' },
  { src: 'https://nirravv.github.io/Hospital-Management-Html/assets/img/gallery/parking.jpg', caption: 'Parking' },
];

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () => setLightbox((i) => (i === null ? null : (i - 1 + IMAGES.length) % IMAGES.length));
  const next = () => setLightbox((i) => (i === null ? null : (i + 1) % IMAGES.length));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape') setLightbox(null);
  };

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <PageHeader
        breadcrumb="Gallery"
        heading="Inside Unity."
        subtitle="Every room, every corridor, every piece of equipment — designed around you."
      />

      {/* Gallery Grid */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {IMAGES.map((img, i) => (
              <div
                key={i}
                onClick={() => setLightbox(i)}
                style={{ cursor: 'pointer', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}
              >
                <div style={{ overflow: 'hidden', aspectRatio: '4/3', background: 'var(--bg-secondary)' }}>
                  <img
                    src={img.src}
                    alt={img.caption}
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                      display: 'block',
                    }}
                    onMouseEnter={(e) => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
                    onError={(e) => {
                      const t = e.target as HTMLImageElement;
                      t.style.display = 'none';
                      const parent = t.parentElement;
                      if (parent) {
                        parent.style.display = 'flex';
                        parent.style.alignItems = 'center';
                        parent.style.justifyContent = 'center';
                      }
                    }}
                  />
                </div>
                <div style={{ padding: '12px 16px', background: 'var(--bg-card)' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute', top: 24, right: 24,
              background: 'rgba(255,255,255,0.15)', border: 'none',
              color: '#fff', borderRadius: '50%', width: 44, height: 44,
              fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            style={{
              position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.15)', border: 'none',
              color: '#fff', borderRadius: '50%', width: 48, height: 48,
              fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ‹
          </button>

          {/* Image */}
          <div onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center', maxWidth: '80vw' }}>
            <img
              src={IMAGES[lightbox].src}
              alt={IMAGES[lightbox].caption}
              style={{
                maxWidth: '80vw', maxHeight: '75vh',
                borderRadius: 12, objectFit: 'contain', display: 'block',
              }}
            />
            <p style={{ color: '#fff', marginTop: 16, fontSize: 16, fontWeight: 600 }}>
              {IMAGES[lightbox].caption}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 4 }}>
              {lightbox + 1} / {IMAGES.length}
            </p>
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            style={{
              position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.15)', border: 'none',
              color: '#fff', borderRadius: '50%', width: 48, height: 48,
              fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
