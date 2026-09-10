import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Parent } from '../../models/parent.model';
import { School } from '../../models/school.model';
import { ParentService } from '../../services/parent.service';
import { SchoolService } from '../../services/school.service';

@Component({
  selector: 'app-parents',
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
  templateUrl: './parents.html',
  styleUrl: './parents.scss'
})
export class Parents {
  private readonly parentService = inject(ParentService);
  private readonly schoolService = inject(SchoolService);

  readonly parents = signal<Parent[]>([]);
  readonly schools = signal<School[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly expandedParentId = signal<string | null>(null);

  readonly displayedColumns = ['parent', 'phone', 'school', 'status', 'actions'];
  readonly hasParents = computed(() => this.parents().length > 0);

  constructor() {
    this.loadParents();
    this.loadSchools();
  }

  fullName(parent: Parent): string {
    return [parent.firstName, parent.middleName, parent.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();
  }

  schoolName(parent: Parent): string {
    const school = this.schools().find((item) => item.id === parent.schoolId);
    return school ? school.name : 'Unknown school';
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

  isExpanded(parentId: string): boolean {
    return this.expandedParentId() === parentId;
  }

  toggleDetails(parentId: string): void {
    this.expandedParentId.set(this.isExpanded(parentId) ? null : parentId);
  }

  activateParent(id: string): void {
    this.parentService.activate(id).subscribe({
      next: () => {
        this.loadParents();
      },
      error: () => {
        this.error.set('Failed to activate parent.');
      }
    });
  }

  deactivateParent(id: string): void {
    this.parentService.deactivate(id).subscribe({
      next: () => {
        this.loadParents();
      },
      error: () => {
        this.error.set('Failed to deactivate parent.');
      }
    });
  }

  archiveParent(id: string): void {
    const confirmed = window.confirm('Archive this parent? This action cannot be undone.');

    if (!confirmed) {
      return;
    }

    this.parentService.archive(id).subscribe({
      next: () => {
        this.loadParents();
      },
      error: () => {
        this.error.set('Failed to archive parent.');
      }
    });
  }

  private loadParents(): void {
    this.loading.set(true);
    this.error.set(null);

    this.parentService.getAll().subscribe({
      next: (parents) => {
        this.parents.set(parents);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load parents.');
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
}
