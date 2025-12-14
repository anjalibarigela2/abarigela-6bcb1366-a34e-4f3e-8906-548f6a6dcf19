import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Organization } from './entities/organization.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { Task } from './entities/task.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'turbovets.db',
  entities: [User, Organization, Role, Permission, Task],
  synchronize: true,
  logging: false,
  migrations: [],
  subscribers: [],
});