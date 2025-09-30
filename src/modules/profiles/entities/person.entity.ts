import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum PersonRole {
  PARENT = 'PARENT',
  CHILD = 'CHILD',
  ELDER = 'ELDER',
}

@Entity('persons')
export class Person {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  nickname?: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column()
  relation: string;

  @Column({ nullable: true })
  photoUrl?: string;

  @Column({ type: 'jsonb', nullable: true })
  contact?: {
    email?: string;
    phone?: string;
  };

  @Column()
  @Index()
  familyId: string;

  @Column({
    type: 'enum',
    enum: PersonRole,
    default: PersonRole.CHILD,
  })
  role: PersonRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
