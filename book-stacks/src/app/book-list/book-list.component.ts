import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../models/book.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css',
})
export class BookListComponent {
  /** Libros ordenados con el top de la pila primero. */
  @Input({ required: true }) books: Book[] = [];

  @Output() removeTopRequested = new EventEmitter<void>();

  onRemoveTop(): void {
    this.removeTopRequested.emit();
  }
}
