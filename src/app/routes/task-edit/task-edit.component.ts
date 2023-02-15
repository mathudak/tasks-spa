import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, iif, mergeMap, of, Subject, takeUntil, tap } from 'rxjs';
import { DynamicControl, EControlType, ETaskType, IDynamicForm, ITask, IVacuumClean, IWashDishes } from 'src/app/core/interfaces';
import { FormFactoryService } from 'src/app/core/providers';
import { TasksService } from 'src/app/core/services';
import { EmptyTask } from 'src/app/shared/constants/dynamic-form.constants';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit, OnDestroy {
  commonForm!: IDynamicForm;
  dynamicForm!: IDynamicForm;

  isNewTask: boolean = false;
  untilDestroyed$: Subject<boolean> = new Subject<boolean>;
  
  constructor(
    private route: ActivatedRoute, 
    private tasksService: TasksService,
    private formFactory: FormFactoryService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      mergeMap(({id}) => 
        iif(
          () => !!id,
          this.tasksService.getTask(id),
          of(EmptyTask)
        )
      ),
      takeUntil(this.untilDestroyed$)
    )
    .subscribe(task => {
      const commonControls = this.formFactory.processTaskObject(task);
      this.commonForm = this.formFactory.buildForm(commonControls);

      const toggler = commonControls.find(c => c.getDynamicControl().type === EControlType.SELECT);
      if (!!toggler) {
        this.setTypeFields(toggler, task);
        toggler.control.updateValueAndValidity({emitEvent: true});
      }
    });  
  }

  private setTypeFields(toggler: DynamicControl, task: ITask): void {
    toggler.control.valueChanges
      .pipe(
        takeUntil(this.untilDestroyed$)
      )
      .subscribe(val => {
        let dynamicControls: Array<DynamicControl> = [];
        if(val === ETaskType.VACUUM_CLEAN) {
          const fields = task.fields as IVacuumClean;
          dynamicControls = this.formFactory.createVacuumControls(fields.who, fields.room)
        } else {
          const fields = task.fields as IWashDishes;
          dynamicControls = this.formFactory.createDishWashControls(fields.durationInHours)
        }

        this.dynamicForm = this.formFactory.buildForm(dynamicControls);
      })
  }

  ngOnDestroy(): void {
    this.untilDestroyed$.next(true);
    this.untilDestroyed$.unsubscribe();
  }
}
