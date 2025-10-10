import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiCreatedStd, ApiOkArrayStd, ApiOkEmptyStd, ApiOkStd, StdError } from '../../common/swagger/standard-responses';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateShoesizeTypeDto } from './dto/create-shoesize-type.dto';
import { QueryShoesizeTypeDto } from './dto/query-shoesize-type.dto';
import { UpdateShoesizeTypeDto } from './dto/update-shoesize-type.dto';
import { ShoesizeTypeListResponse } from './responses/shoesize-type-list.response';
import { ShoesizeTypeResponse } from './responses/shoesize-type.response';
import { ShoesizeTypesService } from './shoesize-types.service';


@ApiTags('shoesize-types')
@ApiExtraModels(ShoesizeTypeResponse, ShoesizeTypeListResponse)
@ApiBearerAuth('JWT')
@Controller('shoesize-types')
export class ShoesizeTypesController {
	constructor(private readonly service: ShoesizeTypesService) {}

	    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Create a new shoesize type' })
    @ApiCreatedStd('ShoesizeType created', ShoesizeTypeResponse)
	// error responses
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	@ApiResponse({ status: 409, ...StdError.Conflict })
	async create(@Body() dto: CreateShoesizeTypeDto): Promise<ShoesizeTypeResponse> {
		const created = await this.service.create(dto);
		return created as unknown as ShoesizeTypeResponse;
	}

	    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'List of shoesize types' })
	@ApiOkStd('List of shoesize types', ShoesizeTypeListResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	async listAll(@Query() query: QueryShoesizeTypeDto): Promise<ShoesizeTypeListResponse> {
		const result = await this.service.ListAll(query);
		return {
			items: result.items as unknown as ShoesizeTypeResponse[],
			meta: result.meta
		};
	}

	    @Get('all')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'All shoesize types' })
	@ApiOkArrayStd('All shoesize types', ShoesizeTypeResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	async getAll(): Promise<ShoesizeTypeResponse[]> {
		const list = await this.service.getAll();
		return list as unknown as ShoesizeTypeResponse[];
	}

	    @Get(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Shoesize type detail' })
	@ApiOkStd('Shoesize type detail', ShoesizeTypeResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	async findOne(@Param('id') id: string): Promise<ShoesizeTypeResponse> {
		const item = await this.service.findOne(id);
		return item as unknown as ShoesizeTypeResponse;
	}

	    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Update shoesize type' })
	@ApiOkStd('Shoesize type updated', ShoesizeTypeResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	@ApiResponse({ status: 409, ...StdError.Conflict })
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateShoesizeTypeDto,
	): Promise<ShoesizeTypeResponse> {
		const item = await this.service.update(id, dto);
		return item as unknown as ShoesizeTypeResponse;
	}

	    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Delete shoesize type' })
	@ApiOkEmptyStd('Shoesize type deleted')
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	@ApiResponse({ status: 409, ...StdError.Conflict })
	async remove(@Param('id') id: string): Promise<void> {
		await this.service.remove(id);
	}
}