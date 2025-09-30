export interface Person {
  id: string;
  name: string;
  nickname?: string;
  dob: Date;
  relation: string;
  photoUrl?: string;
  contact?: {
    email?: string;
    phone?: string;
  };
  familyId: string;
  role: 'PARENT' | 'CHILD' | 'ELDER';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePersonDto {
  name: string;
  nickname?: string;
  dob: Date;
  relation: string;
  photoUrl?: string;
  contact?: {
    email?: string;
    phone?: string;
  };
  familyId: string;
  role: 'PARENT' | 'CHILD' | 'ELDER';
}

export interface UpdatePersonDto {
  name?: string;
  nickname?: string;
  dob?: Date;
  relation?: string;
  photoUrl?: string;
  contact?: {
    email?: string;
    phone?: string;
  };
  role?: 'PARENT' | 'CHILD' | 'ELDER';
}
