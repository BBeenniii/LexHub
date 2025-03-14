import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('lawyerType')
export class LawyerType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;
}
