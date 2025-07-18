import { Injectable } from '@angular/core';
import { Note } from './notes.model';

/* global window */
const NOTES_KEY = 'notes-db';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class NotesService {
  /** Loads all notes from storage. */
  getNotes(): Note[] {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(NOTES_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as Note[];
    // Restore Date fields
    return data.map(n => ({
      ...n,
      createdAt: new Date(n.createdAt),
      updatedAt: new Date(n.updatedAt),
    }));
  }
  /** Gets a note by id. */
  getNote(id: string): Note | undefined {
    return this.getNotes().find(n => n.id === id);
  }
  /** Creates a new note. */
  createNote(note: Omit<Note, 'id'|'createdAt'|'updatedAt'>): Note {
    const notes = this.getNotes();
    const now = new Date();
    const newNote: Note = {
      ...note,
      id: (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : Math.random().toString(36).slice(2)),
      createdAt: now,
      updatedAt: now,
    };
    notes.unshift(newNote);
    this.saveAll(notes);
    return newNote;
  }
  /** Updates an existing note. */
  updateNote(id: string, update: Partial<Omit<Note, 'id'|'createdAt'|'updatedAt'>>): Note | undefined {
    const notes = this.getNotes();
    const idx = notes.findIndex(n => n.id === id);
    if (idx === -1) return undefined;
    notes[idx] = {
      ...notes[idx],
      ...update,
      updatedAt: new Date(),
    };
    this.saveAll(notes);
    return notes[idx];
  }
  /** Deletes a note by id. */
  deleteNote(id: string): void {
    const notes = this.getNotes().filter(n => n.id !== id);
    this.saveAll(notes);
  }
  /** Persists the entire notes array. */
  private saveAll(notes: Note[]) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }
  /** Clears all notes (not for production use). */
  clearAll() {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(NOTES_KEY);
  }
}
