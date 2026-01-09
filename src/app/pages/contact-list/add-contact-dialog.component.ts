import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-contact-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>New Contact</h2>
    <mat-dialog-content>
      <div class="d-flex flex-column gap-3 pt-2">
        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Full Name</mat-label>
          <input
            matInput
            [(ngModel)]="data.fullName"
            placeholder="e.g. John Doe"
            required
          />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Mobile Number</mat-label>
          <input
            matInput
            [(ngModel)]="data.mobile"
            type="tel"
            maxlength="10"
            placeholder="9876543210"
            required
          />
          <mat-hint align="end">{{ data.mobile.length }} / 10</mat-hint>
        </mat-form-field>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="mb-2 me-2">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="!data.fullName || data.mobile.length < 10"
        (click)="onSave()"
      >
        Save Contact
      </button>
    </mat-dialog-actions>
  `,
})
export class AddContactDialogComponent {
  data = { fullName: '', mobile: '' };

  constructor(public dialogRef: MatDialogRef<AddContactDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data);
  }
}
