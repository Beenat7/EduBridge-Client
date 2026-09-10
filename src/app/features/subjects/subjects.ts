import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { School } from '../../models/school.model';
import { Subject, SubjectClass, SubjectTeacher } from '../../models/subject.model';
import { SchoolService } from '../../services/school.service';
import { SubjectService } from '../../services/subject.service';

@Component({
  selector: 'app-subjects',
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './subjects.html',
  styleUrl: './subjects.scss'
})
export class Subjects {
  private readonly subjectService = inject(SubjectService);
  private readonly schoolService = inject(SchoolService);

  readonly subjects = signal<Subject[]>([]);
  readonly schools = signal<School[]>([]);
  readonly subjectClasses = signal<Record<string, SubjectClass[]>>({});
  readonly subjectTeachers = signal<Record<string, SubjectTeacher[]>>({});
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly expandedSubjectId = signal<string | null>(null);

  readonly displayedColumns = [
    'subject',
    'code',
    'description',
    'school',
    'status',
    'actions'
  ];

  readonly hasSubjects = computed(() => this.subjects().length > 0);

  constructor() {
    this.loadSchools();
    this.loadSubjects();
  }

  schoolName(subject: Subject): string {
    const school = this.schools().find((item) => item.id === subject.schoolId);
    return school ? school.name : 'Unknown school';
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

  isExpanded(subjectId: string): boolean {
    return this.expandedSubjectId() === subjectId;
  }

  toggleDetails(subjectId: string): void {
    this.expandedSubjectId.set(this.isExpanded(subjectId) ? null : subjectId);
  }

  assignedClasses(subjectId: string): SubjectClass[] {
    return this.subjectClasses()[subjectId] ?? [];
  }

  assignedTeachers(subjectId: string): SubjectTeacher[] {
    return this.subjectTeachers()[subjectId] ?? [];
  }

  activateSubject(id: string): void {
    this.subjectService.activate(id).subscribe({
      next: () => {
        this.loadSubjects();
      },
      error: () => {
        this.error.set('Failed to activate subject.');
      }
    });
  }

  deactivateSubject(id: string): void {
    this.subjectService.deactivate(id).subscribe({
      next: () => {
        this.loadSubjects();
      },
      error: () => {
        this.error.set('Failed to deactivate subject.');
      }
    });
  }

  archiveSubject(id: string): void {
    const confirmed = window.confirm('Archive this subject? This action cannot be undone.');

    if (!confirmed) {
      return;
    }

    this.subjectService.archive(id).subscribe({
      next: () => {
        this.loadSubjects();
      },
      error: () => {
        this.error.set('Failed to archive subject.');
      }
    });
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

  private loadSubjects(): void {
    this.loading.set(true);
    this.error.set(null);

    this.subjectService.getAll().subscribe({
      next: (subjects) => {
        this.subjects.set(subjects);
        this.loading.set(false);

        subjects.forEach((subject) => {
          this.loadSubjectRelationships(subject.id);
        });
      },
      error: () => {
        this.error.set('Failed to load subjects.');
        this.loading.set(false);
      }
    });
  }

  private loadSubjectRelationships(subjectId: string): void {
    this.subjectService.getClasses(subjectId).subscribe({
      next: (classes) => {
        this.subjectClasses.update((current) => ({
          ...current,
          [subjectId]: classes
        }));
      },
      error: () => {
        this.subjectClasses.update((current) => ({
          ...current,
          [subjectId]: []
        }));
      }
    });

    this.subjectService.getTeachers(subjectId).subscribe({
      next: (teachers) => {
        this.subjectTeachers.update((current) => ({
          ...current,
          [subjectId]: teachers
        }));
      },
      error: () => {
        this.subjectTeachers.update((current) => ({
          ...current,
          [subjectId]: []
        }));
      }
    });
  }
}
