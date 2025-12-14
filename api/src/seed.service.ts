import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { Organization } from './entities/organization.entity';
import { User } from './entities/user.entity';
import { AuthService } from './auth/auth.service';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async seed() {
    console.log('🌱 Seeding database...');

    // Create Roles
    let ownerRole = await this.roleRepository.findOne({ where: { name: 'Owner' } });
    if (!ownerRole) {
      ownerRole = await this.roleRepository.save({
        name: 'Owner',
        description: 'Full access to organization',
      });
      console.log('✅ Created Owner role');
    }

    let adminRole = await this.roleRepository.findOne({ where: { name: 'Admin' } });
    if (!adminRole) {
      adminRole = await this.roleRepository.save({
        name: 'Admin',
        description: 'Can manage tasks and users',
      });
      console.log('✅ Created Admin role');
    }

    let viewerRole = await this.roleRepository.findOne({ where: { name: 'Viewer' } });
    if (!viewerRole) {
      viewerRole = await this.roleRepository.save({
        name: 'Viewer',
        description: 'Read-only access',
      });
      console.log('✅ Created Viewer role');
    }

    // Create Organization
    let org = await this.organizationRepository.findOne({ where: { name: 'TurboVets' } });
    if (!org) {
      org = await this.organizationRepository.save({
        name: 'TurboVets',
        description: 'Main Organization',
      });
      console.log('✅ Created TurboVets organization');
    }

    // Create Users
    const ownerExists = await this.userRepository.findOne({ where: { email: 'owner@turbovets.com' } });
    if (!ownerExists) {
      const hashedPassword = await this.authService.hashPassword('password123');
      await this.userRepository.save({
        email: 'owner@turbovets.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Owner',
        organizationId: org.id,
        roleId: ownerRole.id,
      });
      console.log('✅ Created Owner user (owner@turbovets.com / password123)');
    }

    const adminExists = await this.userRepository.findOne({ where: { email: 'admin@turbovets.com' } });
    if (!adminExists) {
      const hashedPassword = await this.authService.hashPassword('password123');
      await this.userRepository.save({
        email: 'admin@turbovets.com',
        password: hashedPassword,
        firstName: 'Jane',
        lastName: 'Admin',
        organizationId: org.id,
        roleId: adminRole.id,
      });
      console.log('✅ Created Admin user (admin@turbovets.com / password123)');
    }

    const viewerExists = await this.userRepository.findOne({ where: { email: 'viewer@turbovets.com' } });
    if (!viewerExists) {
      const hashedPassword = await this.authService.hashPassword('password123');
      await this.userRepository.save({
        email: 'viewer@turbovets.com',
        password: hashedPassword,
        firstName: 'Bob',
        lastName: 'Viewer',
        organizationId: org.id,
        roleId: viewerRole.id,
      });
      console.log('✅ Created Viewer user (viewer@turbovets.com / password123)');
    }

    console.log('✅ Database seeding complete!');
  }
}