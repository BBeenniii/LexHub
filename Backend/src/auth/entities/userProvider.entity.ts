import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('userProvider')
export class UserProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'provider' })
  userType: string;

  @Column()
  providerType: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  country: string;

  @Column()
  county: string;

  @Column()
  city: string;

  @Column()
  password: string;

  @Column()
  kasz: string;

  @Column('text', { nullable: true })
  specs: string;

  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  lat: number;

  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  lng: number;
}
