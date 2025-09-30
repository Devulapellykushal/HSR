import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePersonDto, PersonRole, UpdatePersonDto } from '../modules/profiles/dto';
import { Person } from '../modules/profiles/entities/person.entity';

@Injectable()
export class PersonRepository {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    const person = this.personRepository.create(createPersonDto);
    return this.personRepository.save(person);
  }

  async findAll(): Promise<Person[]> {
    return this.personRepository.find({
      where: { isActive: true },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Person | null> {
    return this.personRepository.findOne({
      where: { id, isActive: true },
      relations: ['user'],
    });
  }

  async findByFamilyId(familyId: string): Promise<Person[]> {
    return this.personRepository.find({
      where: { familyId, isActive: true },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserId(userId: string): Promise<Person | null> {
    return this.personRepository.findOne({
      where: { userId, isActive: true },
      relations: ['user'],
    });
  }

  async findByRole(familyId: string, role: PersonRole): Promise<Person[]> {
    return this.personRepository.find({
      where: { familyId, role, isActive: true },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updatePersonDto: UpdatePersonDto): Promise<Person | null> {
    await this.personRepository.update(id, {
      ...updatePersonDto,
      updatedAt: new Date(),
    });
    return this.findById(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.personRepository.update(id, {
      isActive: false,
      updatedAt: new Date(),
    });
  }

  async hardDelete(id: string): Promise<void> {
    await this.personRepository.delete(id);
  }

  async exists(name: string, familyId: string): Promise<boolean> {
    const count = await this.personRepository.count({
      where: { name, familyId, isActive: true },
    });
    return count > 0;
  }

  async countByFamilyId(familyId: string): Promise<number> {
    return this.personRepository.count({
      where: { familyId, isActive: true },
    });
  }

  async searchByName(familyId: string, searchTerm: string): Promise<Person[]> {
    return this.personRepository
      .createQueryBuilder('person')
      .where('person.familyId = :familyId', { familyId })
      .andWhere('person.isActive = :isActive', { isActive: true })
      .andWhere('(person.name ILIKE :searchTerm OR person.nickname ILIKE :searchTerm)', {
        searchTerm: `%${searchTerm}%`,
      })
      .leftJoinAndSelect('person.user', 'user')
      .orderBy('person.createdAt', 'DESC')
      .getMany();
  }
}
