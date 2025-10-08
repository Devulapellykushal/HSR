import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoesizeType } from './shoesize-type.entity';
import { CreateShoesizeTypeDto } from './dto/create-shoesize-type.dto';
import { UpdateShoesizeTypeDto } from './dto/update-shoesize-type.dto';
import { QueryShoesizeTypeDto } from './dto/query-shoesize-type.dto';

@Injectable()
export class ShoesizeTypesService {
	constructor(
		@InjectRepository(ShoesizeType)
		private readonly repo: Repository<ShoesizeType>,
	) {}

	async create(dto: CreateShoesizeTypeDto): Promise<ShoesizeType> {
		const name = dto.name?.trim();
		if (!name) {
			throw new ConflictException('Name is required');
		}
		const exists = await this.repo
			.createQueryBuilder('st')
			.where('LOWER(st.name) = LOWER(:name)', { name })
			.andWhere('st.deleted_at IS NULL')
			.getExists();
		if (exists) {
			throw new ConflictException('Shoesize type name already exists');
		}
		const entity = this.repo.create({ ...dto, name });
		return this.repo.save(entity);
	}

	async ListAll(
		query?: QueryShoesizeTypeDto,
	): Promise<{
		items: ShoesizeType[];
		meta: { totalItems: number; itemsPerPage: number; totalPages: number; currentPage: number };
	}> {
		const page = Math.max(1, Number(query?.page) || 1);
		const limit = Math.min(100, Math.max(1, Number(query?.limit) || 10));
		const sortBy = (query?.sort_by || 'created_at') as keyof ShoesizeType;
		const sortOrder = (query?.sort_order || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

		// allowlist sortable fields
		const allowedSort: Array<keyof ShoesizeType> = [
			'name',
			'created_at',
		];
		const orderField: keyof ShoesizeType = allowedSort.includes(sortBy)
			? sortBy
			: 'created_at';

		const qb = this.repo.createQueryBuilder('st').where('st.deleted_at IS NULL');
		// optional text search on name/description
		const search = (query?.search || '').trim();
		if (search) {
			qb.andWhere(
				'(LOWER(st.name) LIKE LOWER(:q) OR LOWER(st.description) LIKE LOWER(:q))',
				{ q: `%${search}%` },
			);
		}
		qb.orderBy(`st.${orderField as string}`, sortOrder as 'ASC' | 'DESC');
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

	async findOne(id: string): Promise<ShoesizeType> {
		const found = await this.repo.findOne({ where: { id } });
		if (!found) {
			throw new NotFoundException('Shoesize type not found');
		}
		return found;
	}

	// Return all shoesize types without pagination
	async getAll(): Promise<ShoesizeType[]> {
		return this.repo.find({ withDeleted: false, order: { created_at: 'DESC' } });
	}
	async update(id: string, dto: UpdateShoesizeTypeDto): Promise<ShoesizeType> {
		const found = await this.findOne(id);
		if (dto.name) {
			const name = dto.name.trim();
			const exists = await this.repo
				.createQueryBuilder('st')
				.where('LOWER(st.name) = LOWER(:name)', { name })
				.andWhere('st.id <> :id', { id })
				.andWhere('st.deleted_at IS NULL')
				.getExists();
			if (exists) {
				throw new ConflictException('Shoesize type name already exists');
			}
			found.name = name;
		}
		Object.assign(found, { ...dto, name: found.name });
		return this.repo.save(found);
	}

	async remove(id: string): Promise<void> {
		const res = await this.repo.softDelete(id);
		if (!res.affected) throw new NotFoundException('Shoesize type not found');
	}
}