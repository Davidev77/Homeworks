import { Component, inject, signal } from '@angular/core';
import { Gif, GiphyService } from './giphy.service';

@Component({
  selector: 'app-root',
  template: `
    <main>
      <h1>Buscador de GIFs (coloca tu API key en environment.ts y environment.development.ts)</h1>

      <input
        type="text"
        placeholder="Escribe algo, por ejemplo: smile"
        (input)="onInput($event)"
      />

      @if (loading()) { <p>Cargando...</p> }
      @if (error()) { <p class="error">{{ error() }}</p> }

      <section class="grid">
        @for (gif of gifs(); track gif.id) {
          <img [src]="gif.images.fixed_height.url" [alt]="gif.title" />
        }
      </section>
    </main>
  `,
  styles: `
    main { max-width: 1000px; margin: 0 auto; padding: 1rem; font-family: sans-serif; }
    input { width: 100%; padding: .75rem 1rem; font-size: 1.1rem; box-sizing: border-box; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: .5rem; margin-top: 1rem; }
    img { width: 100%; height: 200px; object-fit: cover; border-radius: 6px; }
    .error { color: crimson; }
  `,
})
export class App {
  private giphy = inject(GiphyService);

  gifs = signal<Gif[]>([]);
  loading = signal(false);
  error = signal('');

  private timer?: ReturnType<typeof setTimeout>;

  onInput(event: Event) {
    const query = (event.target as HTMLInputElement).value.trim();
    clearTimeout(this.timer);

    if (!query) {
      this.gifs.set([]);
      return;
    }

    // Espera 400 ms después de dejar de escribir para no saturar la API
    this.timer = setTimeout(() => this.search(query), 400);
  }

  private async search(query: string) {
    this.loading.set(true);
    this.error.set('');
    try {
      this.gifs.set(await this.giphy.search(query));
    } catch (e) {
      this.error.set('No se pudieron cargar los GIFs.');
      console.error(e);
    } finally {
      this.loading.set(false);
    }
  }
}