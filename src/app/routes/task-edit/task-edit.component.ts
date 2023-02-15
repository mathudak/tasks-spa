import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, iif, mergeMap, Subject, takeUntil, tap } from 'rxjs';
import { TasksService } from 'src/app/core/services';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit, OnDestroy {
  untilDestroyed$: Subject<boolean> = new Subject<boolean>;
  
  constructor(private route: ActivatedRoute, private tasksService: TasksService) {}

  ngOnInit(): void {
    this.route.params.pipe(
      tap(params => console.log('Params:', params)),
      mergeMap(({id}) => 
        iif(
          () => !!id,
          this.tasksService.getTask(id),
          EMPTY
        )
      ),
      takeUntil(this.untilDestroyed$)
    )
    .subscribe(res => {
      console.log('RES:', res);
    });  
  }

  ngOnDestroy(): void {
    this.untilDestroyed$.next(true);
    this.untilDestroyed$.unsubscribe();
  }
}
