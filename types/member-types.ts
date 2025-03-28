/**
 * Member-specific types
 */
import { BaseUser, Status, Address, DateRange, TimeSlot } from './common-types';

// Member profile
export interface Member extends BaseUser {
  role: 'member';
  gymId: string;
  membershipId: string;
  height?: number; // in cm
  weight?: number; // in kg
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  address?: Address;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  fitnessGoals?: string[];
  healthConditions?: string[];
}

// Membership plan
export interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
  durationDays: number;
  price: number;
  features: string[];
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  dateRange?: DateRange; // For specifying a date range (e.g., 07/01/2025 - 07/02/2025)
}

// Member's active membership
export interface Membership {
  id: string;
  memberId: string;
  planId: string;
  plan: MembershipPlan;
  startDate: Date | string;
  endDate: Date | string;
  status: Status;
  paymentStatus: 'paid' | 'pending' | 'failed';
  autoRenew: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Member's attendance record
export interface Attendance {
  id: string;
  memberId: string;
  checkIn: Date | string;
  checkOut?: Date | string;
  duration?: number; // in minutes
  gymId: string;
}

// Member's workout log
export interface WorkoutLog {
  id: string;
  memberId: string;
  date: Date | string;
  exercises: Exercise[];
  notes?: string;
  duration: number; // in minutes
  caloriesBurned?: number;
}

// Exercise in a workout
export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  notes?: string;
}

// Set in an exercise
export interface Set {
  reps?: number;
  weight?: number; // in kg
  duration?: number; // in seconds
  distance?: number; // in meters
  restTime?: number; // in seconds
}

// Fitness metrics
export interface FitnessMetrics {
  id: string;
  memberId: string;
  date: Date | string;
  weight?: number; // in kg
  bodyFatPercentage?: number;
  muscleMass?: number; // in kg
  restingHeartRate?: number; // in bpm
  notes?: string;
}

// Class booking
export interface ClassBooking {
  id: string;
  memberId: string;
  classScheduleId: string;
  classSchedule: ClassSchedule;
  status: 'booked' | 'attended' | 'cancelled' | 'missed';
  bookingDate: Date | string;
  isFree: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Class schedule
export interface ClassSchedule {
  id: string;
  classId: string;
  class: GymClass;
  trainerId: string;
  trainer: {
    id: string;
    fullName: string;
    profileImage?: string;
  };
  startTime: Date | string;
  endTime: Date | string;
  recurring: boolean;
  recurrencePattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    weekdays?: number[]; // 0 = Sunday, 1 = Monday, etc.
    endDate?: Date | string;
  };
  capacity: number;
  enrolledCount: number;
  status: Status;
}

// Gym class
export interface GymClass {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  imageUrl?: string;
  isActive: boolean;
}

// Personal trainer booking
export interface TrainerBooking {
  id: string;
  memberId: string;
  trainerId: string;
  trainer: {
    id: string;
    fullName: string;
    profileImage?: string;
    specialties: string[];
  };
  timeSlot: TimeSlot;
  date: Date | string;
  status: 'booked' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Member dashboard state
export interface MemberDashboardState {
  membership: Membership | null;
  recentAttendance: Attendance[];
  upcomingClasses: ClassBooking[];
  upcomingTrainerSessions: TrainerBooking[];
  workoutStreak: number;
  fitnessMetrics: FitnessMetrics[];
  isLoading: boolean;
  error: string | null;
}
