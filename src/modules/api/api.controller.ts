import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkStd, StdError } from 'src/common/swagger/standard-responses';
import { ApiService } from './api.service';
import { DropdownResponse } from './responses/dropdown.response';

@ApiTags('api')
@ApiExtraModels(DropdownResponse)
@ApiBearerAuth('JWT')
@Controller('api')
export class ApiController {
	constructor(private readonly service: ApiService) {}

	@Get('dropdown')
	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({ summary: 'Get dropdown lists for blood groups, clothing sizes, shoe sizes' })
	@ApiOkStd('Dropdown lists', DropdownResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	async dropdown(): Promise<DropdownResponse> {
		const data = await this.service.getDropdown();
		return data as unknown as DropdownResponse;
	}
}
