import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtLoginResponse, MeResponse } from './responses/auth.responses';
import { RegisterRequestDto } from './dto/register-request.dto';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly dataSource: DataSource,
		private readonly jwtService: JwtService,
		private readonly config: ConfigService,
		private readonly usersService: UsersService,
	) {}

	async login(dto: LoginDto): Promise<JwtLoginResponse> {
		// fetch user by email or mobile via UsersService
		if (!dto.identifier) {
			throw new BadRequestException('identifier is required');
		}
		const user = await this.usersService.get_by_identifier(dto.identifier as string);
		if (!user) throw new UnauthorizedException('Invalid credentials');
		if (user.is_active === false)
			throw new UnauthorizedException('User is inactive');

		const ok = await bcrypt.compare(dto.password, user.password_hash as string);
		if (!ok) throw new UnauthorizedException('Invalid credentials');

		const payload = {
			sub: user.user_id,
			role: user.role as 'admin' | 'normal',
			email: user.email as string | null,
			mobile: user.mobile as string,
		};
		const access_token = this.jwtService.sign(payload);

		return {
			access_token,
			user_id: user.user_id as string,
			email: (user.email as string) ?? null,
			mobile: user.mobile as string,
			role: user.role as 'admin' | 'normal',
			is_active: Boolean(user.is_active),
			first_name: (user.first_name as string) ?? null,
			last_name: (user.last_name as string) ?? null,
		};
	}

	async register(body: RegisterRequestDto): Promise<JwtLoginResponse> {
		// Validate required fields
		if (!body?.mobile) {
			throw new BadRequestException('Mobile is required'); // DB requires mobile NOT NULL
		}

		// Hash password
		const password_hash = await bcrypt.hash(body.password, 10);

		// Attempt insert
		try {
			await this.dataSource
				.createQueryBuilder()
				.insert()
				.into('users', [
					'email',
					'mobile',
					'password_hash',
					'first_name',
					'last_name',
					'role',
					'is_active',
				])
				.values([
					{
						email: body.email ?? null,
						mobile: body.mobile!,
						password_hash,
						first_name: body.first_name ?? null,
						last_name: body.last_name ?? null,
						role: 'normal',
						is_active: true,
					},
				])
				.execute();
		} catch (err: any) {
			// Unique violation
			if (err?.code === '23505') {
				throw new ConflictException('Email or mobile already exists');
			}
			throw err;
		}

		// Fetch created user
		const user = await this.usersService.get_by_identifier(body.mobile!);
		if (!user) throw new UnauthorizedException('User not found');

		const payload = {
			sub: user.user_id,
			role: user.role as 'admin' | 'normal',
			email: user.email as string | null,
			mobile: user.mobile as string,
		};
		const access_token = this.jwtService.sign(payload);

		return {
			access_token,
			user_id: user.user_id as string,
			email: (user.email as string) ?? null,
			mobile: user.mobile as string,
			role: user.role as 'admin' | 'normal',
			is_active: Boolean(user.is_active),
			first_name: (user.first_name as string) ?? null,
			last_name: (user.last_name as string) ?? null,
		};
	}

	async me(userId: string): Promise<MeResponse> {
		const user = await this.usersService.get_by_id(userId);
		if (!user) throw new UnauthorizedException('User not found');
		return {
			user_id: user.user_id as string,
			email: (user.email as string) ?? null,
			mobile: user.mobile as string,
			role: user.role as 'admin' | 'normal',
			is_active: Boolean(user.is_active),
			first_name: (user.first_name as string) ?? null,
			last_name: (user.last_name as string) ?? null,
		};
	}
}
