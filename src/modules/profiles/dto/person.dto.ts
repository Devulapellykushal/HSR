import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEmail, IsEnum, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export enum PersonRole {
  PARENT = 'PARENT',
  CHILD = 'CHILD',
  ELDER = 'ELDER',
}

export class ContactDto {
  @ApiPropertyOptional({ example: 'person@example.com', description: 'Email address' })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class CreatePersonDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Johnny', description: 'Nickname' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({ example: '1990-01-01', description: 'Date of birth (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'Please provide a valid date in YYYY-MM-DD format' })
  dob: string;

  @ApiProperty({ example: 'Father', description: 'Relationship to family' })
  @IsString()
  relation: string;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg', description: 'Photo URL' })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiPropertyOptional({ type: ContactDto, description: 'Contact information' })
  @IsOptional()
  @IsObject()
  @Type(() => ContactDto)
  contact?: ContactDto;

  @ApiProperty({ example: 'family-123', description: 'Family ID' })
  @IsString()
  @IsUUID('4', { message: 'Family ID must be a valid UUID' })
  familyId: string;

  @ApiProperty({ enum: PersonRole, example: PersonRole.PARENT, description: 'Person role' })
  @IsEnum(PersonRole, { message: 'Role must be one of: PARENT, CHILD, ELDER' })
  role: PersonRole;

  @ApiPropertyOptional({ example: 'user-123', description: 'Associated user ID' })
  @IsOptional()
  @IsString()
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  userId?: string;
}

export class UpdatePersonDto {
  @ApiPropertyOptional({ example: 'John Doe', description: 'Full name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Johnny', description: 'Nickname' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ example: '1990-01-01', description: 'Date of birth (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString({}, { message: 'Please provide a valid date in YYYY-MM-DD format' })
  dob?: string;

  @ApiPropertyOptional({ example: 'Father', description: 'Relationship to family' })
  @IsOptional()
  @IsString()
  relation?: string;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg', description: 'Photo URL' })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiPropertyOptional({ type: ContactDto, description: 'Contact information' })
  @IsOptional()
  @IsObject()
  @Type(() => ContactDto)
  contact?: ContactDto;

  @ApiPropertyOptional({ enum: PersonRole, example: PersonRole.PARENT, description: 'Person role' })
  @IsOptional()
  @IsEnum(PersonRole, { message: 'Role must be one of: PARENT, CHILD, ELDER' })
  role?: PersonRole;

  @ApiPropertyOptional({ example: 'user-123', description: 'Associated user ID' })
  @IsOptional()
  @IsString()
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  userId?: string;
}

export class PersonResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Person ID' })
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  name: string;

  @ApiPropertyOptional({ example: 'Johnny', description: 'Nickname' })
  nickname?: string;

  @ApiProperty({ example: '1990-01-01', description: 'Date of birth' })
  dob: string;

  @ApiProperty({ example: 'Father', description: 'Relationship to family' })
  relation: string;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg', description: 'Photo URL' })
  photoUrl?: string;

  @ApiPropertyOptional({ type: ContactDto, description: 'Contact information' })
  contact?: ContactDto;

  @ApiProperty({ example: 'family-123', description: 'Family ID' })
  familyId: string;

  @ApiProperty({ enum: PersonRole, example: PersonRole.PARENT, description: 'Person role' })
  role: PersonRole;

  @ApiPropertyOptional({ example: 'user-123', description: 'Associated user ID' })
  userId?: string;

  @ApiProperty({ example: true, description: 'Person active status' })
  isActive: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Last update date' })
  updatedAt: Date;
}
