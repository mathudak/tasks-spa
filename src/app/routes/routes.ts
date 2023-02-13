import { Routes } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full'},
  { path: 'tasks', component: TasksComponent, pathMatch: 'full'}
]