import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { FamilyMember } from './family-member.entity';
import { BloodGroupType } from '../bloodgroup-types/bloodgroup-type.entity';
import { ClothingSizeType } from '../clothingsize-types/clothingsize-type.entity';
import { ShoesizeType } from '../shoesize-types/shoesize-type.entity';

export enum FamilyMemberGender {
	Male = 'Male',
	Female = 'Female',
	Other = 'Other',
}

@Entity({ name: 'family_member_personal_details' })
export class FamilyMemberPersonalDetail {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'uuid' })
	family_member_id!: string;

	@ManyToOne(() => FamilyMember, { nullable: false, onDelete: 'CASCADE' })
	@JoinColumn({ name: 'family_member_id' })
	family_member!: FamilyMember;

	@Column({ type: 'date', nullable: true })
	dob?: string | null;

	@Column({ type: 'enum', enum: FamilyMemberGender, enumName: 'family_member_gender', nullable: true })
	gender?: FamilyMemberGender | null;

	@Column({ type: 'integer', nullable: true })
	height?: number | null;

	@Column({ type: 'integer', nullable: true })
	weight?: number | null;

	@Column({ type: 'uuid', nullable: true })
	blood_group_id?: string | null;

	@ManyToOne(() => BloodGroupType, { nullable: true, onDelete: 'RESTRICT' })
	@JoinColumn({ name: 'blood_group_id' })
	blood_group?: BloodGroupType | null;

	@Column({ type: 'uuid', nullable: true })
	upper_clothing_size_id?: string | null;

	@ManyToOne(() => ClothingSizeType, { nullable: true, onDelete: 'RESTRICT' })
	@JoinColumn({ name: 'upper_clothing_size_id' })
	upper_clothing_size?: ClothingSizeType | null;

	@Column({ type: 'uuid', nullable: true })
	lower_clothing_size_id?: string | null;

	@ManyToOne(() => ClothingSizeType, { nullable: true, onDelete: 'RESTRICT' })
	@JoinColumn({ name: 'lower_clothing_size_id' })
	lower_clothing_size?: ClothingSizeType | null;

	@Column({ type: 'uuid', nullable: true })
	dress_clothing_size_id?: string | null;

	@ManyToOne(() => ClothingSizeType, { nullable: true, onDelete: 'RESTRICT' })
	@JoinColumn({ name: 'dress_clothing_size_id' })
	dress_clothing_size?: ClothingSizeType | null;

	@Column({ type: 'uuid', nullable: true })
	shoes_size_id?: string | null;

	@ManyToOne(() => ShoesizeType, { nullable: true, onDelete: 'RESTRICT' })
	@JoinColumn({ name: 'shoes_size_id' })
	shoes_size?: ShoesizeType | null;

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	created_at!: Date;

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updated_at!: Date;

	@DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at', nullable: true })
	deleted_at?: Date | null;
}
