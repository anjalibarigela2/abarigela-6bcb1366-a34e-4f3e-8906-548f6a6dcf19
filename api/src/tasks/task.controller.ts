import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AuditLogService } from '../audit/audit-log.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    private taskService: TaskService,
    private auditLogService: AuditLogService,
  ) {}

  @Post()
  async createTask(
    @Body()
    body: {
      title: string;
      description?: string;
      category?: string;
    },
    @Request() req,
  ) {
    try {
      const user = req.user;
      return await this.taskService.createTask(
        body.title,
        body.description,
        body.category,
        user,
      );
    } catch (error) {
      throw new HttpException(
        { message: error.message || 'Failed to create task' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async getTasks(@Request() req) {
    try {
      const user = req.user;
      return await this.taskService.getTasks(user);
    } catch (error) {
      throw new HttpException(
        { message: error.message || 'Failed to get tasks' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getTaskById(@Param('id') id: number, @Request() req) {
    try {
      const user = req.user;
      return await this.taskService.getTaskById(id, user);
    } catch (error) {
      throw new HttpException(
        { message: error.message || 'Failed to get task' },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: number,
    @Body() body: Partial<{ title: string; description: string; status: string; category: string }>,
    @Request() req,
  ) {
    try {
      const user = req.user;
      return await this.taskService.updateTask(id, body, user);
    } catch (error) {
      throw new HttpException(
        { message: error.message || 'Failed to update task' },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: number, @Request() req) {
    try {
      const user = req.user;
      return await this.taskService.deleteTask(id, user);
    } catch (error) {
      throw new HttpException(
        { message: error.message || 'Failed to delete task' },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Get('audit-log/all')
  @UseGuards(RolesGuard)
  @Roles('Owner', 'Admin')
  async getAuditLog(@Request() req) {
    try {
      const user = req.user;
      return await this.auditLogService.getAuditLogs(user.organizationId);
    } catch (error) {
      throw new HttpException(
        { message: error.message || 'Failed to get audit logs' },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}