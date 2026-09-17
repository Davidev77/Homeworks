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
  /** Libros ordenados desde el top de la pila */
  @Input({ required: true }) books: Book[] = [];

  /** Se emite cuando el usuario pide sacar (pop) el libro del top de la pila */
  @Output() popBook = new EventEmitter<void>();
}
