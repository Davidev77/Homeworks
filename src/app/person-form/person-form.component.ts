import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

export interface NewPersonRequest {
  name: string;
  withdrawalAmount: number;
}

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './person-form.component.html',
  styleUrl: './person-form.component.css',
})
export class PersonFormComponent {
  @Output() personSubmitted = new EventEmitter<NewPersonRequest>();

  private fb = new FormBuilder();

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    withdrawalAmount: [
      null as number | null,
      [Validators.required, Validators.min(1000)],
    ],
  });

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, withdrawalAmount } = this.form.getRawValue();
    this.personSubmitted.emit({
      name,
      withdrawalAmount: withdrawalAmount as number,
    });
    this.form.reset();
  }
}
