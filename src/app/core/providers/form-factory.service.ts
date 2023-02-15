import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicControl, EControlType, ETaskType, IDynamicForm, ITask } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class FormFactoryService {

  constructor() { }

  processTaskObject(task: ITask | null): Array<DynamicControl> {
    // Create common form from ever occuring fields;
    const commonControls: Array<DynamicControl> = [];
    
    const nameControl = this.createCustomControl('name', task?.name, EControlType.INPUT);
    commonControls.push(nameControl);
    
    const typeControl = this.createCustomControl('type', task?.type, EControlType.SELECT);
    typeControl.setOptions([
      { value: ETaskType.WASH_DISHES, label: 'Wash Dishes' },
      { value: ETaskType.VACUUM_CLEAN, label: 'Vacuum Clean' }
    ]);
    commonControls.push(typeControl);

    return commonControls;
  }

  createDishWashControls(value: number): Array<DynamicControl> {  
    return [this.createCustomControl('durationInHours', value, EControlType.INPUT)];
  }

  createVacuumControls(whoValue: string, roomValue: string): Array<DynamicControl> {
    return [
      this.createCustomControl('who', whoValue, EControlType.INPUT),
      this.createCustomControl('room', roomValue, EControlType.INPUT)
    ];  
  }

  createCustomControl(name: string, value: string | number | boolean | undefined, type: EControlType): DynamicControl {
    return new DynamicControl(name, value || '', type);
  }

  buildForm(controls: Array<DynamicControl>): IDynamicForm {
    const form = new FormGroup({});

    controls.forEach(c => {
      const { name, control} = c.getDynamicControl();
      form.addControl(name, control);
      return c;
    })

    return { form, controls };
  }
}
