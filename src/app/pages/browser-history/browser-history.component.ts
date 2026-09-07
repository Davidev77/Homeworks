import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BrowserDoublyLinkedList,
  MOCK_AVAILABLE_PAGES,
  MOCK_INITIAL_HISTORY,
  PageVisit
} from '../../models/browser-doubly-linked-list';

@Component({
  selector: 'app-browser-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './browser-history.component.html',
  styleUrl: './browser-history.component.css'
})
export class BrowserHistoryComponent implements OnInit {
  private history = new BrowserDoublyLinkedList();

  currentPage: PageVisit | null = null;
  historyList: PageVisit[] = [];
  currentIndex = 0;

  availablePages = MOCK_AVAILABLE_PAGES;

  ngOnInit(): void {
    // Inicializa el historial con las páginas de ejemplo
    MOCK_INITIAL_HISTORY.forEach((page) => this.history.visit(page));

    this.refresh();
  }

  goBack(): void {
    const page = this.history.back();
    if (page) {
      this.refresh();
    }
  }

  goForward(): void {
    const page = this.history.forward();
    if (page) {
      this.refresh();
    }
  }

  visit(page: PageVisit): void {
    this.history.visit(page);
    this.refresh();
  }

  get canGoBack(): boolean {
    return this.history.canGoBack();
  }

  get canGoForward(): boolean {
    return this.history.canGoForward();
  }

  private refresh(): void {
    this.currentPage = this.history.getCurrent();
    this.historyList = this.history.toArray();
    this.currentIndex = this.history.currentIndex();
  }
}
