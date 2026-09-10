create extension if not exists pgcrypto;

create table public.leadership_confidence_responses (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),
  session_label text null check (session_label is null or char_length(session_label) <= 100),
  q1 text not null check (q1 in ('A','B','C','D')),
  q2 text not null check (q2 in ('A','B','C','D')),
  q3 text not null check (q3 in ('A','B','C','D')),
  q4 text not null check (q4 in ('A','B','C','D')),
  q5 text not null check (q5 in ('A','B','C','D')),
  q6 text not null check (q6 in ('A','B','C','D')),
  q7 text not null check (q7 in ('A','B','C','D')),
  reflection text null check (reflection is null or char_length(reflection) <= 1000),
  total_score smallint generated always as (
    (case q1 when 'A' then 3 when 'B' then 2 when 'C' then 4 else 1 end) +
    (case q2 when 'A' then 3 when 'B' then 2 when 'C' then 4 else 1 end) +
    (case q3 when 'A' then 2 when 'B' then 4 when 'C' then 1 else 3 end) +
    (case q4 when 'A' then 2 when 'B' then 1 when 'C' then 4 else 3 end) +
    (case q5 when 'A' then 2 when 'B' then 4 when 'C' then 3 else 1 end) +
    (case q6 when 'A' then 3 when 'B' then 2 when 'C' then 4 else 1 end) +
    (case q7 when 'A' then 2 when 'B' then 4 when 'C' then 3 else 1 end)
  ) stored,
  result_level text generated always as (
    case when (
      (case q1 when 'A' then 3 when 'B' then 2 when 'C' then 4 else 1 end) +
      (case q2 when 'A' then 3 when 'B' then 2 when 'C' then 4 else 1 end) +
      (case q3 when 'A' then 2 when 'B' then 4 when 'C' then 1 else 3 end) +
      (case q4 when 'A' then 2 when 'B' then 1 when 'C' then 4 else 3 end) +
      (case q5 when 'A' then 2 when 'B' then 4 when 'C' then 3 else 1 end) +
      (case q6 when 'A' then 3 when 'B' then 2 when 'C' then 4 else 1 end) +
      (case q7 when 'A' then 2 when 'B' then 4 when 'C' then 3 else 1 end)
    ) >= 24 then 'Construye confianza de forma consistente'
    when (
      (case q1 when 'A' then 3 when 'B' then 2 when 'C' then 4 else 1 end) +
      (case q2 when 'A' then 3 when 'B' then 2 when 'C' then 4 else 1 end) +
      (case q3 when 'A' then 2 when 'B' then 4 when 'C' then 1 else 3 end) +
      (case q4 when 'A' then 2 when 'B' then 1 when 'C' then 4 else 3 end) +
      (case q5 when 'A' then 2 when 'B' then 4 when 'C' then 3 else 1 end) +
      (case q6 when 'A' then 3 when 'B' then 2 when 'C' then 4 else 1 end) +
      (case q7 when 'A' then 2 when 'B' then 4 when 'C' then 3 else 1 end)
    ) >= 17 then 'En camino de fortalecer la confianza'
    else 'Necesita fortalecer la confianza' end
  ) stored,
  constraint score_range check (total_score between 7 and 28)
);

create index leadership_confidence_responses_submitted_at_idx
  on public.leadership_confidence_responses (submitted_at desc);
create index leadership_confidence_responses_session_idx
  on public.leadership_confidence_responses (session_label)
  where session_label is not null;

alter table public.leadership_confidence_responses enable row level security;
revoke all on table public.leadership_confidence_responses from anon, authenticated;
grant insert (session_label, q1, q2, q3, q4, q5, q6, q7, reflection)
  on table public.leadership_confidence_responses to anon;

create policy "Public can submit anonymous assessments"
  on public.leadership_confidence_responses
  for insert to anon with check (true);

create view public.leadership_confidence_report
with (security_invoker = true) as
select
  id, submitted_at, session_label, total_score, result_level,
  case q1 when 'A' then 'A. Esperas hasta el viernes y, si no llegas, explicas que surgieron otras prioridades.' when 'B' then 'B. Le pides que te lo recuerde más adelante, porque ahora depende también de su seguimiento.' when 'C' then 'C. Le avisas antes del plazo, reconoces que no cumplirás y acuerdan una nueva fecha concreta.' else 'D. Priorizas la urgencia y dejas que la persona entienda que no pudiste atenderlo.' end as situacion_1,
  case q2 when 'A' then 'A. Aceptas la excepción y luego explicas al equipo que era un caso especial.' when 'B' then 'B. Rechazas el pedido para evitar cualquier percepción de favoritismo.' when 'C' then 'C. Revisas el criterio, explicas tu decisión y, si corresponde, haces la excepción de manera transparente y replicable para casos equivalentes.' else 'D. Aceptas la excepción en privado para no generar preguntas.' end as situacion_2,
  case q3 when 'A' then 'A. Esperas un poco más para no presionarla y ves si mejora por sí sola.' when 'B' then 'B. Conversas con ella, aclaras la brecha, escuchas el contexto y acuerdan acciones y seguimiento concretos.' when 'C' then 'C. Redistribuyes parte de su trabajo sin explicarle directamente el motivo.' else 'D. Le indicas con firmeza que debe mejorar y que habrá consecuencias si no lo hace.' end as situacion_3,
  case q4 when 'A' then 'A. Marcas el límite frente al equipo para dejar claro que esa no es la forma de cuestionar.' when 'B' then 'B. No haces nada para demostrar que realmente aceptas cualquier cuestionamiento.' when 'C' then 'C. Reconoces el contenido válido en el momento y luego conversas en privado sobre la forma.' else 'D. Conversas después con la persona y le pides que, en adelante, plantee primero los desacuerdos en privado.' end as situacion_4,
  case q5 when 'A' then 'A. Aplicas exactamente la misma consecuencia a ambas para ser justo.' when 'B' then 'B. Tomas en cuenta las circunstancias y antecedentes, pero aplicas el mismo criterio y explicas la diferencia de respuesta.' when 'C' then 'C. Eres más exigente con la persona antigua porque debería saberlo mejor.' else 'D. Consideras principalmente el desempeño general de cada una antes de decidir.' end as situacion_5,
  case q6 when 'A' then 'A. Mantienes la promesa, aunque la situación se complique.' when 'B' then 'B. Les pides que se queden porque la necesidad del negocio está primero.' when 'C' then 'C. Explicas el cambio, reconoces explícitamente el compromiso cumplido y construyes con el equipo una alternativa o compensación concreta.' else 'D. Preguntas quiénes pueden quedarse voluntariamente y trabajas solo con ellos.' end as situacion_6,
  case q7 when 'A' then 'A. Le das mayor margen por su historial y conversas con ella de manera informal.' when 'B' then 'B. Abordas la falta con el mismo estándar, escuchas el contexto y acuerdas la corrección correspondiente.' when 'C' then 'C. Le adviertes en privado que esta vez lo dejarás pasar, pero que no vuelva a ocurrir.' else 'D. Evitas intervenir porque una conversación formal podría afectar la relación de confianza.' end as situacion_7,
  reflection
from public.leadership_confidence_responses;

revoke all on public.leadership_confidence_report from anon, authenticated;
grant select on public.leadership_confidence_report to service_role;
