import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { RolesGuard } from './guards/roles.guard';

@Module({
	imports: [
		ConfigModule,
		PassportModule,
		UsersModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				secret: config.get<string>('JWT_SECRET'),
				signOptions: { expiresIn: config.get<string>('JWT_EXPIRES') },
			}),
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, RolesGuard],
	exports: [AuthService, RolesGuard],
})
export class AuthModule {}
