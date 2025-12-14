import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'To Do' }) // 'To Do', 'In Progress', 'Done'
  status: string;

  @Column({ nullable: true }) // 'Work', 'Personal', etc.
  category: string;

  @ManyToOne(() => User, (user) => user.createdTasks)
  createdBy: User;

  @Column()
  createdById: number;

  @ManyToOne(() => User, (user) => user.assignedTasks, { nullable: true })
  assignedTo: User;

  @Column({ nullable: true })
  assignedToId: number;

  @ManyToOne(() => Organization, (org) => org.tasks)
  organization: Organization;

  @Column()
  organizationId: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}