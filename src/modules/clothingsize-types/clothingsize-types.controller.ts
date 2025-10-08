import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiOkArrayStd, ApiOkStd, ApiCreatedStd, ApiOkEmptyStd } from '../../common/swagger/standard-responses';
import { ClothingSizeTypesService } from './clothingsize-types.service';
import { CreateClothingSizeTypeDto } from './dto/create-clothingsize-type.dto';
import { UpdateClothingSizeTypeDto } from './dto/update-clothingsize-type.dto';
import { ClothingSizeTypeResponse } from './responses/clothingsize-type.response';
import { QueryClothingSizeTypeDto } from './dto/query-clothingsize-type.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StdError } from '../../common/swagger/standard-responses';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';


@ApiTags('clothingsize-types')
@ApiExtraModels(ClothingSizeTypeResponse)
@ApiBearerAuth('JWT')
@Controller('clothingsize-types')
export class ClothingSizeTypesController {
	constructor(private readonly service: ClothingSizeTypesService) {}

	    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Create a new clothing size type' })
    @ApiCreatedStd('ClothingSizeType created', ClothingSizeTypeResponse)
	// error responses
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	@ApiResponse({ status: 409, ...StdError.Conflict })
	async create(@Body() dto: CreateClothingSizeTypeDto): Promise<ClothingSizeTypeResponse> {
		const created = await this.service.create(dto);
		return created as unknown as ClothingSizeTypeResponse;
	}

	    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'List of clothing size types' })
	@ApiOkArrayStd('List of clothing size types', ClothingSizeTypeResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	async listAll(@Query() query: QueryClothingSizeTypeDto): Promise<ClothingSizeTypeResponse[]> {
		const list = await this.service.ListAll(query);
		return list as unknown as ClothingSizeTypeResponse[];
	}

	    @Get('all')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'All clothing size types' })
	@ApiOkArrayStd('All clothing size types', ClothingSizeTypeResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	async getAll(): Promise<ClothingSizeTypeResponse[]> {
		const list = await this.service.getAll();
		return list as unknown as ClothingSizeTypeResponse[];
	}

	    @Get(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Clothing size type detail' })
	@ApiOkStd('Clothing size type detail', ClothingSizeTypeResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	async findOne(@Param('id') id: string): Promise<ClothingSizeTypeResponse> {
		const item = await this.service.findOne(id);
		return item as unknown as ClothingSizeTypeResponse;
	}

	    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Update clothing size type' })
	@ApiOkStd('Clothing size type updated', ClothingSizeTypeResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	@ApiResponse({ status: 409, ...StdError.Conflict })
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateClothingSizeTypeDto,
	): Promise<ClothingSizeTypeResponse> {
		const item = await this.service.update(id, dto);
		return item as unknown as ClothingSizeTypeResponse;
	}

	    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Delete clothing size type' })
	@ApiOkEmptyStd('Clothing size type deleted')
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	@ApiResponse({ status: 409, ...StdError.Conflict })
	async remove(@Param('id') id: string): Promise<void> {
		await this.service.remove(id);
	}
}