import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FamilyMembersService } from '../family-members/family-members.service';

export type DbUser = {
	user_id: string;
	email: string | null;
	mobile: string;
	password_hash?: string;
	role: 'admin' | 'normal';
	is_active: boolean | number;
	first_name: string | null;
	last_name: string | null;
};

@Injectable()
export class UsersService {
	constructor(
		private readonly dataSource: DataSource,
		private readonly familyMembersService: FamilyMembersService,
	) {}

	// Fetch by email or mobile. Include password_hash for auth.
	async get_by_identifier(identifier: string): Promise<DbUser | null> {
		const qb = this.dataSource
			.createQueryBuilder()
			.select([
				'u.id as user_id',
				'u.email',
				'u.mobile',
				'u.password_hash',
				'u.role',
				'u.is_active',
				'u.first_name',
				'u.last_name',
			])
			.from('users', 'u')
			.where('(u.email = :identifier OR u.mobile = :identifier)', { identifier })
			.andWhere('u.deleted_at IS NULL')
			.limit(1);

		const row = await qb.getRawOne<DbUser>();
		return row ?? null;
	}

	// Fetch by id (no password)
	async get_by_id(user_id: string): Promise<DbUser | null> {
		const qb = this.dataSource
			.createQueryBuilder()
			.select([
				'u.id as user_id',
				'u.email',
				'u.mobile',
				'u.role',
				'u.is_active',
				'u.first_name',
				'u.last_name',
			])
			.from('users', 'u')
			.where('u.id = :user_id', { user_id })
			.andWhere('u.deleted_at IS NULL')
			.limit(1);

		const row = await qb.getRawOne<DbUser>();
		return row ?? null;
	}

	// Create a user record and corresponding family member (Self) in one transaction
	async create_user(params: {
		email?: string | null;
		mobile: string;
		password_hash: string;
		first_name?: string | null;
		last_name?: string | null;
		role?: 'admin' | 'normal';
		is_active?: boolean;
	}): Promise<void> {
		const {
			email = null,
			mobile,
			password_hash,
			first_name = null,
			last_name = null,
			role = 'normal',
			is_active = true,
		} = params;

		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const insertResult = await queryRunner.manager
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
						email,
						mobile,
						password_hash,
						first_name,
						last_name,
						role,
						is_active,
					},
				])
				.execute();

			// Fetch the created user_id by unique mobile within the same transaction
			const created = await queryRunner.manager
				.createQueryBuilder()
				.select(['u.id as user_id'])
				.from('users', 'u')
				.where('u.mobile = :mobile', { mobile })
				.andWhere('u.deleted_at IS NULL')
				.limit(1)
				.getRawOne<{ user_id: string }>();

			const user_id: string | undefined = created?.user_id;
			if (!user_id) throw new Error('Failed to retrieve created user_id');

			await this.familyMembersService.create_for_user(
				{
					created_by: user_id,
					first_name,
					last_name,
					is_family_head: true,
				},
				queryRunner.manager,
			);

			await queryRunner.commitTransaction();
		} catch (e) {
			await queryRunner.rollbackTransaction();
			throw e;
		} finally {
			await queryRunner.release();
		}
	}

	// Return role slugs. For current schema, users.role is a single role.
	async get_user_role_slugs(user_id: string): Promise<string[]> {
		const user = await this.get_by_id(user_id);
		if (!user) return [];
		return [user.role];
	}
}
