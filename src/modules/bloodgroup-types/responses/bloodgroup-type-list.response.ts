import { ApiProperty } from '@nestjs/swagger';
import { BloodGroupTypeResponse } from './bloodgroup-type.response';

export class PaginationMeta {
	@ApiProperty({ example: 123 })
	totalItems!: number;

	@ApiProperty({ example: 10 })
	itemsPerPage!: number;

	@ApiProperty({ example: 13 })
	totalPages!: number;

	@ApiProperty({ example: 1 })
	currentPage!: number;
}

export class BloodGroupTypeListResponse {
	@ApiProperty({ type: [BloodGroupTypeResponse] })
	items!: BloodGroupTypeResponse[];

	@ApiProperty({ type: PaginationMeta })
	meta!: PaginationMeta;
}