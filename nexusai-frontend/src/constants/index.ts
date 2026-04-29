export const SITE_NAME = 'Unity Hospital';
export const SITE_TAGLINE = 'Healthcare, Reimagined for You';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/doctors', label: 'Doctors' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export const HERO_SLIDES = [
  {
    id: 1,
    headline: 'Healthcare, Reimagined for You',
    subtext: 'Unity Hospital brings together 45+ super-specialities, 300+ beds and an ensemble of experienced clinicians — delivered with warmth, precision, and uncompromising quality.',
    cta: 'Book an Appointment',
    ctaLink: '/appointment',
    secondaryCta: 'Meet Our Doctors',
    secondaryCtaLink: '/doctors',
    badge: 'NABH Accredited · Best Hospital 2020',
  },
  {
    id: 2,
    headline: 'A Modern Sanctuary for Every Heartbeat',
    subtext: 'Our 10-acre campus with 440,000+ sq ft of state-of-the-art facilities is designed to provide the best possible care in a healing environment.',
    cta: 'View Health Packages',
    ctaLink: '/health-packages',
    secondaryCta: 'Explore Services',
    secondaryCtaLink: '/services',
    badge: '300+ Beds · 17 OTs · 96 ICU Beds',
  },
  {
    id: 3,
    headline: 'Care That Spans Every System',
    subtext: 'From advanced cardiac sciences to pioneering robotic surgeries, our Centres of Excellence deliver internationally benchmarked care right here.',
    cta: 'Our Specialties',
    ctaLink: '/services',
    secondaryCta: 'Read Our Journal',
    secondaryCtaLink: '/blog',
    badge: '24/7 Emergency · Fleet Ambulances',
  },
];

export const APPOINTMENT_TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const APPOINTMENT_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
];

export const BLOG_CATEGORIES = [
  'Cardiology', 'Neurology', 'Orthopaedics', 'Paediatrics',
  'Nutrition & Dietetics', 'Nephrology & Urology', 'General Surgery',
  'Dermatology', 'Gastroenterology', 'Obstetrics & Gynaecology',
];

export const HOSPITAL_INFO = {
  name: 'Unity Hospital',
  address: '1 Medical Drive, Andheri East, Mumbai - 400069, Maharashtra, India',
  phone: '+91-22-6800-0000',
  emergency: '+91-22-6800-9999',
  email: 'care@nexusai.com',
  hours: 'Mon–Sat: 8:00 AM – 8:00 PM | Emergency: 24/7',
};
