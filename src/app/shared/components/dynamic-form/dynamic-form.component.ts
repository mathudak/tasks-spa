import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EControlType, DynamicControl } from 'src/app/core/interfaces';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() controls!: Array<DynamicControl>;
  readonly controlType = EControlType;

  constructor() {}

  ngOnInit(): void {
    //
  }
}
