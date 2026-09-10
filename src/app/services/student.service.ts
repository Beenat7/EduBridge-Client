import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Student,
  CreateStudentRequest,
  UpdateStudentRequest
} from '../models/student.model';

import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${API_CONFIG.baseUrl}/Students`;

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  getById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateStudentRequest): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, request);
  }

  update(id: string, request: UpdateStudentRequest): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, request);
  }

  archive(id: string): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/${id}/archive`, {});
  }

  activate(id: string): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivate(id: string): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  assignClass(studentId: string, classId: string): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/${studentId}/class`, { classId });
  }

  changeClass(studentId: string, classId: string): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${studentId}/class`, { classId });
  }

  removeClass(studentId: string): Observable<Student> {
    return this.http.delete<Student>(`${this.apiUrl}/${studentId}/class`);
  }
}