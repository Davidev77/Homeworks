import { Component } from '@angular/core';
import { BookFormComponent } from './book-form/book-form.component';
import { BookListComponent } from './book-list/book-list.component';
import { BookStackService } from './services/book-stack.service';
import { Book } from './models/book.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BookFormComponent, BookListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private bookStack: BookStackService) {}

  get books() {
    return this.bookStack.books();
  }

  onBookSubmitted(book: Book): void {
    this.bookStack.addBook(book);
  }

  onPopBook(): void {
    this.bookStack.removeTop();
  }
}
