import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicControl, EControlType, ETaskType, IDynamicForm, ITask } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class FormFactoryService {

  constructor() { }

  /**
   * Takse ITask object as a parameter and creates an array of DynamicControl objects.
   * Since the ITASK object is flat and does not contain more specific parameters for
   * each and every field, some of the control properties are hardcoded.
   * 
   * This can be easily replaced by extending ITask DTO.
   * 
   * @param task - ITask object
   * @returns Array<DynamicControl>
   */
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

  /**
   * Helper function to create from controls for Dish Wash form. 
   * 
   * @param value - current value of 'durationInHours' field
   * @returns Array<DynamicControl>
   */
  createDishWashControls(value: number): Array<DynamicControl> {  
    return [this.createCustomControl('durationInHours', value, EControlType.INPUT)];
  }

  /**
   * Helper function to create from controls for Dish Wash form. 
   * 
   * @param whoValue - current value of 'who' field
   * @param roomValue - current value of 'room' field 
   * @returns Array<DynamicControl>
   */
  createVacuumControls(whoValue: string, roomValue: string): Array<DynamicControl> {
    return [
      this.createCustomControl('who', whoValue, EControlType.INPUT),
      this.createCustomControl('room', roomValue, EControlType.INPUT)
    ];  
  }

  /**
   * Helper function which creates DynamicControl object according to specified input parameters
   * 
   * @param name - control name 
   * @param value - value of the new control. Set to empty string if undefined
   * @param type - control type from EControlType enum
   * @returns DynamicControl
   */
  createCustomControl(name: string, value: string | number | boolean | undefined, type: EControlType): DynamicControl {
    return new DynamicControl(name, value || '', type);
  }

  /**
   * Builds a new FormGroup and adds controls to it from provided array of DynamicControls
   * 
   * @param controls - array of DynamicControls which are added to the result Form
   * @returns IDynamicForm
   */
  buildForm(controls: Array<DynamicControl>): IDynamicForm {
    const form = new FormGroup({});

    controls.forEach(c => {
      const { name, control} = c.getDynamicControl();
      form.addControl(name, control);
    })

    return { form, controls };
  }
}
 