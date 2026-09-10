import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import {
  CreateSubjectRequest,
  Subject,
  SubjectClass,
  SubjectTeacher,
  UpdateSubjectRequest
} from '../models/subject.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${API_CONFIG.baseUrl}/Subjects`;

  getAll(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.apiUrl);
  }

  getById(id: string): Observable<Subject> {
    return this.http.get<Subject>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateSubjectRequest): Observable<Subject> {
    return this.http.post<Subject>(this.apiUrl, request);
  }

  update(id: string, request: UpdateSubjectRequest): Observable<Subject> {
    return this.http.put<Subject>(`${this.apiUrl}/${id}`, request);
  }

  activate(id: string): Observable<Subject> {
    return this.http.put<Subject>(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivate(id: string): Observable<Subject> {
    return this.http.put<Subject>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  archive(id: string): Observable<Subject> {
    return this.http.post<Subject>(`${this.apiUrl}/${id}/archive`, {});
  }

  getClasses(subjectId: string): Observable<SubjectClass[]> {
    return this.http.get<SubjectClass[]>(`${this.apiUrl}/${subjectId}/classes`);
  }

  getTeachers(subjectId: string): Observable<SubjectTeacher[]> {
    return this.http.get<SubjectTeacher[]>(`${this.apiUrl}/${subjectId}/teachers`);
  }
}
