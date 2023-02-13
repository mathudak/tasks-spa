import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutSimpleComponent } from './layout-simple/layout-simple.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    LayoutSimpleComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    LayoutSimpleComponent
  ]
})
export class LayoutModule { }
