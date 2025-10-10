import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'clothing_sizes' })
export class ClothingSizeType {
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

	@Column({ 
		type: 'enum', 
		name: 'cloth_category',
		enum: [
			'pant_men',
			'shirt_men',
			'pant_women',
			'shirt_women',
			'dress_women',
			'pant_boy',
			'shirt_boy',
			'pant_girl',
			'shirt_girl',
			'frock_girl'
		]
	})
	cloth_category!: 'pant_men' | 'shirt_men' | 'pant_women' | 'shirt_women' | 'dress_women' | 'pant_boy' | 'shirt_boy' | 'pant_girl' | 'shirt_girl' | 'frock_girl';

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	created_at!: Date;

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updated_at!: Date;

	@DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at', nullable: true })
	deleted_at?: Date | null;
}