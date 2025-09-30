export interface User {
  id: string;
  email: string;
  password: string;
  familyId: string;
  role: 'PARENT' | 'CHILD' | 'ELDER';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  familyId: string;
  role: 'PARENT' | 'CHILD' | 'ELDER';
}

export interface JwtPayload {
  sub: string; // user id
  email: string;
  familyId: string;
  role: 'PARENT' | 'CHILD' | 'ELDER';
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    familyId: string;
    role: 'PARENT' | 'CHILD' | 'ELDER';
  };
}
