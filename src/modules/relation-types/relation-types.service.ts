import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RelationType } from './relation-type.entity';
import { CreateRelationTypeDto } from './dto/create-relation-type.dto';
import { UpdateRelationTypeDto } from './dto/update-relation-type.dto';
import { QueryRelationTypeDto } from './dto/query-relation-type.dto';

@Injectable()
export class RelationTypesService {
	constructor(
		@InjectRepository(RelationType)
		private readonly repo: Repository<RelationType>,
	) {}

	async create(dto: CreateRelationTypeDto): Promise<RelationType> {
		const name = dto.name?.trim();
		if (!name) {
			throw new ConflictException('Name is required');
		}
		const exists = await this.repo
			.createQueryBuilder('rt')
			.where('LOWER(rt.name) = LOWER(:name)', { name })
			.andWhere('rt.deleted_at IS NULL')
			.getExists();
		if (exists) {
			throw new ConflictException('Relation type name already exists');
		}
		const entity = this.repo.create({ ...dto, name });
		return this.repo.save(entity);
	}

	async ListAll(
		query?: QueryRelationTypeDto,
	): Promise<{
		items: RelationType[];
		meta: { totalItems: number; itemsPerPage: number; totalPages: number; currentPage: number };
	}> {
		const page = Math.max(1, Number(query?.page) || 1);
		const limit = Math.min(100, Math.max(1, Number(query?.limit) || 10));
		const sortBy = (query?.sort_by || 'created_at') as keyof RelationType;
		const sortOrder = (query?.sort_order || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

		// allowlist sortable fields
		const allowedSort: Array<keyof RelationType> = [
			'name',
			'created_at',
		];
		const orderField: keyof RelationType = allowedSort.includes(sortBy)
			? sortBy
			: 'created_at';

		const qb = this.repo.createQueryBuilder('rt').where('rt.deleted_at IS NULL');
		// optional text search on name/description
		const search = (query?.search || '').trim();
		if (search) {
			qb.andWhere(
				'(LOWER(rt.name) LIKE LOWER(:q) OR LOWER(rt.description) LIKE LOWER(:q))',
				{ q: `%${search}%` },
			);
		}
		qb.orderBy(`rt.${orderField as string}`, sortOrder as 'ASC' | 'DESC');
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

	async findOne(id: string): Promise<RelationType> {
		const found = await this.repo.findOne({ where: { id } });
		if (!found) {
			throw new NotFoundException('Relation type not found');
		}
		return found;
	}

	// Return all relation types without pagination
	async getAll(): Promise<RelationType[]> {
		return this.repo.find({ withDeleted: false, order: { created_at: 'DESC' } });
	}
	async update(id: string, dto: UpdateRelationTypeDto): Promise<RelationType> {
		const found = await this.findOne(id);
		if (dto.name) {
			const name = dto.name.trim();
			const exists = await this.repo
				.createQueryBuilder('rt')
				.where('LOWER(rt.name) = LOWER(:name)', { name })
				.andWhere('rt.id <> :id', { id })
				.andWhere('rt.deleted_at IS NULL')
				.getExists();
			if (exists) {
				throw new ConflictException('Relation type name already exists');
			}
			found.name = name;
		}
		Object.assign(found, { ...dto, name: found.name });
		return this.repo.save(found);
	}

	async remove(id: string): Promise<void> {
		const res = await this.repo.softDelete(id);
		if (!res.affected) throw new NotFoundException('Relation type not found');
	}
}