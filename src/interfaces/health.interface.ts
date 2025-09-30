export interface HealthRecord {
  id: string;
  personId: string;
  type: 'HEIGHT' | 'WEIGHT' | 'BP' | 'SUGAR' | 'CHOLESTEROL' | 'SLEEP' | 'HEART_RATE' | 'TEMPERATURE';
  value: number | string;
  unit?: string;
  notes?: string;
  recordedAt: Date;
  recordedBy: string; // Person ID who recorded this
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHealthRecordDto {
  personId: string;
  type: 'HEIGHT' | 'WEIGHT' | 'BP' | 'SUGAR' | 'CHOLESTEROL' | 'SLEEP' | 'HEART_RATE' | 'TEMPERATURE';
  value: number | string;
  unit?: string;
  notes?: string;
  recordedAt?: Date;
}

export interface UpdateHealthRecordDto {
  value?: number | string;
  unit?: string;
  notes?: string;
  recordedAt?: Date;
}

export interface HealthTrendsDto {
  personId: string;
  type: 'HEIGHT' | 'WEIGHT' | 'BP' | 'SUGAR' | 'CHOLESTEROL' | 'SLEEP' | 'HEART_RATE' | 'TEMPERATURE';
  startDate: Date;
  endDate: Date;
  interval?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}
