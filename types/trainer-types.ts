/**
 * Trainer-specific types
 */
import { BaseUser, Status, TimeSlot } from './common-types';
import { Member } from './member-types';

// Trainer profile
export interface Trainer extends BaseUser {
  role: 'trainer';
  gymId: string;
  bio?: string;
  specialties: string[];
  certifications: Certification[];
  yearsOfExperience: number;
  employmentType: 'full-time' | 'part-time' | 'contract';
  availability: TimeSlot[];
  rating?: number; // Average rating
  reviewCount?: number;
  isActive: boolean;
}

// Trainer certification
export interface Certification {
  id: string;
  name: string;
  organization: string;
  issueDate: Date | string;
  expiryDate?: Date | string;
  documentUrl?: string;
  isVerified: boolean;
}

// Trainer's clients
export interface TrainerClient {
  id: string;
  trainerId: string;
  memberId: string;
  member: Member;
  startDate: Date | string;
  endDate?: Date | string;
  status: Status;
  notes?: string;
}

// Client fitness program
export interface FitnessProgram {
  id: string;
  trainerId: string;
  memberId: string;
  title: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  status: Status;
  workoutPlans: WorkoutPlan[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Workout plan in a fitness program
export interface WorkoutPlan {
  id: string;
  fitnessProgramId: string;
  title: string;
  description?: string;
  day: number; // Day in the program cycle
  exercises: ProgramExercise[];
  notes?: string;
}

// Exercise in a workout plan
export interface ProgramExercise {
  id: string;
  workoutPlanId: string;
  exerciseId: string;
  exercise: {
    id: string;
    name: string;
    muscleGroup: string;
    equipment?: string;
    description?: string;
    videoUrl?: string;
    imageUrl?: string;
  };
  order: number;
  sets: number;
  repsPerSet: string; // e.g. "12-15" or "To failure"
  restBetweenSets: number; // in seconds
  notes?: string;
}

// Trainer schedule
export interface TrainerSchedule {
  id: string;
  trainerId: string;
  date: Date | string;
  timeSlots: ScheduleTimeSlot[];
}

// Time slot in trainer schedule
export interface ScheduleTimeSlot extends TimeSlot {
  bookingId?: string;
  memberId?: string;
  member?: {
    id: string;
    fullName: string;
    profileImage?: string;
  };
  status: 'available' | 'booked' | 'completed' | 'cancelled';
}

// Class session led by trainer
export interface TrainerClassSession {
  id: string;
  trainerId: string;
  classScheduleId: string;
  className: string;
  date: Date | string;
  startTime: Date | string;
  endTime: Date | string;
  capacity: number;
  enrolled: number;
  attendees: {
    memberId: string;
    memberName: string;
    attendanceStatus: 'present' | 'absent' | 'late';
  }[];
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
}

// Client progress tracking
export interface ClientProgress {
  id: string;
  trainerId: string;
  memberId: string;
  date: Date | string;
  metrics: {
    weight?: number;
    bodyFatPercentage?: number;
    measurements?: {
      chest?: number;
      waist?: number;
      hips?: number;
      biceps?: number;
      thighs?: number;
      // other measurements
    };
    performanceMetrics?: {
      [key: string]: number; // e.g. "benchPress": 80, "deadlift": 120
    };
  };
  notes: string;
  photos?: string[]; // URLs to progress photos
}

// Trainer review from member
export interface TrainerReview {
  id: string;
  trainerId: string;
  memberId: string;
  memberName: string;
  rating: number; // 1-5
  comment?: string;
  date: Date | string;
  isPublic: boolean;
}

// Trainer earnings
export interface TrainerEarnings {
  id: string;
  trainerId: string;
  month: number;
  year: number;
  amount: number;
  sessions: number;
  classes: number;
  commission: number;
  bonuses: number;
  status: 'pending' | 'processing' | 'paid';
  paymentDate?: Date | string;
}

// Trainer dashboard state
export interface TrainerDashboardState {
  upcomingSessions: ScheduleTimeSlot[];
  classesToday: TrainerClassSession[];
  activeClients: TrainerClient[];
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  sessionCompletionRate: number;
  recentReviews: TrainerReview[];
  isLoading: boolean;
  error: string | null;
}
