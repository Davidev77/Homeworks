import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';
import { Observable } from 'rxjs';

/**
 * Componente "placeholder" reutilizable. En un proyecto real, cada hoja del
 * árbol de menú (Account, Password, FAQ's, ...) apuntaría a su propio
 * componente. Aquí usamos uno genérico que lee el título desde los datos
 * de la ruta (route data) para mantener el ejemplo simple y enfocado en el
 * árbol N-ario + el sidebar.
 */
@Component({
  selector: 'app-menu-page',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <div class="page">
      <h2>{{ title$ | async }}</h2>
      <p>Esta es la pantalla del componente asociado a este ítem del menú.</p>
    </div>
  `,
  styles: [
    `
      .page {
        padding: 32px;
        font-family: system-ui, sans-serif;
      }
      h2 {
        margin-top: 0;
        color: #1e293b;
      }
      p {
        color: #475569;
      }
    `,
  ],
})
export class MenuPageComponent {
  title$: Observable<string>;

  constructor(private route: ActivatedRoute) {
    this.title$ = this.route.data.pipe(map((data) => data['title'] as string));
  }
}
