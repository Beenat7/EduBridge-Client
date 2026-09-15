import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  DirectMessage,
  CreateDirectMessageRequest,
} from '../models/direct-message.model';

import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class DirectMessageService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${API_CONFIG.baseUrl}/DirectMessages`;

  getAll(filters?: {
    schoolId?: string;
    studentId?: string;
    participantId?: string;
    participantType?: 'Parent' | 'Teacher';
  }): Observable<DirectMessage[]> {
    let params = new HttpParams();

    if (filters?.schoolId) {
      params = params.set('schoolId', filters.schoolId);
    }

    if (filters?.studentId) {
      params = params.set('studentId', filters.studentId);
    }

    if (filters?.participantId) {
      params = params.set('participantId', filters.participantId);
    }

    if (filters?.participantType) {
      params = params.set('participantType', filters.participantType);
    }

    return this.http.get<DirectMessage[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<DirectMessage> {
    return this.http.get<DirectMessage>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateDirectMessageRequest): Observable<DirectMessage> {
    return this.http.post<DirectMessage>(this.apiUrl, request);
  }

  markAsRead(id: string): Observable<DirectMessage> {
    return this.http.put<DirectMessage>(
      `${this.apiUrl}/${id}/read`,
      {},
    );
  }
}