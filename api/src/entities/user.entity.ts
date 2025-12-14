import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Organization } from './organization.entity';
import { Role } from './role.entity';
import { Task } from './task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Hashed password

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @ManyToOne(() => Organization, (org) => org.users)
  organization: Organization;

  @Column()
  organizationId: number;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @Column()
  roleId: number;

  @OneToMany(() => Task, (task) => task.createdBy)
  createdTasks: Task[];

  @OneToMany(() => Task, (task) => task.assignedTo)
  assignedTasks: Task[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}