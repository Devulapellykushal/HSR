import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentType } from './document-type.entity';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
import { QueryDocumentTypeDto } from './dto/query-document-type.dto';

@Injectable()
export class DocumentTypesService {
	constructor(
		@InjectRepository(DocumentType)
		private readonly repo: Repository<DocumentType>,
	) {}

	async create(dto: CreateDocumentTypeDto): Promise<DocumentType> {
		const name = dto.name?.trim();
		if (!name) {
			throw new ConflictException('Name is required');
		}
		const exists = await this.repo
			.createQueryBuilder('dt')
			.where('LOWER(dt.name) = LOWER(:name)', { name })
			.andWhere('dt.deleted_at IS NULL')
			.getExists();
		if (exists) {
			throw new ConflictException('Document type name already exists');
		}
		const entity = this.repo.create({ ...dto, name });
		return this.repo.save(entity);
	}

	async ListAll(
		query?: QueryDocumentTypeDto,
	): Promise<{
		items: DocumentType[];
		meta: { totalItems: number; itemsPerPage: number; totalPages: number; currentPage: number };
	}> {
		const page = Math.max(1, Number(query?.page) || 1);
		const limit = Math.min(100, Math.max(1, Number(query?.limit) || 10));
		const sortBy = (query?.sort_by || 'created_at') as keyof DocumentType;
		const sortOrder = (query?.sort_order || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

		// allowlist sortable fields
		const allowedSort: Array<keyof DocumentType> = [
			'name',
			'created_at',
		];
		const orderField: keyof DocumentType = allowedSort.includes(sortBy)
			? sortBy
			: 'created_at';

		const qb = this.repo.createQueryBuilder('dt').where('dt.deleted_at IS NULL');
		// optional text search on name/description
		const search = (query?.search || '').trim();
		if (search) {
			qb.andWhere(
				'(LOWER(dt.name) LIKE LOWER(:q) OR LOWER(dt.description) LIKE LOWER(:q))',
				{ q: `%${search}%` },
			);
		}
		qb.orderBy(`dt.${orderField as string}`, sortOrder as 'ASC' | 'DESC');
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

	async findOne(id: string): Promise<DocumentType> {
		const found = await this.repo.findOne({ where: { id } });
		if (!found) {
			throw new NotFoundException('Document type not found');
		}
		return found;
	}

	// Return all document types without pagination
	async getAll(): Promise<DocumentType[]> {
		return this.repo.find({ withDeleted: false, order: { created_at: 'DESC' } });
	}
	async update(id: string, dto: UpdateDocumentTypeDto): Promise<DocumentType> {
		const found = await this.findOne(id);
		if (dto.name) {
			const name = dto.name.trim();
			const exists = await this.repo
				.createQueryBuilder('dt')
				.where('LOWER(dt.name) = LOWER(:name)', { name })
				.andWhere('dt.id <> :id', { id })
				.andWhere('dt.deleted_at IS NULL')
				.getExists();
			if (exists) {
				throw new ConflictException('Document type name already exists');
			}
			found.name = name;
		}
		Object.assign(found, { ...dto, name: found.name });
		return this.repo.save(found);
	}

	async remove(id: string): Promise<void> {
		const res = await this.repo.softDelete(id);
		if (!res.affected) throw new NotFoundException('Document type not found');
	}
}
