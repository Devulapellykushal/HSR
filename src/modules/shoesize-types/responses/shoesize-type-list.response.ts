import { ApiProperty } from '@nestjs/swagger';
import { ShoesizeTypeResponse } from './shoesize-type.response';

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

export class ShoesizeTypeListResponse {
	@ApiProperty({ type: [ShoesizeTypeResponse] })
	items!: ShoesizeTypeResponse[];

	@ApiProperty({ type: PaginationMeta })
	meta!: PaginationMeta;
}