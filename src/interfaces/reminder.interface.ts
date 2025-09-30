export interface Reminder {
  id: string;
  personId: string;
  title: string;
  description?: string;
  type: 'DOCUMENT_EXPIRY' | 'MEDICAL_APPOINTMENT' | 'MILESTONE' | 'VEHICLE_SERVICE' | 'INSURANCE_RENEWAL' | 'CUSTOM';
  dueDate: Date;
  isRecurring: boolean;
  recurrencePattern?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'COMPLETED' | 'SNOOZED' | 'CANCELLED';
  snoozeUntil?: Date;
  notificationSent: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReminderDto {
  personId: string;
  title: string;
  description?: string;
  type: 'DOCUMENT_EXPIRY' | 'MEDICAL_APPOINTMENT' | 'MILESTONE' | 'VEHICLE_SERVICE' | 'INSURANCE_RENEWAL' | 'CUSTOM';
  dueDate: Date;
  isRecurring?: boolean;
  recurrencePattern?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface UpdateReminderDto {
  title?: string;
  description?: string;
  dueDate?: Date;
  isRecurring?: boolean;
  recurrencePattern?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: 'PENDING' | 'COMPLETED' | 'SNOOZED' | 'CANCELLED';
}

export interface SnoozeReminderDto {
  snoozeUntil: Date;
}
