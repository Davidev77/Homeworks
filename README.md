# Fila del Cajero (ATM Queue)

Una app de Angular que gestiona una fila de personas esperando un cajero
automático, usando una verdadera estructura de datos de **Cola (FIFO)**.
Cada persona tiene **Nombre**, **Monto a retirar** y una **fecha de
llegada asignada al azar por el sistema**.

## Características

- `src/app/models/queue.ts` — una clase genérica `Queue<T>` (`enqueue`,
  `dequeue`, `front`, `isEmpty`, `size`, `toArray`) implementada desde cero.
- `src/app/services/person-queue.service.ts` — un servicio de Angular que
  mantiene una `Queue<Person>`, la llena con datos de ejemplo, asigna una
  fecha de llegada aleatoria a cada persona, y expone la fila como un
  `signal` reactivo **ordenado por fecha de llegada**.
- `src/app/person-form` — un formulario reactivo para registrar una nueva
  persona y encolarla (push) en la fila.
- `src/app/person-list` — imprime la fila en pantalla, ordenada por hora
  de llegada, con un botón para atender (dequeue) a la siguiente persona.

## Cómo correrlo

```bash
npm install
npm start
```

Luego abre http://localhost:4200.

## Build

```bash
npm run build
```
