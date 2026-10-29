import { Injectable, computed, signal } from '@angular/core';
import { City, GraphLink, GraphNode, Person } from './graph.model';

@Injectable({ providedIn: 'root' })
export class GraphService {
  private nextId = 1;

  readonly cities = signal<City[]>([]);
  readonly people = signal<Person[]>([]);

  /** Cada persona y cada ciudad es un nodo */
  readonly nodes = computed<GraphNode[]>(() => [
    ...this.cities().map((c) => ({ id: c.id, label: c.name, kind: 'city' as const })),
    ...this.people().map((p) => ({
      id: p.id,
      label: `${p.name} (${p.age})`,
      kind: 'person' as const,
      cityId: p.cityId,
    })),
  ]);

  /** Un enlace por persona, apuntando a su ciudad */
  readonly links = computed<GraphLink[]>(() =>
    this.people().map((p) => ({ source: p.id, target: p.cityId }))
  );

  constructor() {
    const bogota = this.addCity('Bogotá')!;
    const cali = this.addCity('Cali')!;
    const medellin = this.addCity('Medellín')!;
    this.addPerson('Ana', 28, cali.id);
    this.addPerson('Luis', 34, cali.id);
    this.addPerson('Marta', 41, bogota.id);
    this.addPerson('Carlos', 23, medellin.id);
    this.addPerson('Sofía', 30, bogota.id);
  }

  addCity(name: string): City | null {
    const clean = name.trim();
    if (!clean) return null;
    const exists = this.cities().some((c) => c.name.toLowerCase() === clean.toLowerCase());
    if (exists) return null;
    const city: City = { id: `c${this.nextId++}`, name: clean };
    this.cities.update((list) => [...list, city]);
    return city;
  }

  addPerson(name: string, age: number, cityId: string): Person | null {
    const clean = name.trim();
    const validCity = this.cities().some((c) => c.id === cityId);
    if (!clean || !(age >= 0) || !validCity) return null;
    const person: Person = { id: `p${this.nextId++}`, name: clean, age, cityId };
    this.people.update((list) => [...list, person]);
    return person;
  }

  peopleIn(cityId: string): Person[] {
    return this.people().filter((p) => p.cityId === cityId);
  }
}
