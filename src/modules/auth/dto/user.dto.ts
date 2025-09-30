import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export enum UserRole {
  PARENT = 'PARENT',
  CHILD = 'CHILD',
  ELDER = 'ELDER',
}

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ example: 'family-123', description: 'Family ID' })
  @IsString()
  @IsUUID('4', { message: 'Family ID must be a valid UUID' })
  familyId: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CHILD, description: 'User role' })
  @IsEnum(UserRole, { message: 'Role must be one of: PARENT, CHILD, ELDER' })
  role: UserRole;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'user@example.com', description: 'User email address' })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiPropertyOptional({ example: 'newpassword123', description: 'User password', minLength: 6 })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @ApiPropertyOptional({ example: 'family-123', description: 'Family ID' })
  @IsOptional()
  @IsString()
  @IsUUID('4', { message: 'Family ID must be a valid UUID' })
  familyId?: string;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.PARENT, description: 'User role' })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be one of: PARENT, CHILD, ELDER' })
  role?: UserRole;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  password: string;
}

export class UserResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID' })
  id: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  email: string;

  @ApiProperty({ example: 'family-123', description: 'Family ID' })
  familyId: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CHILD, description: 'User role' })
  role: UserRole;

  @ApiProperty({ example: true, description: 'User active status' })
  isActive: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Last login date' })
  lastLogin?: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Last update date' })
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT access token' })
  access_token: string;

  @ApiProperty({ type: UserResponseDto, description: 'User information' })
  user: UserResponseDto;
}
