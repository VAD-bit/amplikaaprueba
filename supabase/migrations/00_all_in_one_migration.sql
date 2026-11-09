-- ============================================================
-- AMPLIKAA — Migración consolidada (todas las tablas, políticas, índices y seeds)
-- Schema: amplikaa
-- Ejecutar en Supabase → SQL Editor (o vía CLI).
-- ============================================================

-- ---------- 0) SCHEMA ----------
create schema if not exists amplikaa;

comment on schema amplikaa is
  'Datos de la web app AMPLIKAA (leads del landing + solicitudes del Studio)';

grant usage on schema amplikaa to anon, authenticated, service_role;

alter role authenticator set pgrst.db_schemas = 'public,amplikaa';
notify pgrst, 'reload config';

-- ---------- 1) LEADS (formularios de contacto de la landing) ----------
create table if not exists amplikaa.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending',
  source text,
  nombre text not null,
  email text not null,
  whatsapp text,
  empresa text,
  servicio text not null,
  presupuesto text,
  mensaje text not null,
  etapa text not null default 'nuevo',
  updated_at timestamptz not null default now()
);

comment on column amplikaa.leads.etapa is
  'Etapa del pipeline: nuevo | contactado | propuesta | ganado | perdido';

alter table amplikaa.leads enable row level security;

drop policy if exists "Allow public insert to leads" on amplikaa.leads;
create policy "Allow public insert to leads"
  on amplikaa.leads for insert
  to anon
  with check (true);

drop policy if exists "leads select authenticated" on amplikaa.leads;
create policy "leads select authenticated"
  on amplikaa.leads for select
  to authenticated
  using (true);

drop policy if exists "leads update authenticated" on amplikaa.leads;
create policy "leads update authenticated"
  on amplikaa.leads for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "leads insert authenticated" on amplikaa.leads;
create policy "leads insert authenticated"
  on amplikaa.leads for insert
  to authenticated
  with check (true);

create index if not exists leads_created_at_idx on amplikaa.leads (created_at desc);
create index if not exists leads_status_idx on amplikaa.leads (status);
create index if not exists leads_etapa_idx on amplikaa.leads (etapa);

-- ---------- 2) STUDIO SUBMISSIONS ----------
create table if not exists amplikaa.studio_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending',
  source text not null default 'studio',
  nombre text not null,
  email text not null,
  whatsapp text,
  empresa text,
  rubro text not null,
  publico text,
  nota text not null,
  goals jsonb default '[]'::jsonb,
  budget_range text not null,
  budget_note text,
  plazo text,
  extras jsonb default '[]'::jsonb,
  blocks jsonb not null,
  analysis jsonb
);

alter table amplikaa.studio_submissions enable row level security;

drop policy if exists "Allow public insert to studio_submissions" on amplikaa.studio_submissions;
create policy "Allow public insert to studio_submissions"
  on amplikaa.studio_submissions for insert
  to anon
  with check (true);

create index if not exists studio_created_at_idx on amplikaa.studio_submissions (created_at desc);
create index if not exists studio_status_idx on amplikaa.studio_submissions (status);

-- ---------- 3) CLIENTES (CSM) ----------
create table if not exists amplikaa.clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  nombre text not null,
  empresa text,
  whatsapp text,
  email text,
  plan text not null default 'Impulso',
  ciclo text not null default 'semanal',
  precio numeric(10,2) not null default 0,
  inicio date,
  proxima_cobro date,
  salud text not null default 'verde',
  estado text not null default 'activo',
  lead_id uuid references amplikaa.leads (id) on delete set null,
  slug text,
  instagram_access_token text
);

comment on table amplikaa.clients is 'Cartera de clientes activos (CSM)';

alter table amplikaa.clients enable row level security;

drop policy if exists "clients all authenticated" on amplikaa.clients;
create policy "clients all authenticated"
  on amplikaa.clients for all
  to authenticated
  using (true)
  with check (true);

create index if not exists clients_estado_idx on amplikaa.clients (estado);
create index if not exists clients_salud_idx on amplikaa.clients (salud);
create index if not exists clients_proxima_cobro_idx on amplikaa.clients (proxima_cobro);
create index if not exists clients_slug_idx on amplikaa.clients (slug);

-- ---------- 4) TAREAS (CSM) ----------
create table if not exists amplikaa.tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  client_id uuid not null references amplikaa.clients (id) on delete cascade,
  titulo text not null,
  tipo text not null default 'general',
  prioridad text not null default 'media',
  vence date
);

alter table amplikaa.tasks enable row level security;

drop policy if exists "tasks all authenticated" on amplikaa.tasks;
create policy "tasks all authenticated"
  on amplikaa.tasks for all
  to authenticated
  using (true)
  with check (true);

create index if not exists tasks_client_idx on amplikaa.tasks (client_id);
create index if not exists tasks_vence_idx on amplikaa.tasks (vence) where completed_at is null;

-- ---------- 5) NOTAS ----------
create table if not exists amplikaa.notes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid references amplikaa.leads (id) on delete cascade,
  client_id uuid references amplikaa.clients (id) on delete cascade,
  texto text not null,
  check (lead_id is not null or client_id is not null)
);

alter table amplikaa.notes enable row level security;

drop policy if exists "notes all authenticated" on amplikaa.notes;
create policy "notes all authenticated"
  on amplikaa.notes for all
  to authenticated
  using (true)
  with check (true);

create index if not exists notes_lead_idx on amplikaa.notes (lead_id);
create index if not exists notes_client_idx on amplikaa.notes (client_id);

-- ---------- 6) VISTA RÁPIDA DE DASHBOARD ----------
create or replace view amplikaa.pipeline_summary
with (security_invoker = true) as
select etapa, count(*)::int as total
from amplikaa.leads
group by etapa;

-- ---------- 7) ASISTENTE IA ----------
create table if not exists amplikaa.ai_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  role text not null check (role in ('user', 'assistant')),
  content text not null
);

alter table amplikaa.ai_messages enable row level security;

drop policy if exists "ai_messages all authenticated" on amplikaa.ai_messages;
create policy "ai_messages all authenticated"
  on amplikaa.ai_messages for all
  to authenticated
  using (true)
  with check (true);

create index if not exists ai_messages_created_idx on amplikaa.ai_messages (created_at);

create table if not exists amplikaa.ai_knowledge (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  titulo text not null,
  contenido text not null,
  tipo text not null default 'texto',
  origen text,
  chunk_idx integer
);

alter table amplikaa.ai_knowledge enable row level security;

drop policy if exists "ai_knowledge all authenticated" on amplikaa.ai_knowledge;
create policy "ai_knowledge all authenticated"
  on amplikaa.ai_knowledge for all
  to authenticated
  using (true)
  with check (true);

create index if not exists ai_knowledge_created_idx on amplikaa.ai_knowledge (created_at desc);
create index if not exists ai_knowledge_tipo_idx on amplikaa.ai_knowledge (tipo);

create table if not exists amplikaa.ai_tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  titulo text not null,
  brief text not null default '',
  status text not null default 'pendiente',
  result text,
  ran_at timestamptz
);

alter table amplikaa.ai_tasks enable row level security;

drop policy if exists "ai_tasks all authenticated" on amplikaa.ai_tasks;
create policy "ai_tasks all authenticated"
  on amplikaa.ai_tasks for all
  to authenticated
  using (true)
  with check (true);

create index if not exists ai_tasks_status_idx on amplikaa.ai_tasks (status);
create index if not exists ai_tasks_created_idx on amplikaa.ai_tasks (created_at desc);

-- ---------- 8) CEREBRO IA LOCAL ----------
create table if not exists amplikaa.ai_brain (
  id text primary key default 'default',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  payload jsonb not null
);

alter table amplikaa.ai_brain enable row level security;

drop policy if exists "ai_brain all authenticated" on amplikaa.ai_brain;
create policy "ai_brain all authenticated"
  on amplikaa.ai_brain for all
  to authenticated
  using (true)
  with check (true);

-- ---------- 9) PLANES ----------
create table if not exists amplikaa.planes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  key text not null unique,
  seccion text not null default 'marketing',
  plan_no text not null default '',
  label text not null,
  price numeric(10,2) not null default 0,
  descripcion text not null default '',
  features jsonb not null default '[]'::jsonb,
  entrega text not null default '',
  featured boolean not null default false,
  servicio text not null default '',
  presupuesto text not null default '',
  posicion int not null default 0,
  visible boolean not null default true
);

alter table amplikaa.planes enable row level security;

drop policy if exists "planes select public" on amplikaa.planes;
create policy "planes select public"
  on amplikaa.planes for select
  to anon, authenticated
  using (true);

drop policy if exists "planes write authenticated" on amplikaa.planes;
create policy "planes write authenticated"
  on amplikaa.planes for all
  to authenticated
  using (true)
  with check (true);

create index if not exists planes_seccion_pos_idx on amplikaa.planes (seccion, posicion);

-- ---------- 10) EMPLEADOS ----------
create table if not exists amplikaa.empleados (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  nombre text not null,
  cargo text not null default '',
  email text,
  telefono text,
  salario_base numeric(10,2) not null default 0,
  ingreso date,
  estado text not null default 'activo',
  notas text not null default ''
);

alter table amplikaa.empleados enable row level security;

drop policy if exists "empleados all authenticated" on amplikaa.empleados;
create policy "empleados all authenticated"
  on amplikaa.empleados for all
  to authenticated
  using (true)
  with check (true);

create index if not exists empleados_estado_idx on amplikaa.empleados (estado);

-- ---------- 11) NÓMINA ----------
create table if not exists amplikaa.nomina_pagos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  empleado_id uuid not null references amplikaa.empleados (id) on delete cascade,
  fecha date not null default current_date,
  periodo text not null default '',
  monto numeric(10,2) not null check (monto >= 0),
  metodo text not null default 'efectivo',
  notas text not null default ''
);

alter table amplikaa.nomina_pagos enable row level security;

drop policy if exists "nomina all authenticated" on amplikaa.nomina_pagos;
create policy "nomina all authenticated"
  on amplikaa.nomina_pagos for all
  to authenticated
  using (true)
  with check (true);

create index if not exists nomina_empleado_idx on amplikaa.nomina_pagos (empleado_id);
create index if not exists nomina_fecha_idx on amplikaa.nomina_pagos (fecha desc);

-- ---------- 12) FINANZAS ----------
create table if not exists amplikaa.finanzas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  fecha date not null default current_date,
  tipo text not null default 'ingreso',
  concepto text not null,
  monto numeric(10,2) not null check (monto >= 0),
  categoria text not null default 'general',
  cliente_id uuid references amplikaa.clients (id) on delete set null,
  notas text not null default ''
);

alter table amplikaa.finanzas enable row level security;

drop policy if exists "finanzas all authenticated" on amplikaa.finanzas;
create policy "finanzas all authenticated"
  on amplikaa.finanzas for all
  to authenticated
  using (true)
  with check (true);

create index if not exists finanzas_fecha_idx on amplikaa.finanzas (fecha desc);
create index if not exists finanzas_tipo_idx on amplikaa.finanzas (tipo);

-- ---------- 13) SEEDS ----------
insert into amplikaa.planes (key, seccion, plan_no, label, price, descripcion, features, entrega, featured, servicio, presupuesto, posicion) values
  ('impulso', 'marketing', 'Plan 01', 'Impulso', 65,
   'Para marcas que quieren presencia seria cada semana, sin arrancar un sistema completo.',
   '["12 piezas de contenido semanales","Gestión de 1 red social","Calendario editorial semanal","Reporte mensual de métricas"]'::jsonb,
   '', false, 'Plan: Impulso', '$100 – $300', 1),
  ('crecimiento', 'marketing', 'Plan 02', 'Crecimiento', 90,
   'Contenido y comunidad creciendo juntos todas las semanas.',
   '["Todo lo de Impulso","18 piezas semanales (incluye 1 ad)","Gestión de 2 redes sociales","Reporte quincenal + call de seguimiento"]'::jsonb,
   '', true, 'Plan: Crecimiento', '$300 – $700', 2),
  ('ecosistema', 'marketing', 'Plan 03', 'Ecosistema', 100,
   'Partner digital completo: marketing, pauta y web siempre al día.',
   '["Todo lo de Crecimiento","Gestión de pauta Meta/Google","Desarrollo & Mantenimiento de tu web (actualizaciones y backups)","Soporte prioritario por WhatsApp"]'::jsonb,
   '', false, 'Plan: Ecosistema', '$300 – $700', 3),
  ('landing', 'sistemas', 'Sistema 01', 'Landing Express', 500,
   'Una página de alto contraste para lanzar, validar o pautar sin fricción.',
   '["Diseño a medida y copy CRO","Formulario + WhatsApp","SEO técnico básico + analytics","Entrega en 1–2 semanas"]'::jsonb,
   '1–2 semanas', false, 'Sistema: Landing Express', '$300 – $700', 1),
  ('sitio', 'sistemas', 'Sistema 02', 'Sitio Corporativo', 1250,
   'Sitio multipágina con CMS para que publique usted mismo, sin código.',
   '["Hasta 8 páginas + blog","CMS para editar contenidos","SEO técnico y performance","Integraciones (forms, CRM, analytics)","Entrega en 3–4 semanas"]'::jsonb,
   '3–4 semanas', true, 'Sistema: Sitio Corporativo', '$700 – $1,500', 2),
  ('sistema', 'sistemas', 'Sistema 03', 'E-Commerce / Sistema', 2100,
   'Tienda o sistema a medida: pagos, panel de administración y flujos propios.',
   '["Tienda o app web a medida","Pagos y envíos integrados","Panel de administración","Integraciones con APIs","Entrega en 6–10 semanas"]'::jsonb,
   '6–10 semanas', false, 'Sistema: E-Commerce / Sistema', '$1,500 – $3,000', 3)
on conflict (key) do nothing;

-- ---------- 14) SEEDS: CONOCIMIENTO IA (marketing y creativo) ----------
insert into amplikaa.ai_knowledge (titulo, contenido, tipo) values

-- MARKETING SEEDS
('Fundamentos del marketing moderno',
 'El marketing es el proceso de crear, comunicar y entregar valor a un mercado objetivo para obtener a cambio ingresos y crecimiento. Ya no consiste en interrumpir con anuncios, sino en atraer a personas que buscan una solución. Todo plan empieza por entender al cliente, no por elegir el canal.',
 'texto'),

('Marketing de atracción frente a interrupción',
 'El marketing de atracción publica contenido útil que el cliente encuentra cuando lo necesita; el de interrupción corta su atención con anuncios no pedidos. El primero construye confianza y genera leads de mejor calidad; el segundo puede escalar rápido pero es caro y fácil de ignorar. La mezcla ideal invierte sobre todo en atracción.',
 'texto'),

('El embudo AARRR',
 'AARRR son las cinco etapas del embudo de growth: Adquisición (cómo llegan), Activación (experimentan el valor), Retención (vuelven), Referencia (recomiendan) y Ingresos (pagan). Medir y optimizar cada etapa evita que el negocio pierda clientes en silencio entre el clic y la recompra.',
 'texto'),

('Propuesta de valor',
 'La propuesta de valor es la promesa concreta de qué problema resuelves, para quién y por qué eres mejor que la alternativa. Debe caber en una frase que un cliente entienda a la primera. Si suena a descripción genérica de producto, no es una propuesta de valor todavía.',
 'texto'),

('Diferenciación',
 'La diferenciación responde a la pregunta ¿por qué tú y no otro? Puede ser por resultado, experiencia, precio, nicho o método propio. Sin diferenciación clara compites solo por precio, lo que destruye márgenes. Elige un eje, repítelo en todo el material y hazlo demostrable.',
 'texto'),

('Mercado objetivo y nicho',
 'Un mercado objetivo es un grupo específico de personas o empresas con un problema que tu solución resuelve mejor que nadie. Empezar nicho permite dominar mensajes, casos y canales; expandirse después es más fácil que intentar gustarle a todos desde el día uno.',
 'texto'),

('Buyer persona',
 'El buyer persona es el retrato semi-ficticio de tu cliente ideal: rol, dolores, miedos, disparadores de compra, presupuesto y dónde consume información. Se construye con entrevistas reales y datos, no con suposiciones. Sirve para que ventas, contenido y anuncios hablen el mismo idioma del cliente.',
 'texto'),

('Customer journey o viaje del cliente',
 'El viaje del cliente mapea las etapas desde que siente el problema hasta que recomienda: descubre, considera, decide, usa y defiende. En cada etapa el cliente necesita mensajes y pruebas distintas. Diseñar el journey evita pedir la venta demasiado pronto o abandonar al cliente tras el pago.',
 'texto'),

('Producto mercado fit',
 'El producto-mercado fit significa que un segmento claro percibe tu solución como indispensable. Señales: retención alta, referencias orgánicas y clientes que se quejan cuando el producto falla. Sin fit, más marketing solo acelera el desperdicio de presupuesto; con fit, crecer se vuelve más fácil.',
 'texto'),

('Marca y branding',
 'La marca es la percepción que queda en la mente del cliente; el branding es el sistema visual y verbal que construye esa percepción: nombre, logo, colores, tono y consistencia. Una marca consistente genera reconocimiento y confianza, y reduce el coste de cada venta futura.',
 'texto'),

-- CREATIVE SEEDS
('Principios del diseño gráfico',
 'El diseño gráfico organiza información visual para comunicar con claridad. Los pilares son: jerarquía (qué se ve primero), alineación, contraste, repetición y ritmo, proximidad (elementos juntos se leen como grupo) y espacio en blanco. El diseño no es decoración: es facilitar que el mensaje llegue.',
 'texto'),

('Composición y regla de los tercios',
 'La regla de los tercios divide el lienzo en nueve zonas con dos líneas horizontales y dos verticales; colocar el sujeto o punto de interés en las intersecciones crea composiciones dinámicas. Úsala como punto de partida, no como dogma: la simetría central también comunica fuerza y formalidad cuando el objetivo lo pide.',
 'texto'),

('Jerarquía visual y tamaño de tipos',
 'La jerarquía se construye con tamaño, peso, color y espacio: un titular grande y en negrita, un subtítulo medio y un cuerpo pequeño. Nunca compitas con más de dos niveles fuertes en la misma zona. Si todo es grande, nada importa; el ojo necesita un camino claro de lectura.',
 'texto'),

('Paleta de colores y armonía',
 'Una paleta sólida tiene un color primario de marca, un acento de acción y neutros. Usa reglas de armonía: complementario para contraste fuerte, análogo para calma, triádico para variedad. Limita a tres a cinco colores activos y define variantes claro/oscuro para cada uno.',
 'texto'),

('Sistema de color de marca',
 'El sistema de color fija códigos HEX, RGB y CMYK, reglas de uso (porcentaje de superficie) y accesibilidad (contraste mínimo 4.5:1 para texto normal). Documenta colores semánticos: éxito, advertencia, error. Consistencia de color es una de las señales más rápidas de profesionalismo percibido.',
 'texto'),

('Branding: identidad visual de marca',
 'La identidad visual es el sistema que hace reconocible a la marca: logotipo con versiones (principal, monocromo, isotipo), paleta, tipografías, iconografía, fotografía y grafismos. Debe funcionar en gran y pequeño, en claro y oscuro, en digital e impreso. Un buen sistema se adapta; un logo solo no es una marca.',
 'texto'),

('Arquetipos de marca',
 'Los arquetipos (héroe, sabio, rebelde, cuidador, explorador, creador, gobernador, payaso) ayudan a definir personalidad y voz. Úsalos como brújula creativa, no como disfraz: una marca de servicios B2B que finge ser rebelde sin sustancia se siente inconsistente.',
 'texto'),

on conflict do nothing;

update amplikaa.ai_knowledge set tipo = 'qa' where titulo like 'Q: %' and tipo = 'texto';

-- ---------- 14) Privilegios por defecto para tablas futuras ----------
alter default privileges in schema amplikaa
  grant all on tables to anon, authenticated, service_role;

-- ============================================================
-- Fin de la migración consolidada
-- ============================================================
