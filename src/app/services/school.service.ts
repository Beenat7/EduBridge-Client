import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { School,
    CreateSchoolRequest,
    UpdateSchoolRequest
 } from '../models/school.model';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${API_CONFIG.baseUrl}/Schools`;

  getAll(): Observable<School[]> {
    return this.http.get<School[]>(this.apiUrl);
  }

  getById(id: string): Observable<School> {
    return this.http.get<School>(`${
        this.apiUrl}/${id}`);
  }
  create(request: CreateSchoolRequest): Observable<School> {
    return this.http.post<School>(
        this.apiUrl, request);
  }

  update(
    id: string,
    request: UpdateSchoolRequest
  ): Observable<School> {
    return this.http.put<School>(
      `${this.apiUrl}/${id}`,
      request
    );
  }
  archive(id: string): Observable<School> {
    return this.http.post<School>(
      `${this.apiUrl}/${id}/archive`,
      {}
    );
  }

  activate(id: string): Observable<School> {
    return this.http.put<School>(
      `${this.apiUrl}/${id}/activate`,
      {}
    );
  }

  deactivate(id: string): Observable<School> {
    return this.http.put<School>(
      `${this.apiUrl}/${id}/deactivate`,
      {}
    );
  }
}