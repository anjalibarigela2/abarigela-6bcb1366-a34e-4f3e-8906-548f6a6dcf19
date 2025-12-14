import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 flex items-center justify-center p-4 sm:p-6">
      <div class="w-full max-w-md">
        <!-- Main Card -->
        <div class="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
          
          <!-- Header Section with Gradient Background -->
          <div class="bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 px-6 sm:px-8 py-8 sm:py-10">
            <div class="flex justify-center mb-4">
              <div class="bg-white/20 backdrop-blur-sm rounded-full p-3 sm:p-4">
                <svg class="w-8 sm:w-10 h-8 sm:h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.5 1.5H5.75A2.75 2.75 0 003 4.25v11.5A2.75 2.75 0 005.75 18.5h8.5A2.75 2.75 0 0017 15.75V8.5m-6.5-5v5m0 0H4m8.5 0h4.5M3 10.25h14"/>
                </svg>
              </div>
            </div>
            <h1 class="text-3xl sm:text-4xl font-bold text-white text-center mb-2">TurboVets</h1>
            <p class="text-orange-100 text-center text-sm sm:text-base">Smart Task Management System</p>
          </div>

          <!-- Form Section -->
          <div class="px-6 sm:px-8 py-8 sm:py-10">
            
            <!-- Error Message -->
            <div *ngIf="error" class="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 text-sm" role="alert">
              <p class="font-semibold flex items-center">
                <span class="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                {{ error }}
              </p>
            </div>

            <!-- Login Form -->
            <form (ngSubmit)="login()" class="space-y-5">
              <!-- Email Input -->
              <div>
                <label class="block text-gray-700 font-semibold text-sm mb-2">Email Address</label>
                <input 
                  [(ngModel)]="email" 
                  name="email"
                  type="email" 
                  class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <!-- Password Input -->
              <div>
                <label class="block text-gray-700 font-semibold text-sm mb-2">Password</label>
                <input 
                  [(ngModel)]="password" 
                  name="password"
                  type="password" 
                  class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>

              <!-- Login Button -->
              <button 
                type="submit"
                [disabled]="loading"
                class="w-full bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 disabled:from-gray-400 disabled:to-gray-300 text-white font-bold py-3 px-4 rounded-lg transition-all text-base shadow-md hover:shadow-lg disabled:shadow-none"
              >
                {{ loading ? '⏳ Logging in...' : '🚀 Login' }}
              </button>
            </form>

            <!-- Divider -->
            <div class="relative my-7">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
              </div>
              <div class="relative flex justify-center">
                <span class="px-3 bg-white text-gray-600 text-xs font-semibold uppercase tracking-wide">Demo Credentials</span>
              </div>
            </div>

            <!-- Test Credentials -->
            <div class="space-y-3">
              <!-- Owner -->
              <div class="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-3 sm:p-4 hover:border-orange-300 transition-colors">
                <p class="text-gray-800 text-sm"><span class="font-bold text-orange-600">Owner</span></p>
                <p class="text-gray-700 text-sm font-mono">owner@turbovets.com</p>
                <p class="text-gray-600 text-xs font-mono mt-1">password123</p>
              </div>

              <!-- Admin -->
              <div class="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-3 sm:p-4 hover:border-amber-300 transition-colors">
                <p class="text-gray-800 text-sm"><span class="font-bold text-amber-600">Admin</span></p>
                <p class="text-gray-700 text-sm font-mono">admin@turbovets.com</p>
                <p class="text-gray-600 text-xs font-mono mt-1">password123</p>
              </div>

              <!-- Viewer -->
              <div class="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-lg p-3 sm:p-4 hover:border-orange-300 transition-colors">
                <p class="text-gray-800 text-sm"><span class="font-bold text-orange-600">Viewer</span></p>
                <p class="text-gray-700 text-sm font-mono">viewer@turbovets.com</p>
                <p class="text-gray-600 text-xs font-mono mt-1">password123</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <p class="text-center text-gray-600 text-xs mt-6 font-medium">Secure Task Management • Built with NestJS & Angular</p>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private apiService: ApiService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  login(): void {
    if (!this.email || !this.password) {
      this.error = 'Please enter email and password';
      return;
    }

    this.loading = true;
    this.error = '';

    this.apiService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.tokenService.setToken(response.access_token);
        this.tokenService.setUser(response.user);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = 'Login failed. Please check your credentials.';
        this.loading = false;
      }
    });
  }
}