export interface PageVisit {
  title: string;
  url: string;
}

// double linked list
export class PageNode {
  next: PageNode | null = null;
  prev: PageNode | null = null;

  constructor(public page: PageVisit) {}
}

export class BrowserDoublyLinkedList {
  private head: PageNode | null = null;
  private tail: PageNode | null = null;
  private current: PageNode | null = null;
  private length = 0;

  visit(page: PageVisit): void {
    const node = new PageNode(page);

    if (!this.head || !this.current) {
      this.head = node;
      this.tail = node;
      this.current = node;
      this.length = 1;
      return;
    }

    node.prev = this.current;
    this.current.next = node;
    this.current = node;
    this.tail = node;

    this.recount();
  }

  back(): PageVisit | null {
    if (this.current?.prev) {
      this.current = this.current.prev;
      return this.current.page;
    }
    return null; 
  }

  forward(): PageVisit | null {
    if (this.current?.next) {
      this.current = this.current.next;
      return this.current.page;
    }
    return null; 
  }

  getCurrent(): PageVisit | null {
    return this.current ? this.current.page : null;
  }

  canGoBack(): boolean {
    return !!this.current?.prev;
  }

  canGoForward(): boolean {
    return !!this.current?.next;
  }

  size(): number {
    return this.length;
  }

  // Hace un array de las paginas visitadas
  toArray(): PageVisit[] {
    const result: PageVisit[] = [];
    let node = this.head;
    while (node) {
      result.push(node.page);
      node = node.next;
    }
    return result;
  }

  currentIndex(): number {
    let index = -1;
    let i = 0;
    let node = this.head;
    while (node) {
      if (node === this.current) {
        index = i;
        break;
      }
      node = node.next;
      i++;
    }
    return index;
  }

  private recount(): void {
    let count = 0;
    let node = this.head;
    while (node) {
      count++;
      node = node.next;
    }
    this.length = count;
  }
}

export const MOCK_INITIAL_HISTORY: PageVisit[] = [
  { title: 'Google', url: 'https://www.google.com' },
  { title: 'Wikipedia', url: 'https://es.wikipedia.org' },
  { title: 'GitHub', url: 'https://github.com' }
];

export const MOCK_AVAILABLE_PAGES: PageVisit[] = [
  { title: 'Google', url: 'https://www.google.com' },
  { title: 'Wikipedia', url: 'https://es.wikipedia.org' },
  { title: 'GitHub', url: 'https://github.com' },
  { title: 'Stack Overflow', url: 'https://stackoverflow.com' },
  { title: 'YouTube', url: 'https://www.youtube.com' },
  { title: 'Mozilla', url: 'https://www.mozilla.org' }
];
