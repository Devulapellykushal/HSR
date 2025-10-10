import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'shoes_sizes' })
export class ShoesizeType {
	@PrimaryGeneratedColumn('uuid', { name: 'id' })
	id!: string;

	@Column({ type: 'varchar', length: 100 })
	name!: string;

	@Column({ type: 'text', nullable: true })
	description?: string | null;

	@Column({ type: 'boolean', name: 'is_active', default: true })
	is_active!: boolean;

	@Column({ type: 'boolean', name: 'is_predefined', default: false })
	is_predefined!: boolean;

	@Column({ type: 'varchar', length: 50, name: 'uk_size', nullable: true })
	uk_size?: string | null;

	@Column({ type: 'varchar', length: 50, name: 'us_size', nullable: true })
	us_size?: string | null;

	@Column({ type: 'varchar', length: 50, name: 'eu_size', nullable: true })
	eu_size?: string | null;

	@Column({ 
		type: 'enum', 
		name: 'shoe_category',
		enum: [
			'shoe_men',
			'shoe_women',
			'shoe_children'
		],
		nullable: true
	})
	shoe_category?: 'shoe_men' | 'shoe_women' | 'shoe_children' | null;

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	created_at!: Date;

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updated_at!: Date;

	@DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at', nullable: true })
	deleted_at?: Date | null;
}