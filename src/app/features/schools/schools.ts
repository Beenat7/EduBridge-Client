import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { School } from '../../models/school.model';
import { SchoolService } from '../../services/school.service';

@Component({
  selector: 'app-schools',
  imports: [RouterLink],
  templateUrl: './schools.html',
  styleUrl: './schools.scss'
})
export class Schools{
  private readonly schoolService = inject(SchoolService);

  readonly schools = signal<School[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.loadSchools();
  }

  private loadSchools(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.schoolService.getAll().subscribe({
      next: (schools) => {
        this.schools.set(schools);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load schools.');
        this.loading.set(false);
      }
    });
  }
  activateSchool(id: string): void {
    this.schoolService.activate(id).subscribe({
      next: () => {
        this.loadSchools();
      },
      error: () => {
        this.error.set('Failed to activate school.');
      }
    });
  }

  deactivateSchool(id: string): void {
    this.schoolService.deactivate(id).subscribe({
      next: () => {
        this.loadSchools();
      },
      error: () => {
        this.error.set('Failed to deactivate school.');
      }
    });
  }

  archiveSchool(id: string): void {
    this.schoolService.archive(id).subscribe({
      next: () => {
        this.loadSchools();
      },
      error: () => {
        this.error.set('Failed to archive school.');
      }
    });
  }

}