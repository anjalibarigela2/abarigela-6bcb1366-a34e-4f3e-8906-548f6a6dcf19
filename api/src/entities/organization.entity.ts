import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  parentOrganizationId: number; // For 2-level hierarchy

  @OneToMany(() => User, (user) => user.organization)
  users: User[];

  @OneToMany(() => Task, (task) => task.organization)
  tasks: Task[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}