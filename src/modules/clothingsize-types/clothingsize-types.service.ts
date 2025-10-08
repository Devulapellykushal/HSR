import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClothingSizeType } from './clothingsize-type.entity';
import { CreateClothingSizeTypeDto } from './dto/create-clothingsize-type.dto';
import { UpdateClothingSizeTypeDto } from './dto/update-clothingsize-type.dto';
import { QueryClothingSizeTypeDto } from './dto/query-clothingsize-type.dto';

@Injectable()
export class ClothingSizeTypesService {
	constructor(
		@InjectRepository(ClothingSizeType)
		private readonly repo: Repository<ClothingSizeType>,
	) {}

	async create(dto: CreateClothingSizeTypeDto): Promise<ClothingSizeType> {
		const name = dto.name?.trim();
		if (!name) {
			throw new ConflictException('Name is required');
		}
		const exists = await this.repo
			.createQueryBuilder('cst')
			.where('LOWER(cst.name) = LOWER(:name)', { name })
			.andWhere('cst.deleted_at IS NULL')
			.getExists();
		if (exists) {
			throw new ConflictException('Clothing size type name already exists');
		}
		const entity = this.repo.create({ ...dto, name });
		return this.repo.save(entity);
	}

	async ListAll(
		query?: QueryClothingSizeTypeDto,
	): Promise<{
		items: ClothingSizeType[];
		meta: { totalItems: number; itemsPerPage: number; totalPages: number; currentPage: number };
	}> {
		const page = Math.max(1, Number(query?.page) || 1);
		const limit = Math.min(100, Math.max(1, Number(query?.limit) || 10));
		const sortBy = (query?.sort_by || 'created_at') as keyof ClothingSizeType;
		const sortOrder = (query?.sort_order || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

		// allowlist sortable fields
		const allowedSort: Array<keyof ClothingSizeType> = [
			'name',
			'created_at',
		];
		const orderField: keyof ClothingSizeType = allowedSort.includes(sortBy)
			? sortBy
			: 'created_at';

		const qb = this.repo.createQueryBuilder('cst').where('cst.deleted_at IS NULL');
		// optional text search on name/description
		const search = (query?.search || '').trim();
		if (search) {
			qb.andWhere(
				'(LOWER(cst.name) LIKE LOWER(:q) OR LOWER(cst.description) LIKE LOWER(:q))',
				{ q: `%${search}%` },
			);
		}
		qb.orderBy(`cst.${orderField as string}`, sortOrder as 'ASC' | 'DESC');
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

	async findOne(id: string): Promise<ClothingSizeType> {
		const found = await this.repo.findOne({ where: { id } });
		if (!found) {
			throw new NotFoundException('Clothing size type not found');
		}
		return found;
	}

	// Return all clothing size types without pagination
	async getAll(): Promise<ClothingSizeType[]> {
		return this.repo.find({ withDeleted: false, order: { created_at: 'DESC' } });
	}
	async update(id: string, dto: UpdateClothingSizeTypeDto): Promise<ClothingSizeType> {
		const found = await this.findOne(id);
		if (dto.name) {
			const name = dto.name.trim();
			const exists = await this.repo
				.createQueryBuilder('cst')
				.where('LOWER(cst.name) = LOWER(:name)', { name })
				.andWhere('cst.id <> :id', { id })
				.andWhere('cst.deleted_at IS NULL')
				.getExists();
			if (exists) {
				throw new ConflictException('Clothing size type name already exists');
			}
			found.name = name;
		}
		Object.assign(found, { ...dto, name: found.name });
		return this.repo.save(found);
	}

	async remove(id: string): Promise<void> {
		const res = await this.repo.softDelete(id);
		if (!res.affected) throw new NotFoundException('Clothing size type not found');
	}
}