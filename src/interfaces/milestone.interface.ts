export interface Milestone {
  id: string;
  personId: string;
  title: string;
  description?: string;
  date: Date;
  category: 'BIRTHDAY' | 'ANNIVERSARY' | 'ACHIEVEMENT' | 'VACCINATION' | 'MEDICAL' | 'EDUCATION' | 'OTHER';
  mediaUrls?: string[];
  isRecurring: boolean;
  recurrencePattern?: 'YEARLY' | 'MONTHLY' | 'WEEKLY' | 'DAILY';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMilestoneDto {
  personId: string;
  title: string;
  description?: string;
  date: Date;
  category: 'BIRTHDAY' | 'ANNIVERSARY' | 'ACHIEVEMENT' | 'VACCINATION' | 'MEDICAL' | 'EDUCATION' | 'OTHER';
  mediaUrls?: string[];
  isRecurring?: boolean;
  recurrencePattern?: 'YEARLY' | 'MONTHLY' | 'WEEKLY' | 'DAILY';
}

export interface UpdateMilestoneDto {
  title?: string;
  description?: string;
  date?: Date;
  category?: 'BIRTHDAY' | 'ANNIVERSARY' | 'ACHIEVEMENT' | 'VACCINATION' | 'MEDICAL' | 'EDUCATION' | 'OTHER';
  mediaUrls?: string[];
  isRecurring?: boolean;
  recurrencePattern?: 'YEARLY' | 'MONTHLY' | 'WEEKLY' | 'DAILY';
}
