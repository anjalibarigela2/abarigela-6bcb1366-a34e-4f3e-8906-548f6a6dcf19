import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string; // 'CREATE_TASK', 'UPDATE_TASK', 'DELETE_TASK', 'VIEW_TASK'

  @Column({ nullable: true })
  resourceType: string; // 'Task', 'User', etc.

  @Column({ nullable: true })
  resourceId: number;

  @Column({ nullable: true })
  details: string; // JSON or description

  @ManyToOne(() => User)
  performedBy: User;

  @Column()
  performedById: number;

  @Column()
  organizationId: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}