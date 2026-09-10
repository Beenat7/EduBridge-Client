import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { Subject } from '../models/subject.model';

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
}
