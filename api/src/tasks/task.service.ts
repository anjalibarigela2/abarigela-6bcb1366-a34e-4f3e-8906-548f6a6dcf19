import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';
import { AuditLogService } from '../audit/audit-log.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private auditLogService: AuditLogService,
  ) {}

  async createTask(
    title: string,
    description: string,
    category: string,
    user: User,
  ): Promise<Task> {
    const task = this.taskRepository.create({
      title,
      description,
      category,
      status: 'To Do',
      createdById: user.id,
      organizationId: user.organizationId,
    });

    const savedTask = await this.taskRepository.save(task);

    // Log the action
    await this.auditLogService.logAction(
      'CREATE_TASK',
      'Task',
      savedTask.id,
      user.id,
      user.organizationId,
      `Created task: ${title}`,
    );

    return savedTask;
  }

  async getTasks(user: User): Promise<Task[]> {
    let tasks: Task[];

    if (user.role.name === 'Owner' || user.role.name === 'Admin') {
      // Owner and Admin see all tasks in their organization
      tasks = await this.taskRepository.find({
        where: { organizationId: user.organizationId },
        relations: ['createdBy', 'assignedTo'],
      });
    } else if (user.role.name === 'Viewer') {
      // Viewer only sees tasks assigned to them
      tasks = await this.taskRepository.find({
        where: {
          organizationId: user.organizationId,
          assignedToId: user.id,
        },
        relations: ['createdBy', 'assignedTo'],
      });
    }

    // Log the action
    await this.auditLogService.logAction(
      'VIEW_TASKS',
      'Task',
      0,
      user.id,
      user.organizationId,
      `Viewed ${tasks.length} tasks`,
    );

    return tasks;
  }

  async getTaskById(taskId: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['createdBy', 'assignedTo'],
    });

    if (!task) {
      throw new ForbiddenException('Task not found');
    }

    // Check permissions
    this.checkTaskAccess(task, user);

    // Log the action
    await this.auditLogService.logAction(
      'VIEW_TASK',
      'Task',
      taskId,
      user.id,
      user.organizationId,
      `Viewed task: ${task.title}`,
    );

    return task;
  }

  async updateTask(
    taskId: number,
    updates: Partial<Task>,
    user: User,
  ): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['createdBy', 'assignedTo'],
    });

    if (!task) {
      throw new ForbiddenException('Task not found');
    }

    // Only Owner, Admin, or task creator can edit
    if (
      user.role.name !== 'Owner' &&
      user.role.name !== 'Admin' &&
      task.createdById !== user.id
    ) {
      throw new ForbiddenException('You cannot edit this task');
    }

    Object.assign(task, updates);
    const updatedTask = await this.taskRepository.save(task);

    // Log the action
    await this.auditLogService.logAction(
      'UPDATE_TASK',
      'Task',
      taskId,
      user.id,
      user.organizationId,
      `Updated task: ${task.title}`,
    );

    return updatedTask;
  }

  async deleteTask(taskId: number, user: User): Promise<{ message: string }> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });

    if (!task) {
      throw new ForbiddenException('Task not found');
    }

    // Only Owner, Admin, or task creator can delete
    if (
      user.role.name !== 'Owner' &&
      user.role.name !== 'Admin' &&
      task.createdById !== user.id
    ) {
      throw new ForbiddenException('You cannot delete this task');
    }

    await this.taskRepository.delete(taskId);

    // Log the action
    await this.auditLogService.logAction(
      'DELETE_TASK',
      'Task',
      taskId,
      user.id,
      user.organizationId,
      `Deleted task: ${task.title}`,
    );

    return { message: 'Task deleted successfully' };
  }

  private checkTaskAccess(task: Task, user: User): void {
    // Only tasks from same organization
    if (task.organizationId !== user.organizationId) {
      throw new ForbiddenException('You do not have access to this task');
    }

    // Viewer can only see tasks assigned to them
    if (user.role.name === 'Viewer' && task.assignedToId !== user.id) {
      throw new ForbiddenException('You do not have access to this task');
    }
  }
}