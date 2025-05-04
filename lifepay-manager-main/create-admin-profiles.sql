-- 创建 admin_profiles 表
create table public.admin_profiles (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  email text not null,
  is_super_admin boolean null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  role text null default 'admin'::text,
  display_name text null,
  last_login_at timestamp with time zone null,
  login_count integer not null default 0,
  is_active boolean not null default true,
  constraint admin_profiles_pkey primary key (id),
  constraint admin_profiles_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint admin_profiles_user_id_unique unique (user_id),
  constraint admin_profiles_email_unique unique (email)
);

-- 添加索引以提高查询性能
create index idx_admin_profiles_user_id on public.admin_profiles(user_id);
create index idx_admin_profiles_email on public.admin_profiles(email);
create index idx_admin_profiles_role on public.admin_profiles(role);
create index idx_admin_profiles_is_active on public.admin_profiles(is_active);

-- 添加触发器自动更新 updated_at 字段
create or replace function public.update_modified_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_admin_profiles_updated_at
before update on public.admin_profiles
for each row
execute function public.update_modified_column();

-- 添加 RLS 策略，确保安全访问
alter table public.admin_profiles enable row level security;

-- 允许已认证用户查看自己的资料
create policy "Users can view their own admin profile"
  on public.admin_profiles for select
  using (auth.uid() = user_id);

-- 允许超级管理员查看所有管理员资料
create policy "Super admins can view all admin profiles"
  on public.admin_profiles for select
  using (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid() and is_super_admin = true
    )
  );

-- 允许超级管理员修改所有管理员资料
create policy "Super admins can update all admin profiles"
  on public.admin_profiles for update
  using (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid() and is_super_admin = true
    )
  );

-- 允许超级管理员删除管理员资料
create policy "Super admins can delete admin profiles"
  on public.admin_profiles for delete
  using (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid() and is_super_admin = true
    )
  );

-- 允许超级管理员创建管理员资料
create policy "Super admins can insert admin profiles"
  on public.admin_profiles for insert
  with check (
    exists (
      select 1 from public.admin_profiles
      where user_id = auth.uid() and is_super_admin = true
    )
  );

-- 注意：您需要在 Supabase 控制台中执行此 SQL 脚本
-- 或使用具有足够权限的 service_role 密钥通过 API 执行
