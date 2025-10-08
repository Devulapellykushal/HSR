import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class FamilyMembersService {
	constructor(private readonly dataSource: DataSource) {}

	// Create initial family member for a user.
	// Defaults to relation type 'Self' and marks as family head unless specified.
	async create_for_user(
		params: {
			created_by: string;
			first_name?: string | null;
			last_name?: string | null;
			is_family_head?: boolean;
		},
		manager?: EntityManager,
	): Promise<void> {
		const {
			created_by,
			first_name = null,
			last_name = null,
			is_family_head = true,
		} = params;

		const runner = manager ?? this.dataSource.manager;

		// lookup relation_type_id for 'Self'
		const relRow = await runner
			.createQueryBuilder()
			.select(['rt.relation_type_id'])
			.from('relation_types', 'rt')
			.where('rt.name = :name', { name: 'Self' })
			.andWhere('rt.is_active = :active', { active: true })
			.limit(1)
			.getRawOne<{ relation_type_id: string }>();

		if (!relRow?.relation_type_id) {
			throw new Error('Relation type \'Self\' not found or inactive');
		}

		await runner
			.createQueryBuilder()
			.insert()
			.into('family_members', [
				'created_by',
				'relation_type_id',
				'first_name',
				'last_name',
				'is_family_head',
			])
			.values([
				{
					created_by,
					relation_type_id: relRow.relation_type_id,
					first_name,
					last_name,
					is_family_head,
				},
			])
			.execute();
	}
}
