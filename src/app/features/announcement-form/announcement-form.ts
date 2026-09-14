import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { School } from '../../models/school.model';
import { SchoolService } from '../../services/school.service';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import {
  Announcement,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest
} from '../../models/announcement.model';
import { AnnouncementService } from '../../services/announcement.service';

@Component({
  selector: 'app-announcement-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './announcement-form.html',
  styleUrl: './announcement-form.scss'
})
export class AnnouncementForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly announcementService = inject(AnnouncementService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly schoolService = inject(SchoolService);

  readonly isEditMode = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly schools = signal<School[]>([]);

  private announcementId: string | null = null;

  readonly announcementForm = this.formBuilder.nonNullable.group({
    schoolId: ['', Validators.required],
    title: ['', Validators.required],
    body: ['', Validators.required]
  });

  constructor() {
    this.announcementId = this.route.snapshot.paramMap.get('id');
     this.loadSchools();

    if (this.announcementId) {
      this.isEditMode.set(true);
      this.announcementForm.controls.schoolId.disable();
      this.loadAnnouncement(this.announcementId);
    }
  }

  private loadSchools(): void {
  this.schoolService.getAll().subscribe({
    next: (schools) => {
      this.schools.set(schools);
    },
    error: () => {
      this.error.set('Failed to load schools.');
    }
  });
    }

  private loadAnnouncement(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.announcementService.getById(id).subscribe({
      next: (announcement) => {
        this.announcementForm.patchValue({
          schoolId: announcement.schoolId,
          title: announcement.title,
          body: announcement.body
        });

        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load announcement.');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.announcementForm.invalid) {
      this.announcementForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    if (this.isEditMode() && this.announcementId) {
      const request: UpdateAnnouncementRequest = {
        title: this.announcementForm.controls.title.value,
        body: this.announcementForm.controls.body.value
      };

      this.announcementService
        .update(this.announcementId, request)
        .subscribe({
          next: () => {
            this.router.navigate(['/announcements']);
          },
          error: () => {
            this.error.set('Failed to update announcement.');
            this.loading.set(false);
          }
        });

      return;
    }

    const formValue = this.announcementForm.getRawValue();

    const request: CreateAnnouncementRequest = {
      schoolId: formValue.schoolId,
      title: formValue.title,
      body: formValue.body
    };

    this.announcementService.create(request).subscribe({
      next: () => {
        this.router.navigate(['/announcements']);
      },
      error: () => {
        this.error.set('Failed to create announcement.');
        this.loading.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/announcements']);
  }
}