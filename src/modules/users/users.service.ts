import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

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
	constructor(private readonly dataSource: DataSource) {}

	// Fetch by email or mobile. Include password_hash for auth.
	async get_by_identifier(identifier: string): Promise<DbUser | null> {
        const qb = this.dataSource
            .createQueryBuilder()
            .select([
                'u.user_id',
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
                'u.user_id',
                'u.email',
                'u.mobile',
                'u.role',
                'u.is_active',
                'u.first_name',
                'u.last_name',
            ])
            .from('users', 'u')
            .where('u.user_id = :user_id', { user_id })
            .andWhere('u.deleted_at IS NULL')
            .limit(1);
    
        const row = await qb.getRawOne<DbUser>();
        return row ?? null;
    }

	// Return role slugs. For current schema, users.role is a single role.
	async get_user_role_slugs(user_id: string): Promise<string[]> {
		const user = await this.get_by_id(user_id);
		if (!user) return [];
		return [user.role];
	}
}
