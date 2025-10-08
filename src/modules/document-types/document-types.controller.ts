import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiOkArrayStd, ApiOkStd, ApiCreatedStd, ApiOkEmptyStd } from '../../common/swagger/standard-responses';
import { DocumentTypesService } from './document-types.service';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
import { DocumentTypeResponse } from './responses/document-type.response';
import { QueryDocumentTypeDto } from './dto/query-document-type.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StdError } from '../../common/swagger/standard-responses';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';


@ApiTags('document-types')
@ApiExtraModels(DocumentTypeResponse)
@ApiBearerAuth('JWT')
@Controller('document-types')
export class DocumentTypesController {
	constructor(private readonly service: DocumentTypesService) {}

	    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Create a new document type' })
    @ApiCreatedStd('DocumentType created', DocumentTypeResponse)
	// error responses
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	@ApiResponse({ status: 409, ...StdError.Conflict })
	async create(@Body() dto: CreateDocumentTypeDto): Promise<DocumentTypeResponse> {
		const created = await this.service.create(dto);
		return created as unknown as DocumentTypeResponse;
	}

	    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'List of document types' })
	@ApiOkArrayStd('List of document types', DocumentTypeResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	async listAll(@Query() query: QueryDocumentTypeDto): Promise<DocumentTypeResponse[]> {
		const list = await this.service.ListAll(query);
		return list as unknown as DocumentTypeResponse[];
	}

	    @Get('all')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'All document types' })
	@ApiOkArrayStd('All document types', DocumentTypeResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	async getAll(): Promise<DocumentTypeResponse[]> {
		const list = await this.service.getAll();
		return list as unknown as DocumentTypeResponse[];
	}

	    @Get(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Document type detail' })
	@ApiOkStd('Document type detail', DocumentTypeResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	async findOne(@Param('id') id: string): Promise<DocumentTypeResponse> {
		const item = await this.service.findOne(id);
		return item as unknown as DocumentTypeResponse;
	}

	    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Update document type' })
	@ApiOkStd('Document type updated', DocumentTypeResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	@ApiResponse({ status: 409, ...StdError.Conflict })
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateDocumentTypeDto,
	): Promise<DocumentTypeResponse> {
		const item = await this.service.update(id, dto);
		return item as unknown as DocumentTypeResponse;
	}

	    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Delete document type' })
	@ApiOkEmptyStd('Document type deleted')
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	@ApiResponse({ status: 409, ...StdError.Conflict })
	async remove(@Param('id') id: string): Promise<void> {
		await this.service.remove(id);
	}
}
