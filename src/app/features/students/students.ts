import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SchoolClass } from '../../models/class.model';
import { Student } from '../../models/student.model';
import { ClassService } from '../../services/class.service';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-students',
  imports: [
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './students.html',
  styleUrl: './students.scss'
})
export class Students {
  private readonly studentService = inject(StudentService);
  private readonly classService = inject(ClassService);

  readonly students = signal<Student[]>([]);
  readonly classes = signal<SchoolClass[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly expandedStudentId = signal<string | null>(null);
  readonly selectedClassIds = signal<Record<string, string>>({});

  readonly displayedColumns = [
    'student',
    'grade',
    'className',
    'gender',
    'dateOfBirth',
    'status',
    'actions'
  ];

  readonly hasStudents = computed(() => this.students().length > 0);

  constructor() {
    this.loadStudents();
    this.loadClasses();
  }

  fullName(student: Student): string {
    return [student.firstName, student.middleName, student.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'status-chip status-active';
      case 'inactive':
        return 'status-chip status-inactive';
      case 'archived':
        return 'status-chip status-archived';
      default:
        return 'status-chip';
    }
  }

  isExpanded(studentId: string): boolean {
    return this.expandedStudentId() === studentId;
  }

  toggleDetails(studentId: string): void {
    this.expandedStudentId.set(this.isExpanded(studentId) ? null : studentId);
  }

  selectedClassValue(student: Student): string {
    return this.selectedClassIds()[student.id] ?? student.classId ?? '';
  }

  onClassSelectionChange(studentId: string, classId: string): void {
    this.selectedClassIds.update((current) => ({
      ...current,
      [studentId]: classId
    }));
  }

  assignOrChangeClass(student: Student): void {
    const classId = this.selectedClassIds()[student.id] ?? student.classId ?? '';

    if (!classId) {
      this.error.set('Please select a class before assigning it.');
      return;
    }

    const request$ = student.classId
      ? this.studentService.changeClass(student.id, classId)
      : this.studentService.assignClass(student.id, classId);

    request$.subscribe({
      next: () => {
        this.error.set(null);
        this.loadStudents();
      },
      error: () => {
        this.error.set('Failed to update student class.');
      }
    });
  }

  removeStudentClass(student: Student): void {
    this.studentService.removeClass(student.id).subscribe({
      next: () => {
        this.error.set(null);
        this.loadStudents();
      },
      error: () => {
        this.error.set('Failed to remove student class.');
      }
    });
  }

  private loadClasses(): void {
    this.classService.getAll().subscribe({
      next: (classes) => {
        this.classes.set(classes);
      },
      error: () => {
        this.error.set('Failed to load classes.');
      }
    });
  }

  private loadStudents(): void {
    this.loading.set(true);
    this.error.set(null);

    this.studentService.getAll().subscribe({
      next: (students) => {
        this.students.set(students);
        this.loading.set(false);

        const selections: Record<string, string> = {};
        students.forEach((student) => {
          if (student.classId) {
            selections[student.id] = student.classId;
          }
        });

        this.selectedClassIds.set(selections);
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
    const confirmed = window.confirm('Archive this student? This action cannot be undone.');

    if (!confirmed) {
      return;
    }

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