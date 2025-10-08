import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiOkArrayStd, ApiOkStd, ApiCreatedStd, ApiOkEmptyStd } from '../../common/swagger/standard-responses';
import { RelationTypesService } from './relation-types.service';
import { CreateRelationTypeDto } from './dto/create-relation-type.dto';
import { UpdateRelationTypeDto } from './dto/update-relation-type.dto';
import { RelationTypeResponse } from './responses/relation-type.response';
import { QueryRelationTypeDto } from './dto/query-relation-type.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StdError } from '../../common/swagger/standard-responses';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';


@ApiTags('relation-types')
@ApiExtraModels(RelationTypeResponse)
@ApiBearerAuth('JWT')
@Controller('relation-types')
export class RelationTypesController {
	constructor(private readonly service: RelationTypesService) {}

	    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Create a new relation type' })
    @ApiCreatedStd('RelationType created', RelationTypeResponse)
	// error responses
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	@ApiResponse({ status: 409, ...StdError.Conflict })
	async create(@Body() dto: CreateRelationTypeDto): Promise<RelationTypeResponse> {
		const created = await this.service.create(dto);
		return created as unknown as RelationTypeResponse;
	}

	    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'List of relation types' })
	@ApiOkArrayStd('List of relation types', RelationTypeResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	async listAll(@Query() query: QueryRelationTypeDto): Promise<RelationTypeResponse[]> {
		const list = await this.service.ListAll(query);
		return list as unknown as RelationTypeResponse[];
	}

	    @Get('all')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'All relation types' })
	@ApiOkArrayStd('All relation types', RelationTypeResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	async getAll(): Promise<RelationTypeResponse[]> {
		const list = await this.service.getAll();
		return list as unknown as RelationTypeResponse[];
	}

	    @Get(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Relation type detail' })
	@ApiOkStd('Relation type detail', RelationTypeResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	async findOne(@Param('id') id: string): Promise<RelationTypeResponse> {
		const item = await this.service.findOne(id);
		return item as unknown as RelationTypeResponse;
	}

	    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Update relation type' })
	@ApiOkStd('Relation type updated', RelationTypeResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	@ApiResponse({ status: 409, ...StdError.Conflict })
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateRelationTypeDto,
	): Promise<RelationTypeResponse> {
		const item = await this.service.update(id, dto);
		return item as unknown as RelationTypeResponse;
	}

	    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Delete relation type' })
	@ApiOkEmptyStd('Relation type deleted')
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	@ApiResponse({ status: 409, ...StdError.Conflict })
	async remove(@Param('id') id: string): Promise<void> {
		await this.service.remove(id);
	}
}