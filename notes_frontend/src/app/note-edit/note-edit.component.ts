import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Note } from '../notes.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  selector: 'note-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './note-edit.component.html',
  styleUrl: './note-edit.component.css'
})
export class NoteEditComponent implements OnInit {
  @Input() note: Note | null = null;
  @Input() visible = false;
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<Omit<Note, 'id'|'createdAt'|'updatedAt'>>();

  form!: ReturnType<FormBuilder['group']>;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: [this.note?.title ?? '', [Validators.required, Validators.maxLength(120)]],
      content: [this.note?.content ?? '', [Validators.maxLength(6000)]]
    });
  }

  submit() {
    if (this.form.valid) {
      const { title, content } = this.form.value;
      this.save.emit({
        title: title || '',
        content: content ?? ''
      });
    }
  }

  close() {
    this.cancel.emit();
  }
}
