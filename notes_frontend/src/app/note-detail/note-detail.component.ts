import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Note } from '../notes.model';
import { CommonModule, DatePipe } from '@angular/common';

/* Use the browser built-in confirm */

// PUBLIC_INTERFACE
@Component({
  selector: 'note-detail',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './note-detail.component.html',
  styleUrl: './note-detail.component.css'
})
export class NoteDetailComponent {
  @Input() note: Note | null = null;
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  onEdit() {
    this.edit.emit();
  }
/* global window */
  onDelete() {
    // Only use confirm if window is defined (client-side)
    if (typeof window !== 'undefined' && window.confirm('Delete this note?')) {
      this.delete.emit();
    }
  }
}
