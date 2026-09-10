import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { School } from '../../models/school.model';
import { CreateSubjectRequest, UpdateSubjectRequest } from '../../models/subject.model';
import { SchoolService } from '../../services/school.service';
import { SubjectService } from '../../services/subject.service';

@Component({
  selector: 'app-subject-form',
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
  templateUrl: './subject-form.html',
  styleUrl: './subject-form.scss'
})
export class SubjectForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly subjectService = inject(SubjectService);
  private readonly schoolService = inject(SchoolService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isEditMode = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly schools = signal<School[]>([]);

  private subjectId: string | null = null;

  readonly subjectForm = this.formBuilder.nonNullable.group({
    schoolId: ['', Validators.required],
    name: ['', Validators.required],
    code: ['', Validators.required],
    description: ['']
  });

  constructor() {
    this.subjectId = this.route.snapshot.paramMap.get('id');
    this.loadSchools();

    if (this.subjectId) {
      this.isEditMode.set(true);
      this.loadSubject(this.subjectId);
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

  private loadSubject(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.subjectService.getById(id).subscribe({
      next: (subject) => {
        this.subjectForm.patchValue({
          schoolId: subject.schoolId,
          name: subject.name,
          code: subject.code,
          description: subject.description
        });

        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load subject.');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.subjectForm.invalid) {
      this.subjectForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    if (this.isEditMode() && this.subjectId) {
      const request: UpdateSubjectRequest = this.subjectForm.getRawValue();

      this.subjectService.update(this.subjectId, request).subscribe({
        next: () => {
          this.router.navigate(['/subjects']);
        },
        error: () => {
          this.error.set('Failed to update subject.');
          this.loading.set(false);
        }
      });

      return;
    }

    const request: CreateSubjectRequest = this.subjectForm.getRawValue();

    this.subjectService.create(request).subscribe({
      next: () => {
        this.router.navigate(['/subjects']);
      },
      error: () => {
        this.error.set('Failed to create subject.');
        this.loading.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/subjects']);
  }
}
