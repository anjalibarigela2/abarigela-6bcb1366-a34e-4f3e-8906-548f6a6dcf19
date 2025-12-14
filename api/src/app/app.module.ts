import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { TaskController } from '../tasks/task.controller';
import { TaskService } from '../tasks/task.service';
import { AuditLogService } from '../audit/audit-log.service';
import { SeedService } from './seed.service';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { Task } from '../entities/task.entity';
import { AuditLog } from '../entities/audit-log.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'turbovets.db',
      entities: [User, Organization, Role, Permission, Task, AuditLog],
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature([User, Organization, Role, Permission, Task, AuditLog]),
    JwtModule.register({
      secret: 'your-secret-key-change-this-in-production',
      signOptions: { expiresIn: '24h' },
    }),
    PassportModule,
  ],
  controllers: [AppController, AuthController, TaskController],
  providers: [AppService, AuthService, JwtStrategy, TaskService, AuditLogService, SeedService],
  exports: [JwtModule, PassportModule, AuthService, AuditLogService],
})
export class AppModule {}