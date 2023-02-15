import { Routes } from '@angular/router';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TasksComponent } from './tasks/tasks.component';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full'},
  { path: 'tasks', component: TasksComponent, pathMatch: 'full'},
  { path: 'task/:id', component: TaskEditComponent, pathMatch: 'full'},
  { path: 'task', component: TaskEditComponent, pathMatch: 'full'}
]