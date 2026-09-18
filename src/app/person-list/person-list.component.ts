import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person } from '../models/person.model';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './person-list.component.html',
  styleUrl: './person-list.component.css',
})
export class PersonListComponent {
  /** Personas en fila, ordenadas por fecha de llegada (la más antigua primero). */
  @Input({ required: true }) people: Person[] = [];

  /** Se emite cuando el operador pide atender a la siguiente persona (dequeue). */
  @Output() serveNext = new EventEmitter<void>();

  formatTime(date: Date): string {
    return date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('es-CO');
  }
}
