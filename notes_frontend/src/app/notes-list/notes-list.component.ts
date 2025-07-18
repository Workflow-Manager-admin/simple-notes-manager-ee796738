import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Note } from '../notes.model';
import { CommonModule, DatePipe } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  selector: 'notes-list',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.css'
})
export class NotesListComponent {
  @Input() notes: Note[] = [];
  @Input() selectedNoteId: string | null = null;
  @Output() noteSelect = new EventEmitter<Note>();
  @Output() createNew = new EventEmitter<void>();

  onSelect(note: Note) {
    this.noteSelect.emit(note);
  }
  onCreate() {
    this.createNew.emit();
  }
}
