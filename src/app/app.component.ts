import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GraphService } from './graph.service';
import { GraphViewComponent } from './graph-view.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, GraphViewComponent],
  template: `
    <aside>
      <h1>Amigos y ciudades</h1>

      <section>
        <h2>Añade una ciudad</h2>
        <input [(ngModel)]="cityName" placeholder="Ciudad" (keyup.enter)="addCity()" />
        <button (click)="addCity()" [disabled]="!cityName.trim()">Añade una ciudad</button>
      </section>

      <section>
        <h2>Añade una persona</h2>
        <input [(ngModel)]="personName" placeholder="Nombre" />
        <input [(ngModel)]="personAge" type="number" min="0" placeholder="Edad" />
        <select [(ngModel)]="personCityId">
          <option value="" disabled>Vive en</option>
          @for (c of svc.cities(); track c.id) { <option [value]="c.id">{{ c.name }}</option> }
        </select>
        <button (click)="addPerson()"
                [disabled]="!personName.trim() || personAge === null || !personCityId">
          Añade una persona
        </button>
      </section>

      <section>
        <h2>Busca a los que viven en una ciudad</h2>
        <select [ngModel]="selectedCityId()" (ngModelChange)="selectedCityId.set($event)">
          <option [ngValue]="null">Escoge una ciudad</option>
          @for (c of svc.cities(); track c.id) { <option [ngValue]="c.id">{{ c.name }}</option> }
        </select>

        @if (selectedCityId()) {
          @if (residents().length) {
            <ul>
              @for (p of residents(); track p.id) { <li>{{ p.name }}, {{ p.age }}</li> }
            </ul>
          } @else {
            <p class="muted">Nadie vive aquí aún</p>
          }
        }
      </section>
    </aside>

    <main>
      <app-graph-view [nodes]="svc.nodes()" [links]="svc.links()" [highlightCityId]="selectedCityId()" />
    </main>
  `,
  styles: [`
    :host { display: grid; grid-template-columns: 320px 1fr; grid-template-rows: 100vh; height: 100vh; font-family: system-ui, sans-serif; color: #1c2430; }
    aside { padding: 20px; overflow-y: auto; border-right: 1px solid #d9dee4; background: #f6f8fa; }
    main { position: relative; min-width: 0; min-height: 0; overflow: hidden; }
    h1 { font-size: 20px; margin: 0 0 16px; }
    h2 { font-size: 14px; margin: 0 0 8px; }
    section { margin-bottom: 22px; display: flex; flex-direction: column; gap: 8px; }
    input, select, button { padding: 8px; font: inherit; border: 1px solid #c3cad2; border-radius: 6px; }
    button { background: #1f6f78; color: #fff; border: 0; cursor: pointer; }
    button:disabled { opacity: .45; cursor: default; }
    ul { margin: 0; padding-left: 18px; }
    .muted { color: #6b7684; margin: 0; }
    @media (max-width: 700px) { :host { grid-template-columns: 1fr; grid-template-rows: auto 70vh; height: auto; } }
  `],
})
export class AppComponent {
  svc = inject(GraphService);

  cityName = '';
  personName = '';
  personAge: number | null = null;
  personCityId = '';

  selectedCityId = signal<string | null>(null);
  residents = computed(() => {
    const id = this.selectedCityId();
    return id ? this.svc.peopleIn(id) : [];
  });

  addCity() {
    if (this.svc.addCity(this.cityName)) this.cityName = '';
  }

  addPerson() {
    if (this.personAge === null) return;
    if (this.svc.addPerson(this.personName, this.personAge, this.personCityId)) {
      this.personName = '';
      this.personAge = null;
    }
  }
}