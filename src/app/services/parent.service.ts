import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { Parent, CreateParentRequest, UpdateParentRequest } from '../models/parent.model';

@Injectable({
  providedIn: 'root'
})
export class ParentService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${API_CONFIG.baseUrl}/Parents`;

  getAll(): Observable<Parent[]> {
    return this.http.get<Parent[]>(this.apiUrl);
  }

  getById(id: string): Observable<Parent> {
    return this.http.get<Parent>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateParentRequest): Observable<Parent> {
    return this.http.post<Parent>(this.apiUrl, request);
  }

  update(id: string, request: UpdateParentRequest): Observable<Parent> {
    return this.http.put<Parent>(`${this.apiUrl}/${id}`, request);
  }

  activate(id: string): Observable<Parent> {
    return this.http.put<Parent>(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivate(id: string): Observable<Parent> {
    return this.http.put<Parent>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  archive(id: string): Observable<Parent> {
    return this.http.post<Parent>(`${this.apiUrl}/${id}/archive`, {});
  }
}
