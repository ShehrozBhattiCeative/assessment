import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Unity Hospital — Healthcare, Reimagined',
  description: 'Unity Hospital brings together 45+ super-specialities, 300+ beds and an ensemble of experienced clinicians — delivered with warmth, precision, and uncompromising quality.',
  keywords: 'hospital, healthcare, doctors, appointments, Ahmedabad',
  openGraph: {
    title: 'Unity Hospital',
    description: 'World-class healthcare, reimagined for you.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
            success: { style: { background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' } },
            error: { style: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' } },
          }}
        />
      </body>
    </html>
  );
}
