import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { DirectMessage } from '../../models/direct-message.model';
import { DirectMessageService } from '../../services/direct-message.service';

@Component({
  selector: 'app-direct-messages',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
  ],
  templateUrl: './direct-messages.html',
  styleUrl: './direct-messages.scss',
})
export class DirectMessages implements OnInit {
  private readonly directMessageService = inject(DirectMessageService);

  readonly messages = signal<DirectMessage[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.directMessageService.getAll().subscribe({
      next: (messages) => {
        this.messages.set(messages);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load direct messages.');
        this.isLoading.set(false);
      },
    });
  }

  markAsRead(message: DirectMessage): void {
    if (message.isRead) {
      return;
    }

    this.directMessageService.markAsRead(message.id).subscribe({
      next: (updatedMessage) => {
        this.messages.update((messages) =>
          messages.map((item) =>
            item.id === updatedMessage.id ? updatedMessage : item,
          ),
        );
      },
    });
  }
}