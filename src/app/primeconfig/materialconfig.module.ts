import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [CommonModule,FormsModule,ReactiveFormsModule,MatButtonModule],
})
export class MaterialConfigModule {}
