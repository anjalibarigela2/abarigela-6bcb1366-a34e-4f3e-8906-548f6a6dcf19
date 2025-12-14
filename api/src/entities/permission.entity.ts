import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // 'CREATE_TASK', 'EDIT_TASK', 'DELETE_TASK', 'VIEW_AUDIT_LOG'

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Role, (role) => role.permissions, { onDelete: 'CASCADE' })
  role: Role;

  @Column()
  roleId: number;
}