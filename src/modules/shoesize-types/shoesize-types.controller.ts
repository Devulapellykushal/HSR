import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiOkArrayStd, ApiOkStd, ApiCreatedStd, ApiOkEmptyStd } from '../../common/swagger/standard-responses';
import { ShoesizeTypesService } from './shoesize-types.service';
import { CreateShoesizeTypeDto } from './dto/create-shoesize-type.dto';
import { UpdateShoesizeTypeDto } from './dto/update-shoesize-type.dto';
import { ShoesizeTypeResponse } from './responses/shoesize-type.response';
import { QueryShoesizeTypeDto } from './dto/query-shoesize-type.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StdError } from '../../common/swagger/standard-responses';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';


@ApiTags('shoesize-types')
@ApiExtraModels(ShoesizeTypeResponse)
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
	@ApiOkArrayStd('List of shoesize types', ShoesizeTypeResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	async listAll(@Query() query: QueryShoesizeTypeDto): Promise<ShoesizeTypeResponse[]> {
		const list = await this.service.ListAll(query);
		return list as unknown as ShoesizeTypeResponse[];
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