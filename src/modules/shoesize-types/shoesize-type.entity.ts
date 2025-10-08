import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'shoes_sizes' })
export class ShoesizeType {
	@PrimaryGeneratedColumn('uuid', { name: 'shoe_size_id' })
	id!: string;

	@Column({ type: 'varchar', length: 100 })
	name!: string;

	@Column({ type: 'text', nullable: true })
	description?: string | null;

	@Column({ type: 'boolean', name: 'is_active', default: true })
	is_active!: boolean;

	@Column({ type: 'boolean', name: 'is_predefined', default: false })
	is_predefined!: boolean;

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	created_at!: Date;

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updated_at!: Date;

	@DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at', nullable: true })
	deleted_at?: Date | null;
}