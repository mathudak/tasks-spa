import { Component, OnInit } from '@angular/core';
import { ITask } from 'src/app/core/interfaces';
import { TasksService } from 'src/app/core/services';
import { Observable, EMPTY, of } from 'rxjs';
import { filter, finalize, switchMap, tap } from 'rxjs/operators';
import { ModalService } from 'src/app/core/providers';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit{
  tasks$: Observable <Array<ITask>> = EMPTY;
  taskID: string = '';
  modalID: string = Date.now().toString();

  constructor(private tasksService: TasksService, private modalService: ModalService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.tasks$ = this.tasksService.getTasks().pipe(tap(t => console.log(t)));
  }

  deleteTask(_id: string | undefined): void {
    if(!!_id) {
      this.taskID = _id;
      this.modalService.open(this.modalID);
    }
  }

  close(confirmDelete: boolean = false): void {
    of(confirmDelete).pipe(
      filter(confirmDelete => confirmDelete),
      switchMap(() => this.tasksService.deleteTask(this.taskID)),
      finalize(() => {
        this.taskID = '';
        this.modalService.close();
      })
    ).subscribe(() => {
      this.loadTasks();
    });    
  }

  addNewTask(): void {
    console.log('Add new task');
  }
}
