import { Body, Controller, Param, Patch, Post, Req, UseGuards, UnauthorizedException, ParseUUIDPipe, Delete } from '@nestjs/common';
import { Get } from '@nestjs/common';
import type { Request } from 'express';
import { FamilyMembersService } from './family-members.service';
import { CreateFamilyMemberRequestDto } from './dto/create-family-member.dto';
import { UpdateFamilyMemberRequestDto } from './dto/update-family-member.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiCreatedStd, StdError } from 'src/common/swagger/standard-responses';
import { FullCreateFamilyMemberResponse } from './responses/full-create-family-member.response';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@ApiTags('family-members')
@ApiBearerAuth('JWT')
@Controller('family-members')
export class FamilyMembersController {
	constructor(private readonly familyMembersService: FamilyMembersService) {}

	@Post()
	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({ summary: 'Create a family member with optional personal/health details' })
	@ApiCreatedStd('Family member created', FullCreateFamilyMemberResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	@ApiBody({ type: CreateFamilyMemberRequestDto })
	async create(@Req() req: Request, @Body() dto: CreateFamilyMemberRequestDto) {
		// Passport attaches JWT payload as req.user from JwtStrategy.validate()
		const user = (req as any).user as JwtPayload | undefined;
		const userId = user?.sub;
		if (!userId) throw new UnauthorizedException();

		const result = await this.familyMembersService.create(userId, dto);
		return result;
	}

	@Get()
	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({ summary: 'List all family members for logged-in user' })
	@ApiResponse({ status: 200, description: 'List', type: FullCreateFamilyMemberResponse, isArray: true })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	async listMine(@Req() req: Request) {
		const user = (req as any).user as JwtPayload | undefined;
		const userId = user?.sub;
		if (!userId) {
			throw new Error('Unauthenticated: JWT payload missing sub (user id)');
		}
		const data = await this.familyMembersService.listForUser(userId);
		return data;
	}

	@Patch(':id')
	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({ summary: 'Update a family member with personal/health detail' })
	@ApiResponse({ status: 200, description: 'Updated entity', type: FullCreateFamilyMemberResponse })
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 403, ...StdError.Forbidden })
	@ApiBody({ type: UpdateFamilyMemberRequestDto })
	async update(
		@Req() req: Request,
		@Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
		@Body() dto: UpdateFamilyMemberRequestDto,
	) {
		const user = (req as any).user as JwtPayload | undefined;
		const userId = user?.sub;
		if (!userId) throw new UnauthorizedException();
		const result = await this.familyMembersService.updateForUser(userId, id, dto as any);
		return result;
	}

	@Delete(':id')
	@UseGuards(AuthGuard('jwt'))
	@ApiOperation({ summary: 'Soft delete a family member (sets deleted_at)' })
	@ApiResponse({ status: 200, description: 'Soft deleted', schema: { properties: { id: { type: 'string', format: 'uuid' }, deleted_at: { type: 'string', format: 'date-time' } } } })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 404, description: 'Not Found' })
	async remove(@Req() req: Request, @Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
		const user = (req as any).user as JwtPayload | undefined;
		const userId = user?.sub;
		if (!userId) throw new UnauthorizedException();
		const result = await this.familyMembersService.softDeleteForUser(userId, id);
		return result;
	}
}
