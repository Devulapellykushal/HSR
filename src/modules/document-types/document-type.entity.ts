import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity({ name: 'document_types' })
export class DocumentType {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'varchar', length: 255 })
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
