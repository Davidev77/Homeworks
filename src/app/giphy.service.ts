import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

export interface Gif {
  id: string;
  title: string;
  images: { fixed_height: { url: string } };
}

@Injectable({ providedIn: 'root' })
export class GiphyService {
  private readonly baseUrl = 'https://api.giphy.com/v1/gifs/search';

  async search(query: string, limit = 25, offset = 0): Promise<Gif[]> {
    const params = new URLSearchParams({
      api_key: environment.giphyApiKey,
      q: query,
      limit: String(limit),
      offset: String(offset),
      rating: 'g',
      lang: 'en',
    });

    const resp = await fetch(`${this.baseUrl}?${params}`);
    if (!resp.ok) {
      throw new Error(`Error de Giphy: ${resp.status}`);
    }
    const json = await resp.json();
    return json.data as Gif[];
  }
}