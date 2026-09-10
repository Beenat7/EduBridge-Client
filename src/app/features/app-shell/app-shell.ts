import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss'
})
export class AppShell {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentUser = this.authService.currentUser;
  readonly sidenavOpen = signal(true);
  readonly isMobile = signal(false);

  readonly userRole = computed(() => {
    const user = this.currentUser();
    return user?.roles?.[0] ?? 'User';
  });

  readonly navigationItems = [
    { label: 'Schools', route: '/schools', icon: 'school' },
    { label: 'Students', route: '/students', icon: 'people' }
  ];

  readonly futureNavigation = [
    { label: 'Parents', route: null, icon: 'family_restroom' },
    { label: 'Teachers', route: null, icon: 'person' },
    { label: 'Classes', route: null, icon: 'class' },
    { label: 'Subjects', route: null, icon: 'menu_book' }
  ];

  constructor() {
    this.updateLayoutMode();
    window.addEventListener('resize', this.updateLayoutMode.bind(this));
  }

  toggleSidenav(): void {
    this.sidenavOpen.update((open) => !open);
  }

  closeSidenav(): void {
    if (this.isMobile()) {
      this.sidenavOpen.set(false);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  private updateLayoutMode(): void {
    const mobile = window.innerWidth < 960;
    this.isMobile.set(mobile);

    if (mobile) {
      this.sidenavOpen.set(false);
    } else {
      this.sidenavOpen.set(true);
    }
  }
}
