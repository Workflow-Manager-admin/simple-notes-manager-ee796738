import { Component } from '@angular/core';
import { NotesListComponent } from '../notes-list/notes-list.component';
import { NoteDetailComponent } from '../note-detail/note-detail.component';
import { NoteEditComponent } from '../note-edit/note-edit.component';
import { NotesService } from '../notes.service';
import { Note } from '../notes.model';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  selector: 'notes-view',
  standalone: true,
  imports: [
    NotesListComponent,
    NoteDetailComponent,
    NoteEditComponent,
    CommonModule
  ],
  templateUrl: './notes-view.component.html',
  styleUrl: './notes-view.component.css'
})
export class NotesViewComponent {
  notes: Note[] = [];
  selectedNoteId: string | null = null;
  editDialogVisible = false;
  editNote: Note | null = null;

  constructor(private notesService: NotesService) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.notes = this.notesService.getNotes();
    if (this.selectedNoteId) {
      const found = this.notes.find(n => n.id === this.selectedNoteId);
      if (!found && this.notes.length) {
        this.selectedNoteId = this.notes[0].id;
      }
    }
  }
  onNoteSelect(note: Note) {
    this.selectedNoteId = note.id;
  }
  openCreateDialog() {
    this.editNote = null;
    this.editDialogVisible = true;
  }
  openEditDialog() {
    const note = this.notes.find(n => n.id === this.selectedNoteId);
    if (note) {
      this.editNote = {...note};
      this.editDialogVisible = true;
    }
  }
  onDialogCancel() {
    this.editDialogVisible = false;
    this.editNote = null;
  }
  onDialogSave(data: {title: string, content: string}) {
    if (this.editNote) {
      this.notesService.updateNote(this.editNote.id, {
        title: data.title,
        content: data.content
      });
    } else {
      const created = this.notesService.createNote({
        title: data.title,
        content: data.content
      });
      this.selectedNoteId = created.id;
    }
    this.editDialogVisible = false;
    this.editNote = null;
    this.loadAll();
  }
  onDelete() {
    if (this.selectedNoteId) {
      this.notesService.deleteNote(this.selectedNoteId);
      this.loadAll();
      if (this.notes.length > 0) {
        this.selectedNoteId = this.notes[0].id;
      } else {
        this.selectedNoteId = null;
      }
    }
  }

  get currentNote() {
    return this.notes.find(n => n.id === this.selectedNoteId) || null;
  }
}
