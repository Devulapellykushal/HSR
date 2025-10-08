import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { JwtLoginResponse, MeResponse } from './responses/auth.responses';
import { ApiOkStd, ApiCreatedStd, StdError } from '../../common/swagger/standard-responses';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { JwtPayload } from './strategies/jwt.strategy';
import { Req } from '@nestjs/common';

// Ensure the model class is referenced as a runtime value
const JwtLoginResponseModel = JwtLoginResponse; // keep for explicit reference

@ApiTags('auth')
@ApiBearerAuth('JWT')
@ApiExtraModels(JwtLoginResponse, MeResponse)
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Login with email or mobile' })
	@ApiOkStd('Login successful', JwtLoginResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	async login(@Body() body: LoginRequestDto): Promise<JwtLoginResponse> {
		const dto: LoginDto = {
			identifier: body.email ?? body.mobile ?? '',
			password: body.password,
		};
		return this.authService.login(dto);
	}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Register new user (email or mobile) and return token' })
	@ApiCreatedStd('Registration successful', JwtLoginResponse)
	@ApiResponse({ status: 400, ...StdError.BadRequest })
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	@ApiResponse({ status: 409, ...StdError.Conflict })
	async register(@Body() body: RegisterRequestDto): Promise<JwtLoginResponse> {
		return this.authService.register(body);
	}

	@Get('me')
	@UseGuards(AuthGuard('jwt'))
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get current authenticated user' })
	@ApiOkStd('Current user', MeResponse)
	@ApiResponse({ status: 401, ...StdError.Unauthorized })
	async me(@Req() req: Request): Promise<MeResponse> {
		const user = req.user as JwtPayload;
		return this.authService.me(user.sub);
	}
}
