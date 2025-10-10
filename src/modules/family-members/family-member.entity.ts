import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RelationType } from 'src/modules/relation-types/relation-type.entity';

@Entity({ name: 'family_members' })
export class FamilyMember {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'uuid' })
	created_by!: string;

	@Column({ type: 'uuid' })
	relation_type_id!: string;

	@Column({ type: 'varchar', length: 100, nullable: true })
	first_name?: string | null;

	@Column({ type: 'varchar', length: 100, nullable: true })
	last_name?: string | null;

	@Column({ type: 'boolean', default: false })
	is_family_head!: boolean;

	// relations
	@ManyToOne(() => RelationType, { eager: false, nullable: false })
	@JoinColumn({ name: 'relation_type_id' })
	relation_type!: RelationType;

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	created_at!: Date;

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updated_at!: Date;

	@DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at', nullable: true })
	deleted_at?: Date | null;
}
