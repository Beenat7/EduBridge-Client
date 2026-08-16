import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  CreateStudentRequest,
  UpdateStudentRequest
} from '../../models/student.model';

import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-form',
  imports: [ReactiveFormsModule],
  templateUrl: './student-form.html',
  styleUrl: './student-form.scss'
})
export class StudentForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly studentService = inject(StudentService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isEditMode = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private studentId: string | null = null;

  readonly studentForm = this.formBuilder.nonNullable.group({
    firstName: ['', Validators.required],
    middleName: ['', Validators.required],
    lastName: ['', Validators.required],
    studentCode: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    gender: ['', Validators.required],
    schoolId: ['', Validators.required],
    grade: ['', Validators.required]
  });

  constructor() {
    this.studentId = this.route.snapshot.paramMap.get('id');

    if (this.studentId) {
      this.isEditMode.set(true);

      // Student code and school are not editable.
      this.studentForm.controls.studentCode.disable();
      this.studentForm.controls.schoolId.disable();

      this.loadStudent(this.studentId);
    }
  }

  private loadStudent(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.studentService.getById(id).subscribe({
      next: (student) => {
        this.studentForm.patchValue({
          firstName: student.firstName,
          middleName: student.middleName,
          lastName: student.lastName,
          studentCode: student.studentCode,
          dateOfBirth: student.dateOfBirth.substring(0, 10),
          gender: student.gender,
          schoolId: student.schoolId,
          grade: student.grade
        });

        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load student.');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    if (this.isEditMode() && this.studentId) {
      const request: UpdateStudentRequest = {
        firstName: this.studentForm.controls.firstName.value,
        middleName: this.studentForm.controls.middleName.value,
        lastName: this.studentForm.controls.lastName.value,
        dateOfBirth: this.studentForm.controls.dateOfBirth.value,
        gender: this.studentForm.controls.gender.value,
        grade: this.studentForm.controls.grade.value
      };

      this.studentService.update(this.studentId, request).subscribe({
        next: () => {
          this.router.navigate(['/students']);
        },
        error: () => {
          this.error.set('Failed to update student.');
          this.loading.set(false);
        }
      });

      return;
    }

    const request: CreateStudentRequest =
      this.studentForm.getRawValue();

    this.studentService.create(request).subscribe({
      next: () => {
        this.router.navigate(['/students']);
      },
      error: () => {
        this.error.set('Failed to create student.');
        this.loading.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/students']);
  }
}