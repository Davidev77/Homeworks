-- 1. Tasks table 
create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid()
              references auth.users(id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 200),
  done        boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists tasks_user_created_idx
  on public.tasks (user_id, created_at desc);

-- 2. Row Level Security: cada usuario solo puede ver y modificar sus propias filas
alter table public.tasks enable row level security;

create policy "tasks_select_own" on public.tasks
  for select to authenticated
  using (auth.uid() = user_id);

create policy "tasks_insert_own" on public.tasks
  for insert to authenticated
  with check (auth.uid() = user_id);

create policy "tasks_update_own" on public.tasks
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "tasks_delete_own" on public.tasks
  for delete to authenticated
  using (auth.uid() = user_id);

-- 3. Realtime 
alter publication supabase_realtime add table public.tasks;

-- 4. Avatars bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152,
        array['image/png','image/jpeg','image/webp'])
on conflict (id) do nothing;

create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars'
              and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars'
         and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars'
         and (storage.foldername(name))[1] = auth.uid()::text);
