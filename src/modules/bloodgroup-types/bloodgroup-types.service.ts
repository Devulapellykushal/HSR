import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BloodGroupType } from './bloodgroup-type.entity';
import { CreateBloodGroupTypeDto } from './dto/create-bloodgroup-type.dto';
import { UpdateBloodGroupTypeDto } from './dto/update-bloodgroup-type.dto';
import { QueryBloodGroupTypeDto } from './dto/query-bloodgroup-type.dto';

@Injectable()
export class BloodGroupTypesService {
	constructor(
		@InjectRepository(BloodGroupType)
		private readonly repo: Repository<BloodGroupType>,
	) {}

	async create(dto: CreateBloodGroupTypeDto): Promise<BloodGroupType> {
		const name = dto.name?.trim();
		if (!name) {
			throw new ConflictException('Name is required');
		}
		const exists = await this.repo
			.createQueryBuilder('bgt')
			.where('LOWER(bgt.name) = LOWER(:name)', { name })
			.andWhere('bgt.deleted_at IS NULL')
			.getExists();
		if (exists) {
			throw new ConflictException('Blood group type name already exists');
		}
		const entity = this.repo.create({ ...dto, name });
		return this.repo.save(entity);
	}

	async ListAll(
		query?: QueryBloodGroupTypeDto,
	): Promise<{
		items: BloodGroupType[];
		meta: { totalItems: number; itemsPerPage: number; totalPages: number; currentPage: number };
	}> {
		const page = Math.max(1, Number(query?.page) || 1);
		const limit = Math.min(100, Math.max(1, Number(query?.limit) || 10));
		const sortBy = (query?.sort_by || 'created_at') as keyof BloodGroupType;
		const sortOrder = (query?.sort_order || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

		// allowlist sortable fields
		const allowedSort: Array<keyof BloodGroupType> = [
			'name',
			'created_at',
		];
		const orderField: keyof BloodGroupType = allowedSort.includes(sortBy)
			? sortBy
			: 'created_at';

		const qb = this.repo.createQueryBuilder('bgt').where('bgt.deleted_at IS NULL');
		// optional text search on name/description
		const search = (query?.search || '').trim();
		if (search) {
			qb.andWhere(
				'(LOWER(bgt.name) LIKE LOWER(:q) OR LOWER(bgt.description) LIKE LOWER(:q))',
				{ q: `%${search}%` },
			);
		}
		qb.orderBy(`bgt.${orderField as string}`, sortOrder as 'ASC' | 'DESC');
		qb.skip((page - 1) * limit).take(limit);
		const [items, total] = await qb.getManyAndCount();
		return {
			items,
			meta: {
				totalItems: total,
				itemsPerPage: limit,
				totalPages: Math.max(1, Math.ceil(total / limit)),
				currentPage: page,
			},
		};
	}

	async findOne(id: string): Promise<BloodGroupType> {
		const found = await this.repo.findOne({ where: { id } });
		if (!found) {
			throw new NotFoundException('Blood group type not found');
		}
		return found;
	}

	// Return all blood group types without pagination
	async getAll(): Promise<BloodGroupType[]> {
		return this.repo.find({ withDeleted: false, order: { created_at: 'DESC' } });
	}
	async update(id: string, dto: UpdateBloodGroupTypeDto): Promise<BloodGroupType> {
		const found = await this.findOne(id);
		if (dto.name) {
			const name = dto.name.trim();
			const exists = await this.repo
				.createQueryBuilder('bgt')
				.where('LOWER(bgt.name) = LOWER(:name)', { name })
				.andWhere('bgt.id <> :id', { id })
				.andWhere('bgt.deleted_at IS NULL')
				.getExists();
			if (exists) {
				throw new ConflictException('Blood group type name already exists');
			}
			found.name = name;
		}
		Object.assign(found, { ...dto, name: found.name });
		return this.repo.save(found);
	}

	async remove(id: string): Promise<void> {
		const res = await this.repo.softDelete(id);
		if (!res.affected) throw new NotFoundException('Blood group type not found');
	}
}