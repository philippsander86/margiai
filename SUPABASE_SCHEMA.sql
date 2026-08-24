-- Base relacional para substituir o adaptador IndexedDB em src/data.js.
create table products (id uuid primary key, user_id uuid not null references auth.users, sku text not null, name text not null, category text, status text not null default 'active', unique(user_id, sku));
create table product_costs (id uuid primary key, product_id uuid not null references products on delete cascade, name text not null, value numeric(12,2) not null);
create table product_cost_history (id uuid primary key, product_id uuid not null references products on delete cascade, cmv numeric(12,2) not null, valid_from date not null, valid_to date);
create table channels (id uuid primary key, user_id uuid not null references auth.users, name text not null, status text not null default 'active');
create table channel_costs (id uuid primary key, channel_id uuid not null references channels on delete cascade, name text not null, type text not null check(type in ('percent','fixed')), value numeric(12,2) not null);
create table channel_cost_history (id uuid primary key, channel_cost_id uuid not null references channel_costs on delete cascade, value numeric(12,2) not null, valid_from date not null, valid_to date);
create table sales (id uuid primary key, user_id uuid not null references auth.users, channel_id uuid references channels, order_ref text, sold_at timestamptz not null, source text not null default 'import');
create table sale_items (id uuid primary key, sale_id uuid not null references sales on delete cascade, product_id uuid references products, sku_at_sale text not null, quantity numeric(12,2) not null, unit_price numeric(12,2) not null);
create table price_history (id uuid primary key, product_id uuid not null references products, channel_id uuid references channels, price numeric(12,2) not null, valid_from date not null, valid_to date);
create table recommendations (id uuid primary key, user_id uuid not null references auth.users, product_id uuid references products, channel_id uuid references channels, kind text not null, confidence text not null, message text not null, created_at timestamptz not null default now());
