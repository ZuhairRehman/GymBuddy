/**
 * Gym Owner-specific types
 */
import { BaseUser, Status, Address } from './common-types';
import { Member } from './member-types';
import { Trainer } from './trainer-types';

// Gym Owner profile
export interface Owner extends BaseUser {
  role: 'owner';
  gymIds: string[]; // Owners can have multiple gyms
}

// Gym details
export interface Gym {
  id: string;
  name: string;
  description?: string;
  address: Address;
  contactEmail: string;
  contactPhone: string;
  photos: string[];
  logo?: string;
  openingHours: {
    monday: { open: string; close: string } | null;
    tuesday: { open: string; close: string } | null;
    wednesday: { open: string; close: string } | null;
    thursday: { open: string; close: string } | null;
    friday: { open: string; close: string } | null;
    saturday: { open: string; close: string } | null;
    sunday: { open: string; close: string } | null;
  };
  capacity: number;
  amenities: string[];
  status: Status;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Gym subscription
export interface GymSubscription {
  id: string;
  gymId: string;
  plan: 'basic' | 'standard' | 'premium';
  price: number;
  startDate: Date | string;
  endDate: Date | string;
  status: Status;
  paymentStatus: 'paid' | 'pending' | 'failed';
  autoRenew: boolean;
  paymentMethod: {
    type: 'card' | 'bank' | 'upi';
    lastFour?: string;
    expiryDate?: string;
  };
  features: string[];
}

// Gym membership summary
export interface GymMembershipSummary {
  total: number;
  active: number;
  expired: number;
  pendingRenewal: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  growthRate: number; // Percentage
}

// Staff member
export interface StaffMember extends BaseUser {
  gymId: string;
  role: 'admin' | 'receptionist' | 'maintenance' | 'cleaner';
  permissions: string[];
  salary: number;
  joiningDate: Date | string;
  status: Status;
}

// Financial record
export interface FinancialRecord {
  id: string;
  gymId: string;
  date: Date | string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  paymentMethod: string;
  reference?: string;
  attachments?: string[];
  createdBy: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Financial summary
export interface FinancialSummary {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  income: {
    total: number;
    byCategory: {
      [key: string]: number; // e.g. "memberships": 50000, "personalTraining": 20000
    };
  };
  expenses: {
    total: number;
    byCategory: {
      [key: string]: number; // e.g. "staff": 30000, "maintenance": 5000
    };
  };
  profit: number;
  profitMargin: number; // Percentage
}

// Equipment
export interface Equipment {
  id: string;
  gymId: string;
  name: string;
  category: string;
  brand?: string;
  modelNumber?: string;
  serialNumber?: string;
  purchaseDate: Date | string;
  purchasePrice: number;
  warranty?: {
    startDate: Date | string;
    endDate: Date | string;
    details: string;
  };
  maintenanceSchedule?: {
    lastMaintenance: Date | string;
    nextMaintenance: Date | string;
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  };
  status: 'operational' | 'maintenance' | 'broken' | 'retired';
  location: string; // e.g. "Cardio Area", "Weight Room"
}

// Maintenance request
export interface MaintenanceRequest {
  id: string;
  gymId: string;
  equipmentId?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in-progress' | 'completed';
  assignedTo?: string;
  requestedBy: string;
  requestDate: Date | string;
  completionDate?: Date | string;
  estimatedCost?: number;
  actualCost?: number;
  notes?: string;
}

// Gym traffic
export interface GymTraffic {
  id: string;
  gymId: string;
  date: Date | string;
  hour: number; // 0-23
  count: number;
  capacity: number;
  capacityPercentage: number;
}

// Announcement
export interface Announcement {
  id: string;
  gymId: string;
  title: string;
  body: string;
  type: 'general' | 'important' | 'emergency';
  startDate: Date | string;
  endDate?: Date | string;
  targetAudience: ('members' | 'trainers' | 'staff')[];
  createdBy: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  status: 'draft' | 'active' | 'archived';
}

// Promotion
export interface Promotion {
  id: string;
  gymId: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: Date | string;
  endDate: Date | string;
  couponCode?: string;
  usageLimit?: number;
  usageCount: number;
  applicableTo: {
    membershipPlans?: string[];
    classes?: string[];
    personalTraining?: boolean;
  };
  status: Status;
}

// Feedback/Review
export interface GymReview {
  id: string;
  gymId: string;
  memberId: string;
  memberName: string;
  rating: number; // 1-5
  comment?: string;
  categories?: {
    facilities: number;
    equipment: number;
    cleanliness: number;
    staff: number;
    value: number;
  };
  date: Date | string;
  status: 'pending' | 'approved' | 'rejected';
  ownerReply?: {
    text: string;
    date: Date | string;
  };
}

// Owner dashboard state
export interface OwnerDashboardState {
  gyms: Gym[];
  selectedGym: string | null;
  membershipSummary: GymMembershipSummary;
  recentMembers: Member[];
  recentTrainers: Trainer[];
  financialSummary: FinancialSummary;
  todayTraffic: GymTraffic[];
  capacityNow: number;
  equipmentAlerts: {
    maintenance: number;
    broken: number;
  };
  recentReviews: GymReview[];
  isLoading: boolean;
  error: string | null;
}

export { Member };
