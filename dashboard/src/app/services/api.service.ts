import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Auth endpoints
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  // Task endpoints
  createTask(task: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tasks`, task, { headers: this.getHeaders() });
  }

  getTasks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tasks`, { headers: this.getHeaders() });
  }

  getTaskById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/tasks/${id}`, { headers: this.getHeaders() });
  }

  updateTask(id: number, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/tasks/${id}`, task, { headers: this.getHeaders() });
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tasks/${id}`, { headers: this.getHeaders() });
  }

  // Audit log endpoint
  getAuditLogs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tasks/audit-log/all`, { headers: this.getHeaders() });
  }
}