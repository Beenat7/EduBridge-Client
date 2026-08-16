import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-students',
  imports: [
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './students.html',
  styleUrl: './students.scss'
})
export class Students {
  private readonly studentService = inject(StudentService);

  readonly students = signal<Student[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.loadStudents();
  }

  private loadStudents(): void {
    this.loading.set(true);
    this.error.set(null);

    this.studentService.getAll().subscribe({
      next: (students) => {
        this.students.set(students);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load students.');
        this.loading.set(false);
      }
    });
  }

  activateStudent(id: string): void {
    this.studentService.activate(id).subscribe({
      next: () => {
        this.loadStudents();
      },
      error: () => {
        this.error.set('Failed to activate student.');
      }
    });
  }

  deactivateStudent(id: string): void {
    this.studentService.deactivate(id).subscribe({
      next: () => {
        this.loadStudents();
      },
      error: () => {
        this.error.set('Failed to deactivate student.');
      }
    });
  }

  archiveStudent(id: string): void {
    this.studentService.archive(id).subscribe({
      next: () => {
        this.loadStudents();
      },
      error: () => {
        this.error.set('Failed to archive student.');
      }
    });
  }
}