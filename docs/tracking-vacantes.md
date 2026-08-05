# Tracking de vacantes — links cortos, postulaciones y conteos

Todo vive en Supabase (proyecto **Accesly**, `gbdlfmkenfldrjnzxqst`), en 3 tablas:

| Tabla | Qué guarda |
|---|---|
| `vacantes` | id corto (slug), título, empresa, URL destino, activa |
| `vacante_clicks` | un renglón por click al link corto, con `vacante_id` + timestamp |
| `postulantes` | nombre, carrera/área, WhatsApp, link a CV (opcional), ligados a su `vacante_id` |

## Crear una vacante nueva (menos de 2 minutos, sin tocar código)

1. Entra a `https://opportuni.vercel.app/admin` (con tu wallet admin) → pestaña **Vacantes** → **＋ Nueva vacante**.
2. Llena título (el slug del link corto se genera solo, editable), empresa, tipo, ubicación, salario y descripción. La **URL externa es opcional**:
   - Si la llenas → el link corto redirige ahí.
   - Si la dejas vacía → el link corto lleva al **detalle de la vacante en Opportuni** (`/vacantes/{id}`), con botón de postulación.
3. Al crearla, el modal te da los dos links listos para copiar:
   - **Link corto (compartir en WhatsApp):** `https://opportuni.vercel.app/v/pm-nubank` → 302 contando el click
   - **Form de postulación:** `https://opportuni.vercel.app/postular/pm-nubank`

La vacante también aparece al instante en `https://opportuni.vercel.app/vacantes` (la página pública lee de Supabase). Para apagar un link sin borrar datos, pon `activa = false` en el [Table Editor](https://supabase.com/dashboard/project/gbdlfmkenfldrjnzxqst/editor).

## Consultar conteos (10 segundos)

**Opción A — Dashboard admin (cualquiera con wallet admin configurada):**
entra a `https://opportuni.vercel.app/admin` → pestaña **Vacantes**. Ahí ves clicks y
postulantes por vacante, botones para copiar el link corto / form, y "Ver postulantes"
con el detalle (nombre, WhatsApp, CV).

**Opción B — Query en Supabase:** pega esto en el [SQL Editor](https://supabase.com/dashboard/project/gbdlfmkenfldrjnzxqst/sql/new):

```sql
select * from vacante_stats();
```

Devuelve una fila por vacante con `clicks` y `postulantes`. Para el detalle de una vacante:

```sql
select * from postulantes_por_vacante('pm-nubank');
```

## Cómo funciona por dentro

- `app/v/[id]/route.ts` — busca la vacante, inserta el click en `vacante_clicks` y hace redirect 302. Si Supabase falla, redirige igual (el click se pierde, el usuario no).
- `app/postular/[id]/page.tsx` + `app/api/postular/route.ts` — form público; el `vacante_id` viaja en la URL y cada envío se inserta en `postulantes`.
- `app/api/admin/vacantes/route.ts` — conteos para `/admin`, gateado por `x-admin-wallet` contra `NEXT_PUBLIC_ADMIN_WALLETS` (igual que el resto del dashboard).
- Seguridad: la web usa la **anon key** con RLS — solo puede leer `vacantes` e insertar clicks/postulantes. Los conteos y detalles salen por funciones `security definer` (`vacante_stats`, `postulantes_por_vacante`) que el API solo llama tras validar la wallet admin.
- Env vars: `SUPABASE_URL` y `SUPABASE_ANON_KEY` (ya en `.env.local`; agrégalas también en Vercel → Settings → Environment Variables).

Hay una vacante `demo` sembrada para probar el flujo completo.
