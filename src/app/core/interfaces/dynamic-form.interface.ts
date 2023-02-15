import { FormControl, Validators } from "@angular/forms";

export enum EControlType {
  INPUT = 'input',
  SELECT = 'select',
  DATE = 'date',
  TEXTAREA = 'textarea',
  RADIO = 'radio',
  CHECKBOX = 'checkbox'
}

type TOption = {[key: string]: string | number};

export interface IDynamicControl {
  name: string;
  type: EControlType;
  label: string;
  options?: Array<TOption>;
  control: FormControl;
}

export class DynamicControl {
  private name!: string;
  private type!: EControlType;
  private label!: string;
  private value!: string | number | boolean;
  private options?: Array<TOption>;
  private control!: FormControl;

  constructor(name: string, value: string | number | boolean, type: EControlType) {
    this.name = name;
    this.type = type;
    this.value = value;
    this.label = name.charAt(0).toUpperCase() + name.slice(1);

    this.setControl();
  }

  setOptions(options: Array<TOption>): void {
    this.options = options;
  }

  setControl(required: boolean = true) {
    this.control = new FormControl(this.value, required ? Validators.required : null);
  }

  getControl(): IDynamicControl {
    return {
      name: this.name,
      label: this.label,
      type: this.type,
      control: this.control,
      options: this.options
    };
  }
}