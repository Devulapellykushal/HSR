import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../modules/auth/dto/user.dto';
import { User } from '../modules/auth/entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id, isActive: true },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email, isActive: true },
    });
  }

  async findByFamilyId(familyId: string): Promise<User[]> {
    return this.userRepository.find({
      where: { familyId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.userRepository.update(id, {
      ...updateUserDto,
      updatedAt: new Date(),
    });
    return this.findById(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.userRepository.update(id, {
      isActive: false,
      updatedAt: new Date(),
    });
  }

  async hardDelete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, {
      lastLogin: new Date(),
      updatedAt: new Date(),
    });
  }

  async exists(email: string): Promise<boolean> {
    const count = await this.userRepository.count({
      where: { email, isActive: true },
    });
    return count > 0;
  }

  async countByFamilyId(familyId: string): Promise<number> {
    return this.userRepository.count({
      where: { familyId, isActive: true },
    });
  }
}
