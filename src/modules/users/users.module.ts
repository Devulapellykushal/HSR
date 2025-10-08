import { Module } from '@nestjs/common';
import { FamilyMembersModule } from '../family-members/family-members.module';
import { UsersService } from './users.service';

@Module({
	imports: [FamilyMembersModule],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
