import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
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
import { School } from '../../models/school.model';
import { Subject, TeacherSubject } from '../../models/subject.model';
import { Teacher } from '../../models/teacher.model';
import { ClassService } from '../../services/class.service';
import { SchoolService } from '../../services/school.service';
import { SubjectService } from '../../services/subject.service';
import { TeacherService } from '../../services/teacher.service';

@Component({
  selector: 'app-teachers',
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
  templateUrl: './teachers.html',
  styleUrl: './teachers.scss'
})
export class Teachers {
  private readonly teacherService = inject(TeacherService);
  private readonly schoolService = inject(SchoolService);
  private readonly classService = inject(ClassService);
  private readonly subjectService = inject(SubjectService);

  readonly teachers = signal<Teacher[]>([]);
  readonly schools = signal<School[]>([]);
  readonly classes = signal<SchoolClass[]>([]);
  readonly subjects = signal<Subject[]>([]);
  readonly teacherSubjects = signal<Record<string, TeacherSubject[]>>({});
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly expandedTeacherId = signal<string | null>(null);
  readonly selectedClassIds = signal<Record<string, string>>({});
  readonly selectedSubjectIds = signal<Record<string, string>>({});

  readonly displayedColumns = [
    'teacher',
    'email',
    'phone',
    'className',
    'status',
    'actions'
  ];

  readonly hasTeachers = computed(() => this.teachers().length > 0);

  constructor() {
    this.loadTeachers();
    this.loadSchools();
    this.loadClasses();
    this.loadSubjects();
  }

  fullName(teacher: Teacher): string {
    return [teacher.firstName, teacher.middleName, teacher.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();
  }

  schoolName(teacher: Teacher): string {
    const school = this.schools().find((item) => item.id === teacher.schoolId);
    return school ? school.name : 'Unknown school';
  }

  className(teacher: Teacher): string {
    return teacher.className ?? 'Not assigned';
  }

  assignedSubjects(teacherId: string): TeacherSubject[] {
    return this.teacherSubjects()[teacherId] ?? [];
  }

  teacherSubjectOptions(teacher: Teacher): Subject[] {
    const teacherSchoolId = teacher.schoolId;

    return this.subjects().filter((subject) => subject.schoolId === teacherSchoolId);
  }

  selectedClassValue(teacher: Teacher): string {
    return this.selectedClassIds()[teacher.id] ?? teacher.classId ?? '';
  }

  selectedSubjectValue(teacherId: string): string {
    return this.selectedSubjectIds()[teacherId] ?? '';
  }

  onClassSelectionChange(teacherId: string, classId: string): void {
    this.selectedClassIds.update((current) => ({
      ...current,
      [teacherId]: classId
    }));
  }

  onSubjectSelectionChange(teacherId: string, subjectId: string): void {
    this.selectedSubjectIds.update((current) => ({
      ...current,
      [teacherId]: subjectId
    }));
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'status-chip status-pending';
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

  isExpanded(teacherId: string): boolean {
    return this.expandedTeacherId() === teacherId;
  }

  toggleDetails(teacherId: string): void {
    this.expandedTeacherId.set(this.isExpanded(teacherId) ? null : teacherId);
  }

  assignOrChangeClass(teacher: Teacher): void {
    const classId = this.selectedClassIds()[teacher.id] ?? teacher.classId ?? '';

    if (!classId) {
      this.error.set('Please select a class before assigning it.');
      return;
    }

    const request$ = teacher.classId
      ? this.teacherService.changeClass(teacher.id, classId)
      : this.teacherService.assignClass(teacher.id, classId);

    request$.subscribe({
      next: () => {
        this.error.set(null);
        this.loadTeachers();
      },
      error: () => {
        this.error.set('Failed to update teacher class assignment.');
      }
    });
  }

  removeTeacherClass(teacher: Teacher): void {
    this.teacherService.removeClass(teacher.id).subscribe({
      next: () => {
        this.error.set(null);
        this.loadTeachers();
      },
      error: () => {
        this.error.set('Failed to remove teacher class.');
      }
    });
  }

  assignSelectedSubject(teacherId: string): void {
    const subjectId = this.selectedSubjectIds()[teacherId];

    if (!subjectId) {
      this.error.set('Please select a subject before assigning it.');
      return;
    }

    this.teacherService.assignSubject(teacherId, subjectId).subscribe({
      next: () => {
        this.error.set(null);
        this.loadTeacherSubjects(teacherId);
      },
      error: () => {
        this.error.set('Failed to assign subject to teacher.');
      }
    });
  }

  removeSubjectFromTeacher(teacherId: string, subjectId: string): void {
    this.teacherService.removeSubject(teacherId, subjectId).subscribe({
      next: () => {
        this.error.set(null);
        this.loadTeacherSubjects(teacherId);
      },
      error: () => {
        this.error.set('Failed to remove subject from teacher.');
      }
    });
  }

  activateTeacher(id: string): void {
    this.teacherService.activate(id).subscribe({
      next: () => {
        this.loadTeachers();
      },
      error: () => {
        this.error.set('Failed to activate teacher.');
      }
    });
  }

  deactivateTeacher(id: string): void {
    this.teacherService.deactivate(id).subscribe({
      next: () => {
        this.loadTeachers();
      },
      error: () => {
        this.error.set('Failed to deactivate teacher.');
      }
    });
  }

  archiveTeacher(id: string): void {
    const confirmed = window.confirm('Archive this teacher? This action cannot be undone.');

    if (!confirmed) {
      return;
    }

    this.teacherService.archive(id).subscribe({
      next: () => {
        this.loadTeachers();
      },
      error: () => {
        this.error.set('Failed to archive teacher.');
      }
    });
  }

  private loadTeachers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.teacherService.getAll().subscribe({
      next: (teachers) => {
        this.teachers.set(teachers);
        this.loading.set(false);

        const classSelections: Record<string, string> = {};
        teachers.forEach((teacher) => {
          if (teacher.classId) {
            classSelections[teacher.id] = teacher.classId;
          }

          this.loadTeacherSubjects(teacher.id);
        });

        this.selectedClassIds.set(classSelections);
      },
      error: () => {
        this.error.set('Failed to load teachers.');
        this.loading.set(false);
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

  private loadSubjects(): void {
    this.subjectService.getAll().subscribe({
      next: (subjects) => {
        this.subjects.set(subjects);
      },
      error: () => {
        this.error.set('Failed to load subjects.');
      }
    });
  }

  private loadTeacherSubjects(teacherId: string): void {
    this.teacherService.getSubjects(teacherId).subscribe({
      next: (subjects) => {
        this.teacherSubjects.update((current) => ({
          ...current,
          [teacherId]: subjects
        }));
      },
      error: () => {
        this.teacherSubjects.update((current) => ({
          ...current,
          [teacherId]: []
        }));
      }
    });
  }
}
