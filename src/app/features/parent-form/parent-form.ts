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
import { Parent, CreateParentRequest, UpdateParentRequest } from '../../models/parent.model';
import { ParentService } from '../../services/parent.service';
import { SchoolService } from '../../services/school.service';

@Component({
  selector: 'app-parent-form',
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
  templateUrl: './parent-form.html',
  styleUrl: './parent-form.scss'
})
export class ParentForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly parentService = inject(ParentService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly schoolService = inject(SchoolService);

  readonly isEditMode = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly schools = signal<School[]>([]);

  private parentId: string | null = null;

  readonly parentForm = this.formBuilder.nonNullable.group({
    schoolId: ['', Validators.required],
    firstName: ['', Validators.required],
    middleName: [''],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required]
  });

  constructor() {
    this.parentId = this.route.snapshot.paramMap.get('id');
    this.loadSchools();

    if (this.parentId) {
      this.isEditMode.set(true);
      this.parentForm.controls.schoolId.disable();
      this.loadParent(this.parentId);
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

  private loadParent(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.parentService.getById(id).subscribe({
      next: (parent) => {
        this.parentForm.patchValue({
          schoolId: parent.schoolId,
          firstName: parent.firstName,
          middleName: parent.middleName,
          lastName: parent.lastName,
          email: parent.email,
          phoneNumber: parent.phoneNumber
        });

        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load parent.');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.parentForm.invalid) {
      this.parentForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    if (this.isEditMode() && this.parentId) {
      const request: UpdateParentRequest = {
        firstName: this.parentForm.controls.firstName.value,
        middleName: this.parentForm.controls.middleName.value,
        lastName: this.parentForm.controls.lastName.value,
        email: this.parentForm.controls.email.value,
        phoneNumber: this.parentForm.controls.phoneNumber.value
      };

      this.parentService.update(this.parentId, request).subscribe({
        next: () => {
          this.router.navigate(['/parents']);
        },
        error: () => {
          this.error.set('Failed to update parent.');
          this.loading.set(false);
        }
      });

      return;
    }

    const formValue = this.parentForm.getRawValue();

    const request: CreateParentRequest = {
      schoolId: formValue.schoolId,
      firstName: formValue.firstName,
      middleName: formValue.middleName,
      lastName: formValue.lastName,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber
    };

    this.parentService.create(request).subscribe({
      next: () => {
        this.router.navigate(['/parents']);
      },
      error: () => {
        this.error.set('Failed to create parent.');
        this.loading.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/parents']);
  }
}
