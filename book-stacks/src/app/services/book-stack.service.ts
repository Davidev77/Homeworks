import { Injectable, signal } from '@angular/core';
import { Book } from '../models/book.model';
import { Stack } from '../models/stack';

const MOCK_BOOKS: Book[] = [
  {
    name: 'Cien años de soledad',
    isbn: '978-0-06-088328-7',
    author: 'Gabriel García Márquez',
    editorial: 'Editorial Sudamericana',
  },
  {
    name: 'La sombra del viento',
    isbn: '978-0-13-235088-4',
    author: 'Carlos Ruiz Zafón',
    editorial: 'Planeta',
  },
  {
    name: 'El alquimista',
    isbn: '978-0-547-92822-7',
    author: 'Paulo Coelho',
    editorial: 'Planeta',
  },
  {
    name: 'Rayuela',
    isbn: '978-0-06-231609-7',
    author: 'Julio Cortázar',
    editorial: 'Editorial Sudamericana',
  },
];

@Injectable({ providedIn: 'root' })
export class BookStackService {
  private stack = new Stack<Book>();

  /** Instantánea reactiva y de solo lectura de la pila (el top primero) */
  readonly books = signal<Book[]>([]);

  constructor() {
    MOCK_BOOKS.forEach((book) => this.stack.push(book));
    this.refresh();
  }

  /** Agrega un libro al top de la pila. */
  addBook(book: Book): void {
    this.stack.push(book);
    this.refresh();
  }

  /** Quita el libro del top de la pila, si existe. */
  removeTop(): Book | undefined {
    const removed = this.stack.pop();
    this.refresh();
    return removed;
  }

  get size(): number {
    return this.stack.size;
  }

  isEmpty(): boolean {
    return this.stack.isEmpty();
  }

  private refresh(): void {
    this.books.set(this.stack.toArray());
  }
}
