import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute,  Router } from '@angular/router';
import { debounceTime, iif, mergeMap, of, Subject, takeUntil, tap } from 'rxjs';
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

  taskID: string | undefined = undefined;
  saveSuccessful: boolean = false;
  untilDestroyed$: Subject<boolean> = new Subject<boolean>;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute, 
    private tasksService: TasksService,
    private formFactory: FormFactoryService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      tap(({id}) => this.taskID = id),
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
      this.handleCommonForm(task);
    });  
  }

  saveNew(): void {
    const task = this.getFormsValues();
    this.tasksService.addTask(task).pipe(
      tap(() => this.saveSuccessful = true),
      debounceTime(1500)
    ).subscribe(() => this.router.navigate(['..']));
  }

  saveEdits(): void {
    const task = this.getFormsValues();
    this.tasksService.editTask(task).pipe(
      tap(() => this.saveSuccessful = true),
      debounceTime(1500)
    ).subscribe(() => this.router.navigate(['..']));
  }

  private getFormsValues(): ITask {
    const {name, type } = this.commonForm.form.value;
    const fields = this.dynamicForm.form.value;
    return !!this.taskID ? {_id: this.taskID, name, type, fields } : { name, type, fields };
  }

  cancel(): void {
    
  }

  private handleCommonForm(task: ITask): void {
    const commonControls = this.formFactory.processTaskObject(task);
    this.commonForm = this.formFactory.buildForm(commonControls);

    const toggler = commonControls.find(c => c.getDynamicControl().type === EControlType.SELECT);
    if (!!toggler) {
      this.setTypeFields(toggler, task);
      toggler.control.updateValueAndValidity({emitEvent: true});
    }
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
