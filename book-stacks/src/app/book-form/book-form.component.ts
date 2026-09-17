import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from '../models/book.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css',
})
export class BookFormComponent {
  @Output() bookSubmitted = new EventEmitter<Book>();

  private fb = new FormBuilder();

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    isbn: [
      '',
      [Validators.required, Validators.pattern(/^[0-9Xx-]{10,17}$/)],
    ],
    author: ['', [Validators.required]],
    editorial: ['', [Validators.required]],
  });

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const book: Book = this.form.getRawValue();
    this.bookSubmitted.emit(book);
    this.form.reset();
  }
}
