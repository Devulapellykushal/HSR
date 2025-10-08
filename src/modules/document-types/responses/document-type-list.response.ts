import { ApiProperty } from '@nestjs/swagger';
import { DocumentTypeResponse } from './document-type.response';

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

export class DocumentTypeListResponse {
	@ApiProperty({ type: [DocumentTypeResponse] })
	items!: DocumentTypeResponse[];

	@ApiProperty({ type: PaginationMeta })
	meta!: PaginationMeta;
}
