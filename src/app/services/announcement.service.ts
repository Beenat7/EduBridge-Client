import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Announcement,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
} from '../models/announcement.model';

import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${API_CONFIG.baseUrl}/Announcements`;

  getAll(schoolId?: string): Observable<Announcement[]> {
    let params = new HttpParams();

    if (schoolId) {
      params = params.set('schoolId', schoolId);
    }

    return this.http.get<Announcement[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Announcement> {
    return this.http.get<Announcement>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateAnnouncementRequest): Observable<Announcement> {
    return this.http.post<Announcement>(this.apiUrl, request);
  }

  update(
    id: string,
    request: UpdateAnnouncementRequest,
  ): Observable<Announcement> {
    return this.http.put<Announcement>(
      `${this.apiUrl}/${id}`,
      request,
    );
  }

  publish(id: string): Observable<Announcement> {
    return this.http.put<Announcement>(
      `${this.apiUrl}/${id}/publish`,
      {},
    );
  }

  archive(id: string): Observable<Announcement> {
    return this.http.post<Announcement>(
      `${this.apiUrl}/${id}/archive`,
      {},
    );
  }
}