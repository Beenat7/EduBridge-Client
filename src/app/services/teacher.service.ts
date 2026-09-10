import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { Teacher, CreateTeacherRequest, UpdateTeacherRequest } from '../models/teacher.model';
import { TeacherSubject } from '../models/subject.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${API_CONFIG.baseUrl}/Teachers`;

  getAll(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.apiUrl);
  }

  getById(id: string): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateTeacherRequest): Observable<Teacher> {
    return this.http.post<Teacher>(this.apiUrl, request);
  }

  update(id: string, request: UpdateTeacherRequest): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.apiUrl}/${id}`, request);
  }

  activate(id: string): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivate(id: string): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  archive(id: string): Observable<Teacher> {
    return this.http.post<Teacher>(`${this.apiUrl}/${id}/archive`, {});
  }

  assignClass(teacherId: string, classId: string): Observable<Teacher> {
    return this.http.post<Teacher>(`${this.apiUrl}/${teacherId}/class`, { classId });
  }

  changeClass(teacherId: string, classId: string): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.apiUrl}/${teacherId}/class`, { classId });
  }

  removeClass(teacherId: string): Observable<Teacher> {
    return this.http.delete<Teacher>(`${this.apiUrl}/${teacherId}/class`);
  }

  getSubjects(teacherId: string): Observable<TeacherSubject[]> {
    return this.http.get<TeacherSubject[]>(`${this.apiUrl}/${teacherId}/subjects`);
  }

  assignSubject(teacherId: string, subjectId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${teacherId}/subjects`, { subjectId });
  }

  removeSubject(teacherId: string, subjectId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${teacherId}/subjects/${subjectId}`);
  }
}
