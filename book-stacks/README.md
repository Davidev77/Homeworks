# Book-Stacks

A small Angular app that stores books in a real **Stack (LIFO)** data
structure. Each book has a **Name**, **ISBN**, **Author** and **Editorial**.

## Features

- `src/app/models/stack.ts` — a generic `Stack<T>` class (`push`, `pop`,
  `peek`, `isEmpty`, `size`, `toArray`) implemented from scratch.
- `src/app/services/book-stack.service.ts` — an Angular service that owns a
  `Stack<Book>`, preloads it with mock data, and exposes it as a reactive
  `signal`.
- `src/app/book-form` — a reactive form to create a new book and push it
  onto the stack.
- `src/app/book-list` — prints the stack on screen, top of stack first.

## Getting started

```bash
npm install
npm start
```

Then open http://localhost:4200.

## Build

```bash
npm run build
```
