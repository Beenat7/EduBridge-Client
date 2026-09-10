import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { School } from '../../models/school.model';
import { ClassSubject, SchoolClass } from '../../models/class.model';
import { Subject } from '../../models/subject.model';
import { SchoolService } from '../../services/school.service';
import { ClassService } from '../../services/class.service';
import { SubjectService } from '../../services/subject.service';

@Component({
  selector: 'app-classes',
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './classes.html',
  styleUrl: './classes.scss'
})
export class Classes {
  private readonly classService = inject(ClassService);
  private readonly schoolService = inject(SchoolService);
  private readonly subjectService = inject(SubjectService);

  readonly classes = signal<SchoolClass[]>([]);
  readonly schools = signal<School[]>([]);
  readonly subjects = signal<Subject[]>([]);
  readonly classSubjects = signal<Record<string, ClassSubject[]>>({});
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly expandedClassId = signal<string | null>(null);
  readonly selectedSubjectIds = signal<Record<string, string>>({});

  readonly displayedColumns = [
    'class',
    'gradeLevel',
    'section',
    'school',
    'status',
    'actions'
  ];

  readonly hasClasses = computed(() => this.classes().length > 0);

  constructor() {
    this.loadSchools();
    this.loadSubjects();
    this.loadClasses();
  }

  allSubjectsForSchool(schoolId: string): Subject[] {
    return this.subjects().filter((subject) => subject.schoolId === schoolId);
  }

  schoolName(schoolClass: SchoolClass): string {
    const school = this.schools().find((item) => item.id === schoolClass.schoolId);
    return school ? school.name : 'Unknown school';
  }

  assignedSubjects(classId: string): ClassSubject[] {
    return this.classSubjects()[classId] ?? [];
  }

  selectedSubjectValue(classId: string): string {
    return this.selectedSubjectIds()[classId] ?? '';
  }

  onSubjectSelectionChange(classId: string, subjectId: string): void {
    this.selectedSubjectIds.update((current) => ({
      ...current,
      [classId]: subjectId
    }));
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

  isExpanded(classId: string): boolean {
    return this.expandedClassId() === classId;
  }

  toggleDetails(classId: string): void {
    this.expandedClassId.set(this.isExpanded(classId) ? null : classId);
  }

  activateClass(id: string): void {
    this.classService.activate(id).subscribe({
      next: () => this.loadClasses(),
      error: () => this.error.set('Failed to activate class.')
    });
  }

  deactivateClass(id: string): void {
    this.classService.deactivate(id).subscribe({
      next: () => this.loadClasses(),
      error: () => this.error.set('Failed to deactivate class.')
    });
  }

  archiveClass(id: string): void {
    const confirmed = window.confirm('Archive this class? This action cannot be undone.');

    if (!confirmed) {
      return;
    }

    this.classService.archive(id).subscribe({
      next: () => this.loadClasses(),
      error: () => this.error.set('Failed to archive class.')
    });
  }

  assignSelectedSubject(classId: string): void {
    const subjectId = this.selectedSubjectIds()[classId];

    if (!subjectId) {
      this.error.set('Please select a subject before assigning it.');
      return;
    }

    this.classService.assignSubject(classId, subjectId).subscribe({
      next: () => {
        this.error.set(null);
        this.loadClassSubjects(classId);
      },
      error: () => {
        this.error.set('Failed to assign subject to class.');
      }
    });
  }

  removeSubjectFromClass(classId: string, subjectId: string): void {
    this.classService.removeSubject(classId, subjectId).subscribe({
      next: () => {
        this.error.set(null);
        this.loadClassSubjects(classId);
      },
      error: () => {
        this.error.set('Failed to remove subject from class.');
      }
    });
  }

  private loadSchools(): void {
    this.schoolService.getAll().subscribe({
      next: (schools) => this.schools.set(schools),
      error: () => this.error.set('Failed to load schools.')
    });
  }

  private loadSubjects(): void {
    this.subjectService.getAll().subscribe({
      next: (subjects) => this.subjects.set(subjects),
      error: () => this.error.set('Failed to load subjects.')
    });
  }

  private loadClasses(): void {
    this.loading.set(true);
    this.error.set(null);

    this.classService.getAll().subscribe({
      next: (classes) => {
        this.classes.set(classes);
        this.loading.set(false);

        classes.forEach((schoolClass) => this.loadClassSubjects(schoolClass.id));
      },
      error: () => {
        this.error.set('Failed to load classes.');
        this.loading.set(false);
      }
    });
  }

  private loadClassSubjects(classId: string): void {
    this.classService.getSubjects(classId).subscribe({
      next: (subjects) => {
        this.classSubjects.update((current) => ({
          ...current,
          [classId]: subjects
        }));
      },
      error: () => {
        this.classSubjects.update((current) => ({
          ...current,
          [classId]: []
        }));
      }
    });
  }
}
