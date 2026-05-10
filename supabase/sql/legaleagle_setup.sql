-- LegalEagle setup and hardening SQL
-- Paste in Supabase SQL Editor and run once.

create extension if not exists pgcrypto;
create extension if not exists vector;

-- Ensure private storage bucket exists for document uploads
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Dedicated table for normalized risk findings (recommended over metadata-only storage)
create table if not exists public.document_risks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  user_id uuid not null,
  severity text not null check (severity in ('High', 'Medium', 'Low')),
  clause_name text not null,
  explanation text not null,
  recommendation text,
  confidence float8 not null check (confidence >= 0 and confidence <= 1),
  created_at timestamptz default now()
);

-- Ensure vector dimensionality matches text-embedding-3-small (1536)
alter table if exists public.document_chunks
  alter column embedding type vector(1536);

-- Useful defaults (safe if columns already exist)
alter table if exists public.audit_logs
  alter column id set default gen_random_uuid(),
  alter column created_at set default now();

alter table if exists public.documents
  alter column id set default gen_random_uuid(),
  alter column created_at set default now(),
  alter column updated_at set default now();

alter table if exists public.document_chunks
  alter column id set default gen_random_uuid(),
  alter column created_at set default now();

alter table if exists public.profiles
  alter column id set default gen_random_uuid(),
  alter column created_at set default now(),
  alter column updated_at set default now();

-- Helpful indexes
create index if not exists idx_documents_user_created_at
  on public.documents (user_id, created_at desc);

create index if not exists idx_document_chunks_document_user
  on public.document_chunks (document_id, user_id, created_at);

create index if not exists idx_audit_logs_user_created_at
  on public.audit_logs (user_id, created_at desc);

create index if not exists idx_document_risks_document_user
  on public.document_risks (document_id, user_id, created_at desc);

-- pgvector cosine index for semantic search
create index if not exists idx_document_chunks_embedding_cosine
  on public.document_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Semantic retrieval RPC for one document + one user
create or replace function public.match_document_chunks(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_document_id uuid,
  p_user_id uuid
)
returns table (
  id uuid,
  document_id uuid,
  user_id uuid,
  content text,
  metadata jsonb,
  created_at timestamptz,
  similarity float
)
language sql
stable
as $$
  select
    dc.id,
    dc.document_id,
    dc.user_id,
    dc.content,
    dc.metadata,
    dc.created_at,
    1 - (dc.embedding <=> query_embedding) as similarity
  from public.document_chunks dc
  where dc.document_id = p_document_id
    and dc.user_id = p_user_id
    and dc.embedding is not null
    and 1 - (dc.embedding <=> query_embedding) >= match_threshold
  order by dc.embedding <=> query_embedding
  limit match_count;
$$;

-- RLS
alter table public.documents enable row level security;
alter table public.document_chunks enable row level security;
alter table public.audit_logs enable row level security;
alter table public.profiles enable row level security;
alter table public.document_risks enable row level security;

drop policy if exists "documents_select_own" on public.documents;
create policy "documents_select_own"
on public.documents
for select
using (auth.uid() = user_id);

drop policy if exists "documents_insert_own" on public.documents;
create policy "documents_insert_own"
on public.documents
for insert
with check (auth.uid() = user_id);

drop policy if exists "documents_update_own" on public.documents;
create policy "documents_update_own"
on public.documents
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "documents_delete_own" on public.documents;
create policy "documents_delete_own"
on public.documents
for delete
using (auth.uid() = user_id);

drop policy if exists "document_chunks_select_own" on public.document_chunks;
create policy "document_chunks_select_own"
on public.document_chunks
for select
using (auth.uid() = user_id);

drop policy if exists "document_chunks_insert_own" on public.document_chunks;
create policy "document_chunks_insert_own"
on public.document_chunks
for insert
with check (auth.uid() = user_id);

drop policy if exists "document_chunks_update_own" on public.document_chunks;
create policy "document_chunks_update_own"
on public.document_chunks
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "document_chunks_delete_own" on public.document_chunks;
create policy "document_chunks_delete_own"
on public.document_chunks
for delete
using (auth.uid() = user_id);

drop policy if exists "audit_logs_select_own" on public.audit_logs;
create policy "audit_logs_select_own"
on public.audit_logs
for select
using (auth.uid() = user_id);

drop policy if exists "audit_logs_insert_own" on public.audit_logs;
create policy "audit_logs_insert_own"
on public.audit_logs
for insert
with check (auth.uid() = user_id);

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "document_risks_select_own" on public.document_risks;
create policy "document_risks_select_own"
on public.document_risks
for select
using (auth.uid() = user_id);

drop policy if exists "document_risks_insert_own" on public.document_risks;
create policy "document_risks_insert_own"
on public.document_risks
for insert
with check (auth.uid() = user_id);

drop policy if exists "document_risks_update_own" on public.document_risks;
create policy "document_risks_update_own"
on public.document_risks
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "document_risks_delete_own" on public.document_risks;
create policy "document_risks_delete_own"
on public.document_risks
for delete
using (auth.uid() = user_id);

-- Storage RLS policies for the `documents` bucket.
-- File path format is `${user.id}/${timestamp}-${fileName}` so folder[1] must match auth.uid().
drop policy if exists "documents_bucket_insert_own" on storage.objects;
create policy "documents_bucket_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "documents_bucket_select_own" on storage.objects;
create policy "documents_bucket_select_own"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "documents_bucket_update_own" on storage.objects;
create policy "documents_bucket_update_own"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'documents'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "documents_bucket_delete_own" on storage.objects;
create policy "documents_bucket_delete_own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);
