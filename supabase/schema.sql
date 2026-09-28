-- Table des réponses RSVP — à exécuter dans Supabase > SQL Editor.

create table if not exists public.rsvps (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  first_name  text not null check (char_length(first_name) between 1 and 80),
  last_name   text not null check (char_length(last_name) between 1 and 80),
  email       text not null check (char_length(email) <= 200),
  guests      smallint not null check (guests between 1 and 20),
  message     text check (char_length(message) <= 1000)
);

alter table public.rsvps enable row level security;

-- Les invités (clé anon) peuvent AJOUTER une réponse, mais jamais lire la liste.
-- Consultez les réponses depuis le tableau de bord Supabase (Table Editor).
create policy "Invités : insertion uniquement"
  on public.rsvps for insert
  to anon
  with check (true);
