import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ArbolNArio } from '../../models/tree';
import { NodoArbol, NodoGuardado, TipoNodo } from '../../models/node';
import { Autenticacion } from '../../services/authentication';
import { Nodos } from '../../services/nodes';

@Component({
  selector: 'app-explorador',
  imports: [FormsModule],
  templateUrl: './explorer.html',
  styleUrl: './explorer.scss'
})
export class Explorador implements OnInit {
  readonly auth = inject(Autenticacion);
  private readonly servicioNodos = inject(Nodos);
  private readonly router = inject(Router);

  readonly nodos = signal<NodoGuardado[]>([]);
  readonly arbol = computed(() => ArbolNArio.desdeLista(this.nodos()));
  readonly filas = computed(() => this.arbol().aplanar());

  readonly seleccionadoId = signal('raiz');
  readonly seleccionado = computed(
    () => this.arbol().buscar(this.seleccionadoId())
  );

  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly error = signal('');
  readonly mensaje = signal('');

  nombre = '';
  tipo: TipoNodo = 'carpeta';

  async ngOnInit(): Promise<void> {
    try {
      this.nodos.set(await this.servicioNodos.listar());
    } catch (error: unknown) {
      this.mostrarError(error);
    } finally {
      this.cargando.set(false);
    }
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/login');
  }

  seleccionar(id: string): void {
    this.seleccionadoId.set(id);
    this.error.set('');
    this.mensaje.set('');
  }

  async crear(): Promise<void> {
    if (this.guardando()) {
      return;
    }

    this.error.set('');
    this.mensaje.set('');

    try {
      const correo = this.auth.exigirCorreo();
      const padreId = this.seleccionadoId();

      this.arbol().validarHijo(padreId, this.nombre);

      this.guardando.set(true);

      const nuevo = await this.servicioNodos.crear({
        nombre: this.nombre.trim(),
        tipo: this.tipo,
        padreId,
        correoCreador: correo
      });

      this.nodos.update(lista => [...lista, nuevo]);
      this.nombre = '';
      this.mensaje.set('Elemento creado y guardado.');
    } catch (error: unknown) {
      this.mostrarError(error);
    } finally {
      this.guardando.set(false);
    }
  }

  async eliminar(): Promise<void> {
    if (this.guardando()) {
      return;
    }

    const seleccionado = this.seleccionado();

    if (!seleccionado || seleccionado.id === 'raiz') {
      return;
    }

    const elementos: NodoArbol[] = [];
    const recopilar = (nodo: NodoArbol): void => {
      elementos.push(nodo);
      nodo.hijos.forEach(recopilar);
    };
    recopilar(seleccionado);

    const correo = this.auth.correo();

    if (elementos.some(elemento => elemento.correoCreador !== correo)) {
      this.error.set('Solo puedes eliminar elementos creados por tu cuenta.');
      return;
    }

    const confirmacion = elementos.length > 1
      ? `¿Eliminar "${seleccionado.nombre}" y sus ${elementos.length - 1} elementos internos? Esta acción no se puede deshacer.`
      : `¿Eliminar "${seleccionado.nombre}"? Esta acción no se puede deshacer.`;

    if (!globalThis.confirm(confirmacion)) {
      return;
    }

    this.error.set('');
    this.mensaje.set('');
    this.guardando.set(true);

    try {
      await this.servicioNodos.eliminar(elementos.map(elemento => elemento.id));
      const eliminados = new Set(elementos.map(elemento => elemento.id));
      this.nodos.update(lista => lista.filter(nodo => !eliminados.has(nodo.id)));
      this.seleccionadoId.set('raiz');
      this.mensaje.set(
        elementos.length === 1
          ? 'Elemento eliminado.'
          : `Se eliminaron ${elementos.length} elementos.`
      );
    } catch (error: unknown) {
      this.mostrarError(error);
    } finally {
      this.guardando.set(false);
    }
  }

  private mostrarError(error: unknown): void {
    this.error.set(
      error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
    );
  }
}