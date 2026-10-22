import { Injectable, NgZone, inject, signal } from '@angular/core';
import { RealtimeChannel } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  done: boolean;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class TasksService {
  private supabase = inject(SupabaseService).client;
  private zone = inject(NgZone);
  private channel?: RealtimeChannel;

  readonly tasks = signal<Task[]>([]);

  async load() {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    this.tasks.set(data as Task[]);
  }

  subscribe(userId: string) {
    this.unsubscribe();
    this.channel = this.supabase
      .channel(`tasks:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${userId}` },
        (payload) => this.zone.run(() => this.applyChange(payload))
      )
      .subscribe();
  }

  unsubscribe() {
    if (this.channel) {
      this.supabase.removeChannel(this.channel);
      this.channel = undefined;
    }
    this.tasks.set([]);
  }

  private applyChange(payload: any) {
    const { eventType } = payload;
    if (eventType === 'DELETE') {
      const id = payload.old?.id;
      this.tasks.update((list) => list.filter((t) => t.id !== id));
      return;
    }
    const row = payload.new as Task;
    this.tasks.update((list) => {
      const exists = list.some((t) => t.id === row.id);
      const next = exists ? list.map((t) => (t.id === row.id ? row : t)) : [row, ...list];
      return next.sort((a, b) => b.created_at.localeCompare(a.created_at));
    });
  }

  // CRUD 
  async add(title: string) {
    const { data, error } = await this.supabase
      .from('tasks')
      .insert({ title })          
      .select()
      .single();
    if (error) throw error;
    this.applyChange({ eventType: 'INSERT', new: data }); 
  }

  async toggle(task: Task) {
    const { error } = await this.supabase.from('tasks').update({ done: !task.done }).eq('id', task.id);
    if (error) throw error;
    this.applyChange({ eventType: 'UPDATE', new: { ...task, done: !task.done } });
  }

  async rename(task: Task, title: string) {
    const { error } = await this.supabase.from('tasks').update({ title }).eq('id', task.id);
    if (error) throw error;
    this.applyChange({ eventType: 'UPDATE', new: { ...task, title } });
  }

  async remove(task: Task) {
    const { error } = await this.supabase.from('tasks').delete().eq('id', task.id);
    if (error) throw error;
    this.applyChange({ eventType: 'DELETE', old: { id: task.id } });
  }
}
