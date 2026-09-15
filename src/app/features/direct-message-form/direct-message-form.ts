import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import {
  CreateDirectMessageRequest,
} from '../../models/direct-message.model';

import { DirectMessageService } from '../../services/direct-message.service';
import { SchoolService } from '../../services/school.service';
import { StudentService } from '../../services/student.service';
import { ParentService } from '../../services/parent.service';
import { TeacherService } from '../../services/teacher.service';

import { School } from '../../models/school.model';
import { Student } from '../../models/student.model';
import { Parent } from '../../models/parent.model';
import { Teacher } from '../../models/teacher.model';

@Component({
  selector: 'app-direct-message-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './direct-message-form.html',
  styleUrl: './direct-message-form.scss',
})
export class DirectMessageForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly directMessageService = inject(DirectMessageService);
  private readonly schoolService = inject(SchoolService);
  private readonly studentService = inject(StudentService);
  private readonly parentService = inject(ParentService);
  private readonly teacherService = inject(TeacherService);
  private readonly router = inject(Router);

  readonly schools = signal<School[]>([]);
  readonly students = signal<Student[]>([]);
  readonly parents = signal<Parent[]>([]);
  readonly teachers = signal<Teacher[]>([]);

  readonly isLoadingSchools = signal(false);
  readonly isLoadingStudents = signal(false);
  readonly isLoadingParticipants = signal(false);
  readonly isSubmitting = signal(false);

  readonly errorMessage = signal('');

  readonly participantTypes = ['Parent', 'Teacher'] as const;

  readonly messageForm = this.fb.nonNullable.group({
    schoolId: ['', [Validators.required]],
    studentId: ['', [Validators.required]],

    senderType: ['Parent' as 'Parent' | 'Teacher', [Validators.required]],
    senderId: ['', [Validators.required]],

    recipientType: [
      'Teacher' as 'Parent' | 'Teacher',
      [Validators.required],
    ],
    recipientId: ['', [Validators.required]],

    body: ['', [Validators.required, Validators.maxLength(2000)]],
  });

  ngOnInit(): void {
    this.loadSchools();

    this.messageForm.controls.schoolId.valueChanges.subscribe((schoolId) => {
      this.messageForm.controls.studentId.setValue('');
      this.messageForm.controls.senderId.setValue('');
      this.messageForm.controls.recipientId.setValue('');

      this.students.set([]);
      this.parents.set([]);
      this.teachers.set([]);

      if (schoolId) {
        this.loadSchoolData(schoolId);
      }
    });

    this.messageForm.controls.senderType.valueChanges.subscribe(() => {
      this.messageForm.controls.senderId.setValue('');
    });

    this.messageForm.controls.recipientType.valueChanges.subscribe(() => {
      this.messageForm.controls.recipientId.setValue('');
    });
  }

  loadSchools(): void {
    this.isLoadingSchools.set(true);

    this.schoolService.getAll().subscribe({
      next: (schools) => {
        this.schools.set(schools);
        this.isLoadingSchools.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load schools.');
        this.isLoadingSchools.set(false);
      },
    });
  }

  loadSchoolData(schoolId: string): void {
    this.loadStudents(schoolId);
    this.loadParticipants(schoolId);
  }

  loadStudents(schoolId: string): void {
    this.isLoadingStudents.set(true);

    this.studentService.getAll().subscribe({
      next: (students) => {
        this.students.set(
          students.filter((student) => student.schoolId === schoolId),
        );

        this.isLoadingStudents.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load students.');
        this.isLoadingStudents.set(false);
      },
    });
  }

  loadParticipants(schoolId: string): void {
    this.isLoadingParticipants.set(true);

    this.parentService.getAll().subscribe({
      next: (parents) => {
        this.parents.set(
          parents.filter((parent) => parent.schoolId === schoolId),
        );

        this.loadTeachers(schoolId);
      },
      error: () => {
        this.errorMessage.set('Failed to load parents.');
        this.isLoadingParticipants.set(false);
      },
    });
  }

  loadTeachers(schoolId: string): void {
    this.teacherService.getAll().subscribe({
      next: (teachers) => {
        this.teachers.set(
          teachers.filter((teacher) => teacher.schoolId === schoolId),
        );

        this.isLoadingParticipants.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load teachers.');
        this.isLoadingParticipants.set(false);
      },
    });
  }

  submit(): void {
    if (this.messageForm.invalid) {
      this.messageForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const request: CreateDirectMessageRequest =
      this.messageForm.getRawValue();

    this.directMessageService.create(request).subscribe({
      next: () => {
        this.router.navigate(['/direct-messages']);
      },
      error: () => {
        this.errorMessage.set('Failed to send the message.');
        this.isSubmitting.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/direct-messages']);
  }
}