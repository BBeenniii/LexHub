import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserSeeker } from '../../auth/entities/userSeeker.entity';
import { UserProvider } from '../../auth/entities/userProvider.entity';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seekerId: number;

  @Column()
  providerId: number;

  @ManyToOne(() => UserSeeker, { eager: false })
  @JoinColumn({ name: 'seekerId' })
  seeker: UserSeeker;

  @ManyToOne(() => UserProvider, { eager: false })
  @JoinColumn({ name: 'providerId' })
  provider: UserProvider;
}