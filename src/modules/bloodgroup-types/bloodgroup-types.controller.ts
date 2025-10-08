import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiOkArrayStd, ApiOkStd, ApiCreatedStd, ApiOkEmptyStd } from '../../common/swagger/standard-responses';
import { BloodGroupTypesService } from './bloodgroup-types.service';
import { CreateBloodGroupTypeDto } from './dto/create-bloodgroup-type.dto';
import { UpdateBloodGroupTypeDto } from './dto/update-bloodgroup-type.dto';
import { BloodGroupTypeResponse } from './responses/bloodgroup-type.response';
import { QueryBloodGroupTypeDto } from './dto/query-bloodgroup-type.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StdError } from '../../common/swagger/standard-responses';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';


@ApiTags('bloodgroup-types')
@ApiExtraModels(BloodGroupTypeResponse)
@ApiBearerAuth('JWT')
@Controller('bloodgroup-types')
export class BloodGroupTypesController {
	constructor(private readonly service: BloodGroupTypesService) {}

	    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Create a new blood group type' })
    @ApiCreatedStd('BloodGroupType created', BloodGroupTypeResponse)
	// error responses
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	@ApiResponse({ status: 409, ...StdError.Conflict })
	async create(@Body() dto: CreateBloodGroupTypeDto): Promise<BloodGroupTypeResponse> {
		const created = await this.service.create(dto);
		return created as unknown as BloodGroupTypeResponse;
	}

	    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'List of blood group types' })
	@ApiOkArrayStd('List of blood group types', BloodGroupTypeResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	async listAll(@Query() query: QueryBloodGroupTypeDto): Promise<BloodGroupTypeResponse[]> {
		const list = await this.service.ListAll(query);
		return list as unknown as BloodGroupTypeResponse[];
	}

	    @Get('all')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'All blood group types' })
	@ApiOkArrayStd('All blood group types', BloodGroupTypeResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	async getAll(): Promise<BloodGroupTypeResponse[]> {
		const list = await this.service.getAll();
		return list as unknown as BloodGroupTypeResponse[];
	}

	    @Get(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Blood group type detail' })
	@ApiOkStd('Blood group type detail', BloodGroupTypeResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	async findOne(@Param('id') id: string): Promise<BloodGroupTypeResponse> {
		const item = await this.service.findOne(id);
		return item as unknown as BloodGroupTypeResponse;
	}

	    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Update blood group type' })
	@ApiOkStd('Blood group type updated', BloodGroupTypeResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	@ApiResponse({ status: 409, ...StdError.Conflict })
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateBloodGroupTypeDto,
	): Promise<BloodGroupTypeResponse> {
		const item = await this.service.update(id, dto);
		return item as unknown as BloodGroupTypeResponse;
	}

	    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Delete blood group type' })
	@ApiOkEmptyStd('Blood group type deleted')
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	@ApiResponse({ status: 409, ...StdError.Conflict })
	async remove(@Param('id') id: string): Promise<void> {
		await this.service.remove(id);
	}
}