import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-students',
  imports: [RouterLink],
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