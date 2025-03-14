import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('userSeeker')
export class UserSeeker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'seeker' })
  userType: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  county: string;

  @Column()
  city: string;

  @Column()
  password: string;
}
