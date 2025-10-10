import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { FamilyMember } from './family-member.entity';

@Entity({ name: 'family_member_health_details' })
export class FamilyMemberHealthDetail {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'uuid' })
	family_member_id!: string;

	@ManyToOne(() => FamilyMember, { nullable: false, onDelete: 'CASCADE' })
	@JoinColumn({ name: 'family_member_id' })
	family_member!: FamilyMember;

	@Column({ type: 'date', name: 'health_date', default: () => 'CURRENT_DATE' })
	health_date!: string;

	@Column({ type: 'integer', nullable: true, name: 'blood_pressure_systolic', comment: 'Range: 50 - 300 mmHg' })
	blood_pressure_systolic?: number | null;

	@Column({ type: 'integer', nullable: true, name: 'blood_pressure_diastolic', comment: 'Range: 30 - 200 mmHg' })
	blood_pressure_diastolic?: number | null;

	@Column({ type: 'integer', nullable: true, name: 'heart_rate', comment: 'Range: 30 - 300 bpm' })
	heart_rate?: number | null;

	@Column({ type: 'decimal', precision: 4, scale: 1, nullable: true, name: 'temperature', comment: 'Range: 30 - 50 °C' })
	temperature?: string | null;

	@Column({ type: 'decimal', precision: 6, scale: 2, nullable: true, name: 'blood_sugar', comment: 'Range: 20 - 1000 mg/dL' })
	blood_sugar?: string | null;

	@Column({ type: 'decimal', precision: 6, scale: 2, nullable: true, name: 'cholesterol', comment: 'Range: 50 - 1000 mg/dL' })
	cholesterol?: string | null;

	@Column({ type: 'text', nullable: true })
	symptoms?: string | null;

	@Column({ type: 'text', nullable: true })
	medications?: string | null;

	@Column({ type: 'text', nullable: true })
	allergies?: string | null;

	@Column({ type: 'text', nullable: true, name: 'medical_conditions' })
	medical_conditions?: string | null;

	@Column({ type: 'text', nullable: true })
	notes?: string | null;

	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	created_at!: Date;

	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	updated_at!: Date;

	@DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at', nullable: true })
	deleted_at?: Date | null;
}
