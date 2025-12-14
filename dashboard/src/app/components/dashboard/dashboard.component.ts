import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <!-- Header -->
      <header class="bg-white border-b-4 border-orange-500 shadow-lg sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div class="flex items-center gap-2 sm:gap-3">
            <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-2 shadow-lg">
              <svg class="w-5 sm:w-6 h-5 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.5 1.5H5.75A2.75 2.75 0 003 4.25v11.5A2.75 2.75 0 005.75 18.5h8.5A2.75 2.75 0 0017 15.75V8.5m-6.5-5v5m0 0H4m8.5 0h4.5M3 10.25h14"/>
              </svg>
            </div>
            <div>
              <h1 class="text-lg sm:text-2xl font-bold text-orange-600">TurboVets</h1>
              <p class="text-xs text-gray-500">Task Management</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2 sm:gap-4 flex-wrap">
            <div class="flex items-center gap-2 sm:gap-3">
              <div class="text-right">
                <p class="text-gray-800 font-semibold text-xs sm:text-sm">{{ user?.firstName }}</p>
                <p class="text-gray-500 text-xs hidden sm:block">{{ user?.email }}</p>
              </div>
              <div class="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span class="text-white font-bold text-sm sm:text-base">{{ user?.firstName?.charAt(0) }}</span>
              </div>
            </div>
            <div class="h-6 w-px bg-orange-200 hidden sm:block"></div>
            <span class="text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full bg-orange-100 border-2 border-orange-500 text-orange-600">
              {{ user?.role }}
            </span>
            <button 
              (click)="logout()"
              class="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-8">
        
        <!-- Action Buttons -->
        <div class="flex gap-2 sm:gap-4 mb-6 sm:mb-10 flex-wrap">
          <button 
            (click)="openCreateTaskModal()"
            *ngIf="!isViewer()"
            class="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all flex items-center gap-2 text-sm sm:text-base shadow-lg hover:shadow-xl"
          >
            <span>➕</span> <span class="hidden sm:inline">New Task</span><span class="sm:hidden">New</span>
          </button>
          <button 
            *ngIf="!isViewer()"
            (click)="viewAuditLog()"
            class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all flex items-center gap-2 text-sm sm:text-base shadow-lg hover:shadow-xl"
          >
            <span>📋</span> <span class="hidden sm:inline">Audit Log</span><span class="sm:hidden">Logs</span>
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10">
          <!-- Total Tasks -->
          <div class="bg-white rounded-xl p-6 sm:p-8 shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition-all">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-semibold mb-2">Total Tasks</p>
                <p class="text-4xl sm:text-5xl font-bold text-orange-600">{{ tasks.length }}</p>
              </div>
              <div class="bg-orange-100 rounded-xl p-4 text-3xl sm:text-4xl">📊</div>
            </div>
          </div>

          <!-- To Do -->
          <div class="bg-white rounded-xl p-6 sm:p-8 shadow-lg border-l-4 border-yellow-500 hover:shadow-xl transition-all">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-semibold mb-2">To Do</p>
                <p class="text-4xl sm:text-5xl font-bold text-yellow-600">{{ getTasksByStatus('To Do').length }}</p>
              </div>
              <div class="bg-yellow-100 rounded-xl p-4 text-3xl sm:text-4xl">📝</div>
            </div>
          </div>

          <!-- In Progress -->
          <div class="bg-white rounded-xl p-6 sm:p-8 shadow-lg border-l-4 border-orange-400 hover:shadow-xl transition-all">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-semibold mb-2">In Progress</p>
                <p class="text-4xl sm:text-5xl font-bold text-orange-500">{{ getTasksByStatus('In Progress').length }}</p>
              </div>
              <div class="bg-orange-100 rounded-xl p-4 text-3xl sm:text-4xl">⚙️</div>
            </div>
          </div>

          <!-- Done -->
          <div class="bg-white rounded-xl p-6 sm:p-8 shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-semibold mb-2">Done</p>
                <p class="text-4xl sm:text-5xl font-bold text-green-600">{{ getTasksByStatus('Done').length }}</p>
              </div>
              <div class="bg-green-100 rounded-xl p-4 text-3xl sm:text-4xl">✅</div>
            </div>
          </div>
        </div>

        <!-- Tasks Table -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-200">
          <div class="overflow-x-auto">
            <table class="w-full text-xs sm:text-sm">
              <thead class="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <tr>
                  <th class="px-3 sm:px-4 md:px-6 py-4 text-left font-bold">Title</th>
                  <th class="px-3 sm:px-4 md:px-6 py-4 text-left font-bold hidden sm:table-cell">Status</th>
                  <th class="px-3 sm:px-4 md:px-6 py-4 text-left font-bold hidden md:table-cell">Category</th>
                  <th class="px-3 sm:px-4 md:px-6 py-4 text-left font-bold hidden lg:table-cell">Created By</th>
                  <th class="px-3 sm:px-4 md:px-6 py-4 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-orange-100">
                <tr *ngFor="let task of tasks" class="hover:bg-orange-50 transition-all">
                  <td class="px-3 sm:px-4 md:px-6 py-4 text-gray-800 font-semibold">{{ task.title }}</td>
                  <td class="px-3 sm:px-4 md:px-6 py-4 hidden sm:table-cell">
                    <span [ngClass]="getStatusClass(task.status)" class="px-3 py-1 rounded-full text-xs font-bold">
                      {{ task.status }}
                    </span>
                  </td>
                  <td class="px-3 sm:px-4 md:px-6 py-4 text-gray-600 hidden md:table-cell">{{ task.category || '—' }}</td>
                  <td class="px-3 sm:px-4 md:px-6 py-4 text-gray-600 hidden lg:table-cell">{{ task.createdBy?.firstName || 'Unknown' }}</td>
                  <td class="px-3 sm:px-4 md:px-6 py-4">
                    <div class="flex gap-2">
                      <button 
                        (click)="openEditTaskModal(task)"
                        *ngIf="canEditTask(task)"
                        class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded font-bold text-xs transition-all"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        (click)="deleteTask(task.id)"
                        *ngIf="canDeleteTask(task)"
                        class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded font-bold text-xs transition-all"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="tasks.length === 0">
                  <td colspan="5" class="px-3 sm:px-4 md:px-6 py-8 text-center">
                    <p class="text-gray-500 text-xs sm:text-sm">No tasks yet. Create one to get started!</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <!-- Create/Edit Task Modal -->
      <div *ngIf="showTaskModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
        <div class="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto border-2 border-orange-500">
          <h2 class="text-lg sm:text-2xl font-bold text-orange-600 mb-6">{{ editingTask ? '✏️ Edit Task' : '➕ Create New Task' }}</h2>
          
          <form (ngSubmit)="saveTask()" class="space-y-4 sm:space-y-5">
            <div>
              <label class="block text-gray-700 font-bold mb-2 text-sm">Task Title</label>
              <input 
                [(ngModel)]="taskForm.title" 
                name="title"
                type="text" 
                class="w-full px-4 py-2 sm:py-3 bg-white border-2 border-orange-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-600 text-sm sm:text-base"
                placeholder="Enter task title"
                required
              />
            </div>

            <div>
              <label class="block text-gray-700 font-bold mb-2 text-sm">Description</label>
              <textarea 
                [(ngModel)]="taskForm.description" 
                name="description"
                class="w-full px-4 py-2 sm:py-3 bg-white border-2 border-orange-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-600 text-sm sm:text-base resize-none"
                placeholder="Enter task description"
                rows="3"
              ></textarea>
            </div>

            <div>
              <label class="block text-gray-700 font-bold mb-2 text-sm">Category</label>
              <input 
                [(ngModel)]="taskForm.category" 
                name="category"
                type="text" 
                class="w-full px-4 py-2 sm:py-3 bg-white border-2 border-orange-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-600 text-sm sm:text-base"
                placeholder="e.g., Work, Personal"
              />
            </div>

            <div *ngIf="editingTask">
              <label class="block text-gray-700 font-bold mb-2 text-sm">Status</label>
              <select 
                [(ngModel)]="taskForm.status" 
                name="status"
                class="w-full px-4 py-2 sm:py-3 bg-white border-2 border-orange-300 rounded-lg text-gray-800 focus:outline-none focus:border-orange-600 text-sm sm:text-base"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div class="flex gap-3 pt-4">
              <button 
                type="submit"
                class="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 sm:py-3 px-4 rounded-lg transition-all text-sm sm:text-base shadow-lg"
              >
                💾 Save
              </button>
              <button 
                type="button"
                (click)="closeTaskModal()"
                class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 sm:py-3 px-4 rounded-lg transition-all text-sm sm:text-base"
              >
                ✕ Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  tasks: any[] = [];
  user: any;
  showTaskModal = false;
  editingTask: any = null;
  taskForm = { title: '', description: '', category: '', status: 'To Do' };

  constructor(
    private apiService: ApiService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    if (!this.tokenService.hasToken()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadTasks();
  }

  loadTasks(): void {
    this.apiService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
      }
    });
  }

  openCreateTaskModal(): void {
    this.editingTask = null;
    this.taskForm = { title: '', description: '', category: '', status: 'To Do' };
    this.showTaskModal = true;
  }

  openEditTaskModal(task: any): void {
    this.editingTask = task;
    this.taskForm = { ...task };
    this.showTaskModal = true;
  }

  closeTaskModal(): void {
    this.showTaskModal = false;
    this.editingTask = null;
    this.taskForm = { title: '', description: '', category: '', status: 'To Do' };
  }

  saveTask(): void {
    if (!this.taskForm.title) {
      alert('Please enter a task title');
      return;
    }

    if (this.editingTask) {
      this.apiService.updateTask(this.editingTask.id, this.taskForm).subscribe({
        next: () => {
          this.loadTasks();
          this.closeTaskModal();
        },
        error: (err) => {
          alert('Failed to update task');
        }
      });
    } else {
      this.apiService.createTask(this.taskForm).subscribe({
        next: () => {
          this.loadTasks();
          this.closeTaskModal();
        },
        error: (err) => {
          alert('Failed to create task');
        }
      });
    }
  }

  deleteTask(id: number): void {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    this.apiService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (err) => {
        alert('Failed to delete task');
      }
    });
  }

  viewAuditLog(): void {
    this.apiService.getAuditLogs().subscribe({
      next: (logs) => {
        console.log('Audit Logs:', logs);
        alert('Audit logs displayed in console - Press F12 to view');
      },
      error: (err) => {
        alert('Failed to load audit logs');
      }
    });
  }

  canEditTask(task: any): boolean {
    return this.isOwnerOrAdmin() || task.createdById === this.user.id;
  }

  canDeleteTask(task: any): boolean {
    return this.isOwnerOrAdmin() || task.createdById === this.user.id;
  }

  isOwnerOrAdmin(): boolean {
    return this.user?.role === 'Owner' || this.user?.role === 'Admin';
  }

  isViewer(): boolean {
    return this.user?.role === 'Viewer';
  }

  getTasksByStatus(status: string): any[] {
    return this.tasks.filter(t => t.status === status);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'To Do':
        return 'bg-yellow-100 border border-yellow-500 text-yellow-700';
      case 'In Progress':
        return 'bg-orange-100 border border-orange-500 text-orange-700';
      case 'Done':
        return 'bg-green-100 border border-green-500 text-green-700';
      default:
        return 'bg-gray-100 border border-gray-500 text-gray-700';
    }
  }

  logout(): void {
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
  }
}