import { Module } from '@nestjs/common';
import { FamilyMembersService } from './family-members.service';

@Module({
	providers: [FamilyMembersService],
	exports: [FamilyMembersService],
})
export class FamilyMembersModule {}
