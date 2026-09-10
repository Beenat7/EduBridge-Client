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
import { CreateClassRequest, UpdateClassRequest } from '../../models/class.model';
import { SchoolService } from '../../services/school.service';
import { ClassService } from '../../services/class.service';

@Component({
  selector: 'app-class-form',
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
  templateUrl: './class-form.html',
  styleUrl: './class-form.scss'
})
export class ClassForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly classService = inject(ClassService);
  private readonly schoolService = inject(SchoolService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isEditMode = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly schools = signal<School[]>([]);

  private classId: string | null = null;

  readonly classForm = this.formBuilder.nonNullable.group({
    schoolId: ['', Validators.required],
    name: ['', Validators.required],
    gradeLevel: ['', Validators.required],
    section: ['', Validators.required]
  });

  readonly gradeLevels = [
    'KG1',
    'KG2',
    'Grade1',
    'Grade2',
    'Grade3',
    'Grade4',
    'Grade5',
    'Grade6',
    'Grade7',
    'Grade8',
    'Grade9',
    'Grade10',
    'Grade11',
    'Grade12'
  ];

  constructor() {
    this.classId = this.route.snapshot.paramMap.get('id');
    this.loadSchools();

    if (this.classId) {
      this.isEditMode.set(true);
      this.loadClass(this.classId);
    }
  }

  private loadSchools(): void {
    this.schoolService.getAll().subscribe({
      next: (schools) => this.schools.set(schools),
      error: () => this.error.set('Failed to load schools.')
    });
  }

  private loadClass(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.classService.getById(id).subscribe({
      next: (schoolClass) => {
        this.classForm.patchValue({
          schoolId: schoolClass.schoolId,
          name: schoolClass.name,
          gradeLevel: schoolClass.gradeLevel,
          section: schoolClass.section
        });

        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load class.');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.classForm.invalid) {
      this.classForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    if (this.isEditMode() && this.classId) {
      const request: UpdateClassRequest = this.classForm.getRawValue();

      this.classService.update(this.classId, request).subscribe({
        next: () => this.router.navigate(['/classes']),
        error: () => {
          this.error.set('Failed to update class.');
          this.loading.set(false);
        }
      });

      return;
    }

    const request: CreateClassRequest = this.classForm.getRawValue();

    this.classService.create(request).subscribe({
      next: () => this.router.navigate(['/classes']),
      error: () => {
        this.error.set('Failed to create class.');
        this.loading.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/classes']);
  }
}
