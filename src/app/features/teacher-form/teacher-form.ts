import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { School } from '../../models/school.model';
import { CreateTeacherRequest, UpdateTeacherRequest } from '../../models/teacher.model';
import { SchoolService } from '../../services/school.service';
import { TeacherService } from '../../services/teacher.service';

@Component({
  selector: 'app-teacher-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './teacher-form.html',
  styleUrl: './teacher-form.scss'
})
export class TeacherForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly teacherService = inject(TeacherService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly schoolService = inject(SchoolService);

  readonly isEditMode = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly schools = signal<School[]>([]);

  private teacherId: string | null = null;

  readonly teacherForm = this.formBuilder.nonNullable.group({
    schoolId: ['', Validators.required],
    firstName: ['', Validators.required],
    middleName: [''],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
    employeeCode: ['', Validators.required],
    hireDate: [null as Date | null, Validators.required]
  });

  constructor() {
    this.teacherId = this.route.snapshot.paramMap.get('id');
    this.loadSchools();

    if (this.teacherId) {
      this.isEditMode.set(true);
      this.loadTeacher(this.teacherId);
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

  private loadTeacher(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.teacherService.getById(id).subscribe({
      next: (teacher) => {
        this.teacherForm.patchValue({
          schoolId: teacher.schoolId,
          firstName: teacher.firstName,
          middleName: teacher.middleName,
          lastName: teacher.lastName,
          email: teacher.email,
          phoneNumber: teacher.phoneNumber,
          employeeCode: teacher.employeeCode,
          hireDate: teacher.hireDate ? new Date(teacher.hireDate) : null
        });

        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load teacher.');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.teacherForm.invalid) {
      this.teacherForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    if (this.isEditMode() && this.teacherId) {
      const request: UpdateTeacherRequest = {
        firstName: this.teacherForm.controls.firstName.value,
        middleName: this.teacherForm.controls.middleName.value,
        lastName: this.teacherForm.controls.lastName.value,
        email: this.teacherForm.controls.email.value,
        phoneNumber: this.teacherForm.controls.phoneNumber.value,
        employeeCode: this.teacherForm.controls.employeeCode.value,
        hireDate: this.teacherForm.controls.hireDate.value!.toISOString().slice(0, 10)
      };

      this.teacherService.update(this.teacherId, request).subscribe({
        next: () => {
          this.router.navigate(['/teachers']);
        },
        error: () => {
          this.error.set('Failed to update teacher.');
          this.loading.set(false);
        }
      });

      return;
    }

    const formValue = this.teacherForm.getRawValue();

    const request: CreateTeacherRequest = {
      schoolId: formValue.schoolId,
      firstName: formValue.firstName,
      middleName: formValue.middleName,
      lastName: formValue.lastName,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      employeeCode: formValue.employeeCode,
      hireDate: formValue.hireDate!.toISOString().slice(0, 10)
    };

    this.teacherService.create(request).subscribe({
      next: () => {
        this.router.navigate(['/teachers']);
      },
      error: () => {
        this.error.set('Failed to create teacher.');
        this.loading.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/teachers']);
  }
}
