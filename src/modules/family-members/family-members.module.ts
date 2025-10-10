import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyMembersService } from './family-members.service';
import { FamilyMember } from './family-member.entity';
import { FamilyMemberPersonalDetail } from './family-member-personal-detail.entity';
import { FamilyMemberHealthDetail } from './family-member-health-detail.entity';
import { FamilyMembersController } from './family-members.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			FamilyMember,
			FamilyMemberPersonalDetail,
			FamilyMemberHealthDetail,
		]),
	],
	controllers: [FamilyMembersController],
	providers: [FamilyMembersService],
	exports: [FamilyMembersService, TypeOrmModule],
})
export class FamilyMembersModule {}
