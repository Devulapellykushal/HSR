import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonDto, PersonResponseDto, UpdatePersonDto } from './dto/person.dto';
import { Person } from './entities/person.entity';

@Injectable()
export class ProfilesService {
  private profiles: Person[] = []; // In production, this would be a database

  async create(createPersonDto: CreatePersonDto, userId: string): Promise<PersonResponseDto> {
    const newProfile: Person = {
      id: this.generateId(),
      name: createPersonDto.name,
      nickname: createPersonDto.nickname,
      dob: new Date(createPersonDto.dob),
      relation: createPersonDto.relation,
      photoUrl: createPersonDto.photoUrl,
      contact: createPersonDto.contact,
      familyId: createPersonDto.familyId,
      role: createPersonDto.role,
      userId: createPersonDto.userId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.profiles.push(newProfile);
    return this.mapToResponseDto(newProfile);
  }

  async findAll(familyId: string): Promise<PersonResponseDto[]> {
    const profiles = this.profiles.filter(profile => 
      profile.familyId === familyId && profile.isActive
    );
    return profiles.map(profile => this.mapToResponseDto(profile));
  }

  async findOne(id: string, familyId: string): Promise<PersonResponseDto> {
    const profile = this.profiles.find(p => 
      p.id === id && p.familyId === familyId && p.isActive
    );
    
    if (!profile) {
      throw new NotFoundException('Family member not found');
    }
    
    return this.mapToResponseDto(profile);
  }

  async update(id: string, updatePersonDto: UpdatePersonDto, familyId: string): Promise<PersonResponseDto> {
    const profileIndex = this.profiles.findIndex(p => 
      p.id === id && p.familyId === familyId && p.isActive
    );
    
    if (profileIndex === -1) {
      throw new NotFoundException('Family member not found');
    }
    
    const updatedProfile = {
      ...this.profiles[profileIndex],
      ...updatePersonDto,
      updatedAt: new Date(),
    };
    
    // Handle date conversion for dob if provided
    if (updatePersonDto.dob) {
      updatedProfile.dob = new Date(updatePersonDto.dob);
    }
    
    this.profiles[profileIndex] = updatedProfile as Person;
    
    return this.mapToResponseDto(this.profiles[profileIndex]);
  }

  async remove(id: string, familyId: string): Promise<void> {
    const profileIndex = this.profiles.findIndex(p => 
      p.id === id && p.familyId === familyId && p.isActive
    );
    
    if (profileIndex === -1) {
      throw new NotFoundException('Family member not found');
    }
    
    this.profiles[profileIndex].isActive = false;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private mapToResponseDto(person: Person): PersonResponseDto {
    return {
      id: person.id,
      name: person.name,
      nickname: person.nickname,
      dob: person.dob.toISOString().split('T')[0], // Convert Date to string
      relation: person.relation,
      photoUrl: person.photoUrl,
      contact: person.contact,
      familyId: person.familyId,
      role: person.role,
      userId: person.userId,
      isActive: person.isActive,
      createdAt: person.createdAt,
      updatedAt: person.updatedAt,
    };
  }
}