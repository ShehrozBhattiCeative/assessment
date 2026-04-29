// Shared TypeScript interfaces for NexusAI Hospital Management System

export type UserRole = 'admin' | 'patient' | 'doctor';
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type BlogStatus = 'published' | 'draft';
export type PackageTier = 'basic' | 'gold' | 'happy-heart' | 'platinum';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  image: string;
  bio: string;
  availability: DoctorAvailability[];
  fee: number;
  departmentId: string;
  experience: number;
  rating: number;
  totalPatients: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorAvailability {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  fee: number;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorImage: string;
  category: string;
  image: string;
  status: BlogStatus;
  tags: string[];
  readTime: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  bloodGroup?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Package {
  id: string;
  name: string;
  tier: PackageTier;
  price: number;
  description: string;
  tests: string[];
  isActive: boolean;
  isPopular: boolean;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  doctorCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  patientName: string;
  patientAvatar: string;
  rating: number;
  review: string;
  treatment: string;
  year: number;
  isActive: boolean;
  createdAt: string;
}

export interface Stats {
  beds: number;
  specialties: number;
  operationTheatres: number;
  emergency: string;
  icuBeds: number;
  accreditation: string;
  award: string;
  totalPatients: number;
  totalDoctors: number;
  yearsOfExperience: number;
}

export interface AuthTokens {
  accessToken: string;
  user: Omit<User, 'password'>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
