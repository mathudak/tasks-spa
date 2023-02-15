import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { routes } from './routes';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    TasksComponent,
    TaskEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    SharedModule
  ],
  exports: [RouterModule]
})
export class RoutesModule { }
