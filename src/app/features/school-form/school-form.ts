import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


import {
  CreateSchoolRequest,
  UpdateSchoolRequest
} from '../../models/school.model';

import { SchoolService } from '../../services/school.service';

@Component({
  selector: 'app-school-form',
  imports: [ReactiveFormsModule,
            MatButtonModule,
            MatCardModule,
            MatFormFieldModule,
            MatIconModule,
            MatInputModule,
            MatProgressSpinnerModule
            ],
  templateUrl: './school-form.html',
  styleUrl: './school-form.scss'
})
export class SchoolForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly schoolService = inject(SchoolService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isEditMode = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private schoolId: string | null = null;

  readonly schoolForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
    address: ['', Validators.required]
  });

  constructor() {
    this.schoolId = this.route.snapshot.paramMap.get('id');

    if (this.schoolId) {
      this.isEditMode.set(true);
      this.loadSchool(this.schoolId);
    }
  }

  private loadSchool(id: string): void {
    this.loading.set(true);

    this.schoolService.getById(id).subscribe({
      next: (school) => {
        this.schoolForm.patchValue({
          name: school.name,
          code: school.code,
          email: school.email,
          phoneNumber: school.phoneNumber,
          address: school.address
        });

        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load school.');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.schoolForm.invalid) {
      this.schoolForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    if (this.isEditMode() && this.schoolId) {
      const request: UpdateSchoolRequest = this.schoolForm.getRawValue();

      this.schoolService.update(this.schoolId, request).subscribe({
        next: () => {
          this.router.navigate(['/schools']);
        },
        error: () => {
          this.error.set('Failed to update school.');
          this.loading.set(false);
        }
      });

      return;
    }

    const request: CreateSchoolRequest = this.schoolForm.getRawValue();

    this.schoolService.create(request).subscribe({
      next: () => {
        this.router.navigate(['/schools']);
      },
      error: () => {
        this.error.set('Failed to create school.');
        this.loading.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/schools']);
  }
}