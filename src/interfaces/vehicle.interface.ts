export interface Vehicle {
  id: string;
  ownerId: string;
  type: 'CAR' | 'BIKE' | 'SCOOTER' | 'MOTORCYCLE' | 'TRUCK' | 'OTHER';
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  color?: string;
  insuranceExpiry?: Date;
  pucExpiry?: Date;
  serviceDueDate?: Date;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVehicleDto {
  ownerId: string;
  type: 'CAR' | 'BIKE' | 'SCOOTER' | 'MOTORCYCLE' | 'TRUCK' | 'OTHER';
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  color?: string;
  insuranceExpiry?: Date;
  pucExpiry?: Date;
  serviceDueDate?: Date;
  notes?: string;
}

export interface UpdateVehicleDto {
  type?: 'CAR' | 'BIKE' | 'SCOOTER' | 'MOTORCYCLE' | 'TRUCK' | 'OTHER';
  make?: string;
  model?: string;
  year?: number;
  registrationNumber?: string;
  color?: string;
  insuranceExpiry?: Date;
  pucExpiry?: Date;
  serviceDueDate?: Date;
  notes?: string;
}
