import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../auth/auth.service';
import { SchoolService } from '../../services/school.service';
import { StudentService } from '../../services/student.service';
import { ParentService } from '../../services/parent.service';
import { TeacherService } from '../../services/teacher.service';
import { SubjectService } from '../../services/subject.service';
import { ClassService } from '../../services/class.service';
import { AnnouncementService } from '../../services/announcement.service';
import { DirectMessageService } from '../../services/direct-message.service';
import { forkJoin } from 'rxjs';

interface DashboardCounts {
  schools: number;
  students: number;
  parents: number;
  teachers: number;
  subjects: number;
  classes: number;
  announcements: number;
  directMessages: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  private readonly authService = inject(AuthService);
  private readonly schoolService = inject(SchoolService);
  private readonly studentService = inject(StudentService);
  private readonly parentService = inject(ParentService);
  private readonly teacherService = inject(TeacherService);
  private readonly subjectService = inject(SubjectService);
  private readonly classService = inject(ClassService);
  private readonly announcementService = inject(AnnouncementService);
  private readonly directMessageService = inject(DirectMessageService);
  readonly currentUser = this.authService.currentUser;
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly counts = signal<DashboardCounts>({
    schools: 0,
    students: 0,
    parents: 0,
    teachers: 0,
    subjects: 0,
    classes: 0,
    announcements: 0,
    directMessages: 0
  });

  readonly metrics = computed(() => [
    { label: 'Schools', value: this.counts().schools, route: '/schools', icon: 'school' },
    { label: 'Students', value: this.counts().students, route: '/students', icon: 'people' },
    { label: 'Parents', value: this.counts().parents, route: '/parents', icon: 'family_restroom' },
    { label: 'Teachers', value: this.counts().teachers, route: '/teachers', icon: 'person' },
    { label: 'Subjects', value: this.counts().subjects, route: '/subjects', icon: 'menu_book' },
    { label: 'Classes', value: this.counts().classes, route: '/classes', icon: 'class' },
    { label: 'Announcements', value: this.counts().announcements, route: '/announcements', icon: 'campaign' },
    { label: 'Direct Messages', value: this.counts().directMessages, route: '/direct-messages', icon: 'mail' }
  ]);

  readonly quickActions = [
    { label: 'Add School', route: '/schools/new', icon: 'add_business' },
    { label: 'Add Student', route: '/students/new', icon: 'person_add' },
    { label: 'Add Parent', route: '/parents/new', icon: 'group_add' },
    { label: 'Add Teacher', route: '/teachers/new', icon: 'person_add_alt_1' },
    { label: 'Add Subject', route: '/subjects/new', icon: 'library_add' },
    { label: 'Add Class', route: '/classes/new', icon: 'class' },
    { label: 'Add Announcement', route: '/announcements/new', icon: 'campaign' },
    { label: 'New Message', route: '/direct-messages/new', icon: 'mail' }
  ];

  constructor() {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      schools: this.schoolService.getAll(),
      students: this.studentService.getAll(),
      parents: this.parentService.getAll(),
      teachers: this.teacherService.getAll(),
      subjects: this.subjectService.getAll(),
      classes: this.classService.getAll(),
      announcements: this.announcementService.getAll(),
      directMessages: this.directMessageService.getAll()
    }).subscribe({
      next: (result) => {
        this.counts.set({
          schools: result.schools.length,
          students: result.students.length,
          parents: result.parents.length,
          teachers: result.teachers.length,
          subjects: result.subjects.length,
          classes: result.classes.length,
          announcements: result.announcements.length,
          directMessages: result.directMessages.length
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load dashboard data.');
        this.loading.set(false);
      }
    });
  }
}
