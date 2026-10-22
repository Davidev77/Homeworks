import { Injectable, inject, signal, computed } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase = inject(SupabaseService).client;

  readonly user = signal<User | null>(null);
  readonly avatarUrl = computed(() => this.user()?.user_metadata?.['avatar_url'] as string | undefined);

  readonly ready: Promise<void>;

  constructor() {
    this.ready = this.supabase.auth.getSession().then(({ data }) => {
      this.user.set(data.session?.user ?? null);
    });
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.user.set(session?.user ?? null);
    });
  }

  async register(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;
    return { needsConfirmation: !data.session };
  }

  async login(email: string, password: string) {
    const { error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async logout() {
    await this.supabase.auth.signOut();
  }

  async uploadAvatar(file: File) {
    const uid = this.user()?.id;
    if (!uid) throw new Error('Not signed in');
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png';
    const path = `${uid}/avatar.${ext}`;

    const { error } = await this.supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) throw error;

    const { data } = this.supabase.storage.from('avatars').getPublicUrl(path);
    const url = `${data.publicUrl}?v=${Date.now()}`; // bust the cache after replacing
    const { error: metaError } = await this.supabase.auth.updateUser({
      data: { avatar_url: url },
    });
    if (metaError) throw metaError;
  }
}
