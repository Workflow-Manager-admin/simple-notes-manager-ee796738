import { Routes } from '@angular/router';
import { NotesViewComponent } from './notes-view/notes-view.component';

export const routes: Routes = [
  { path: '', component: NotesViewComponent },
  { path: '**', redirectTo: '' }
];
