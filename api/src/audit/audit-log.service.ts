import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async logAction(
    action: string,
    resourceType: string,
    resourceId: number,
    performedById: number,
    organizationId: number,
    details?: string,
  ): Promise<void> {
    const auditLog = this.auditLogRepository.create({
      action,
      resourceType,
      resourceId,
      performedById,
      organizationId,
      details,
    });

    await this.auditLogRepository.save(auditLog);
    console.log(`📝 [AUDIT] ${action} - Resource: ${resourceType}#${resourceId} by User#${performedById}`);
  }

  async getAuditLogs(organizationId: number): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      where: { organizationId },
      relations: ['performedBy'],
      order: { createdAt: 'DESC' },
    });
  }
}