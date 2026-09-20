import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../auth/auth.service';
import { Announcement } from '../../models/announcement.model';
import { AnnouncementService } from '../../services/announcement.service';

@Component({
  selector: 'app-announcements',
  imports: [
    RouterLink,
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './announcements.html',
  styleUrl: './announcements.scss'
})
export class Announcements {
  private readonly authService = inject(AuthService);
  private readonly announcementService = inject(AnnouncementService);

  readonly announcements = signal<Announcement[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly userRole = computed(() => {
    return this.authService.currentUser()?.roles?.[0] ?? '';
  });

  readonly canManageAnnouncements = computed(() => {
    const role = this.userRole();

    return role === 'PlatformAdmin' || role === 'SchoolAdmin';
  });

  readonly displayedColumns = computed(() => {
    if (this.canManageAnnouncements()) {
      return [
        'announcement',
        'status',
        'createdAt',
        'actions'
      ];
    }

    return [
      'announcement',
      'status',
      'createdAt'
    ];
  });

  readonly hasAnnouncements = computed(
    () => this.announcements().length > 0
  );

  constructor() {
    this.loadAnnouncements();
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'draft':
        return 'status-chip status-draft';

      case 'published':
        return 'status-chip status-published';

      case 'archived':
        return 'status-chip status-archived';

      default:
        return 'status-chip';
    }
  }

  publishAnnouncement(id: string): void {
    if (!this.canManageAnnouncements()) {
      return;
    }

    this.announcementService.publish(id).subscribe({
      next: () => this.loadAnnouncements(),
      error: () => {
        this.error.set('Failed to publish announcement.');
      }
    });
  }

  archiveAnnouncement(id: string): void {
    if (!this.canManageAnnouncements()) {
      return;
    }

    const confirmed = window.confirm(
      'Archive this announcement?'
    );

    if (!confirmed) {
      return;
    }

    this.announcementService.archive(id).subscribe({
      next: () => this.loadAnnouncements(),
      error: () => {
        this.error.set('Failed to archive announcement.');
      }
    });
  }

  private loadAnnouncements(): void {
    this.loading.set(true);
    this.error.set(null);

    this.announcementService.getAll().subscribe({
      next: (announcements) => {
        this.announcements.set(announcements);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load announcements.');
        this.loading.set(false);
      }
    });
  }
}
