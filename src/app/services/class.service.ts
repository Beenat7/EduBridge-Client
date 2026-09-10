import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { CreateClassRequest, SchoolClass } from '../models/class.model';

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

  update(id: string, request: CreateClassRequest): Observable<SchoolClass> {
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
}
