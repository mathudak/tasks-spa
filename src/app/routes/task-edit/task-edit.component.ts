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

  /**
   * Processes URL parameter 'ID' and either calls function to load task by ID
   * or provides and EmptyTask to create a Common Form
   */
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

  /**
   * Saves new Task, without provided ID
   */
  saveNew(): void {
    const task = this.getFormsValues();
    this.tasksService.addTask(task).pipe(
      tap(() => this.saveSuccessful = true),
      debounceTime(1500)
    ).subscribe(() => this.cancel());
  }

  /**
   * Saves changes to the Task, when ID was provided
   */
  saveEdits(): void {
    const task = this.getFormsValues();
    this.tasksService.editTask(task).pipe(
      tap(() => this.saveSuccessful = true),
      debounceTime(1500)
    ).subscribe(() => this.cancel());
  }

  private getFormsValues(): ITask {
    const {name, type } = this.commonForm.form.value;
    let fields = this.dynamicForm.form.value;

    // Lazy solution to make sure 'durationInHours' is number
    if (type === ETaskType.WASH_DISHES) {
      const helper = fields as IWashDishes;
      helper.durationInHours = parseFloat(helper.durationInHours.toString());
      fields = {...fields, ...helper};
    }

    return !!this.taskID ? {_id: this.taskID, name, type, fields } : { name, type, fields };
  }

  cancel(): void {
    this.router.navigate(['/', 'tasks']);
  }

  /**
   * Creates 'Common' form from fields that are same for all task types.
   * Sets 'toggle' functionality for Type select.
   * 
   * @param task - ITask object
   */
  private handleCommonForm(task: ITask): void {
    const commonControls = this.formFactory.processTaskObject(task);
    this.commonForm = this.formFactory.buildForm(commonControls);

    const toggler = commonControls.find(c => c.getDynamicControl().type === EControlType.SELECT);
    if (!!toggler) {
      this.setTypeFields(toggler, task);
      toggler.control.updateValueAndValidity({emitEvent: true});
    }
  }

  /**
   * Bind 'toggle' functionality to provided control of 'SELECT' type which
   * allows form dynamic change of displayed form.
   * 
   * @param toggler - DynamicControl object containing the 'Toggler' controler
   * @param task - Currently displayed Task to provide values for a newly created form
   */
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
