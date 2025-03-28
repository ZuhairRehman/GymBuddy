/**
 * Common types used throughout the application
 */

// Basic user information shared across all user types
export interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileImage?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// User roles in the application
export type UserRole = 'member' | 'trainer' | 'owner' | 'admin';

// Common response status for API calls
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Common date range filter
export interface DateRange {
  startDate: Date | string;
  endDate: Date | string;
}

// Address information
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

// Notification type
export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date | string;
  data?: Record<string, any>;
}

// Status options for various entities
export type Status = 'active' | 'inactive' | 'pending' | 'cancelled' | 'expired';

// Day of the week
export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

// Time slot
export interface TimeSlot {
  id: string;
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  day: DayOfWeek;
  isAvailable: boolean;
}
