import { Component, OnInit } from '@angular/core';
import { ITask } from 'src/app/core/interfaces';
import { TasksService } from 'src/app/core/services';
import { Observable, EMPTY } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit{
  tasks$: Observable <Array<ITask>> = EMPTY;

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.tasks$ = this.tasksService.getTasks().pipe(tap(t => console.log(t)));
  }

  deleteTask(_id: string | undefined): void {
    console.log('Task ID to delete:', _id);
  }

  addNewTask(): void {
    console.log('Add new task');
  }
}
