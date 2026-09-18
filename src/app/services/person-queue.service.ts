import { Injectable, signal } from '@angular/core';
import { Person } from '../models/person.model';
import { Queue } from '../models/queue';

/**
 * Genera una fecha de llegada aleatoria, asignada por el 
 * cajero: un momento entre ahora y hasta `withinMinutes` minutos atrás.
 * Esto simula que las personas no necesariamente llegaron en el mismo
 * orden en que fueron registradas
 */
function randomArrivalDate(withinMinutes = 180): Date {
  const now = Date.now();
  const offsetMs = Math.floor(Math.random() * withinMinutes) * 60_000;
  return new Date(now - offsetMs);
}

const NOMBRES_DE_EJEMPLO: Array<{ name: string; withdrawalAmount: number }> = [
  { name: 'Lionel Messi', withdrawalAmount: 150000 },
  { name: 'Cristiano Ronaldo', withdrawalAmount: 80000 },
  { name: 'Lebron James', withdrawalAmount: 320000 },
  { name: 'Stephen Curry', withdrawalAmount: 45000 },
];

@Injectable({ providedIn: 'root' })
export class PersonQueueService {
  private queue = new Queue<Person>();

  readonly people = signal<Person[]>([]);

  constructor() {
    NOMBRES_DE_EJEMPLO.forEach(({ name, withdrawalAmount }) => {
      this.queue.enqueue({
        name,
        withdrawalAmount,
        arrivalDate: randomArrivalDate(),
      });
    });
    this.refresh();
  }

  /**
   * Encola (push) a una nueva persona en la fila, asignándole una fecha
   * de llegada aleatoria generada por el sistema
   */
  addPerson(name: string, withdrawalAmount: number): void {
    this.queue.enqueue({
      name,
      withdrawalAmount,
      arrivalDate: randomArrivalDate(),
    });
    this.refresh();
  }

  /**
   * Atiende (dequeue) a la primera persona que entró al sistema,
   * es decir, la que está al frente de la fila FIFO.
   */
  serveNext(): Person | undefined {
    const served = this.queue.dequeue();
    this.refresh();
    return served;
  }

  get size(): number {
    return this.queue.size;
  }

  isEmpty(): boolean {
    return this.queue.isEmpty();
  }

  private refresh(): void {
    const sortedByArrival = [...this.queue.toArray()].sort(
      (a, b) => a.arrivalDate.getTime() - b.arrivalDate.getTime()
    );
    this.people.set(sortedByArrival);
  }
}
