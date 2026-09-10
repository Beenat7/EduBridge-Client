import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import {
  ClassSubject,
  CreateClassRequest,
  SchoolClass,
  UpdateClassRequest
} from '../models/class.model';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${API_CONFIG.baseUrl}/Classes`;

  getAll(): Observable<SchoolClass[]> {
    return this.http.get<SchoolClass[]>(this.apiUrl);
  }

  getById(id: string): Observable<SchoolClass> {
    return this.http.get<SchoolClass>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateClassRequest): Observable<SchoolClass> {
    return this.http.post<SchoolClass>(this.apiUrl, request);
  }

  update(id: string, request: UpdateClassRequest): Observable<SchoolClass> {
    return this.http.put<SchoolClass>(`${this.apiUrl}/${id}`, request);
  }

  activate(id: string): Observable<SchoolClass> {
    return this.http.put<SchoolClass>(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivate(id: string): Observable<SchoolClass> {
    return this.http.put<SchoolClass>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  archive(id: string): Observable<SchoolClass> {
    return this.http.post<SchoolClass>(`${this.apiUrl}/${id}/archive`, {});
  }

  getSubjects(classId: string): Observable<ClassSubject[]> {
    return this.http.get<ClassSubject[]>(`${this.apiUrl}/${classId}/subjects`);
  }

  assignSubject(classId: string, subjectId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${classId}/subjects`, { subjectId });
  }

  removeSubject(classId: string, subjectId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${classId}/subjects/${subjectId}`);
  }
}
