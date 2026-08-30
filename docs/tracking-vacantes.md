# Tracking de vacantes — links cortos, postulaciones y conteos

Todo vive en Supabase (proyecto **Accesly**, `gbdlfmkenfldrjnzxqst`), en 3 tablas:

| Tabla | Qué guarda |
|---|---|
| `vacantes` | id corto (slug), título, empresa, URL destino, activa |
| `vacante_clicks` | un renglón por click al link corto, con `vacante_id` + timestamp |
| `postulantes` | nombre, carrera/área, WhatsApp, link a CV (opcional), ligados a su `vacante_id` |

> ⚠️ **El dashboard `/admin` está desactivado.** Su gate era la wallet de
> Accesly, que se retiró del proyecto; ahora la página muestra un aviso y
> `/api/admin/*` responde 503. El tracking sigue funcionando igual (links
> cortos, clicks y postulaciones): lo que cambia es que se administra desde
> Supabase en vez de desde la web. Para reactivarlo hay que implementar otro
> mecanismo de acceso y poner `ADMIN_API_ENABLED` en
> `app/lib/submissions.ts` en `true`.

## Crear una vacante nueva (desde Supabase)

Con `/admin` desactivado, la vacante se crea llamando la misma función que usaba
el dashboard. Pega esto en el [SQL Editor](https://supabase.com/dashboard/project/gbdlfmkenfldrjnzxqst/sql/new)
y ajusta los valores:

```sql
select crear_vacante(
  p_id          => 'pm-nubank',        -- slug del link corto: minúsculas, números y guiones
  p_titulo      => 'Product Manager',
  p_empresa     => 'Nubank',
  p_ubicacion   => 'CDMX',
  p_tipo        => 'remoto',           -- remoto | presencial | hibrido (o '')
  p_salario     => '',
  p_descripcion => '',
  p_url_destino => ''                  -- vacío = el link corto lleva a /vacantes/{id}
);
```

La **URL externa es opcional**:
- Si la llenas → el link corto redirige ahí.
- Si la dejas vacía → el link corto lleva al **detalle de la vacante en Opportuni**
  (`/vacantes/{id}`), con botón de postulación.

Los dos links quedan listos con solo el slug:
- **Link corto (compartir en WhatsApp):** `https://opportuni.vercel.app/v/pm-nubank` → 302 contando el click
- **Form de postulación:** `https://opportuni.vercel.app/postular/pm-nubank`

La vacante aparece al instante en `https://opportuni.vercel.app/vacantes` (la página pública lee de Supabase). Para apagar un link sin borrar datos, pon `activa = false` en el [Table Editor](https://supabase.com/dashboard/project/gbdlfmkenfldrjnzxqst/editor).

## Consultar conteos (10 segundos)

Pega esto en el [SQL Editor](https://supabase.com/dashboard/project/gbdlfmkenfldrjnzxqst/sql/new):

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
- `app/api/admin/vacantes/route.ts` — daba los conteos a `/admin`; **desactivada** (responde 503) porque su gate era la wallet Accesly. El código sigue ahí para reactivarla con otro gate.
- Seguridad: la web usa la **anon key** con RLS — solo puede leer `vacantes` e insertar clicks/postulantes. Los conteos y detalles salen por funciones `security definer` (`vacante_stats`, `postulantes_por_vacante`), a las que ahora solo se llega desde el SQL Editor de Supabase.
- Env vars: `SUPABASE_URL` y `SUPABASE_ANON_KEY` (ya en `.env.local`; agrégalas también en Vercel → Settings → Environment Variables).

Hay una vacante `demo` sembrada para probar el flujo completo.
