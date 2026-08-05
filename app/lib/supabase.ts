// Mini-cliente server-only para Supabase (PostgREST via fetch, sin SDK).
// Usa la anon key (pública por diseño); RLS limita lo que permite:
// leer `vacantes` e insertar en `vacante_clicks` / `postulantes`.
// Los conteos y detalles salen por RPCs security definer, y los API routes
// de admin los gatean con la wallet (isAdminWallet) antes de llamarlos.

const SUPABASE_URL = (
  process.env.SUPABASE_URL ?? "https://gbdlfmkenfldrjnzxqst.supabase.co"
).trim();
const SUPABASE_KEY = (
  process.env.SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZGxmbWtlbmZsZHJqbnp4cXN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTU3MTgsImV4cCI6MjA4NjA3MTcxOH0.ymikUupRQrvbtzc7jEF3_ljUT4pmfc0JYG7Raqj9-sU"
).trim();

async function sb(path: string, init?: RequestInit & { headers?: Record<string, string> }) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res;
}

export async function sbSelect<T>(query: string): Promise<T[]> {
  return (await sb(query)).json();
}

export async function sbInsert(table: string, row: Record<string, unknown>): Promise<void> {
  await sb(table, {
    method: "POST",
    body: JSON.stringify(row),
    headers: { Prefer: "return=minimal" },
  });
}

export async function sbRpc<T>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
  const res = await sb(`rpc/${fn}`, { method: "POST", body: JSON.stringify(args) });
  const text = await res.text();
  // Las funciones `returns void` responden 204 sin cuerpo.
  return (text ? JSON.parse(text) : undefined) as T;
}

export interface VacanteRow {
  id: string;
  titulo: string;
  empresa: string | null;
  url_destino: string | null;
  descripcion: string | null;
  ubicacion: string | null;
  tipo: "remoto" | "presencial" | "hibrido" | null;
  salario: string | null;
  activa: boolean;
  created_at: string;
}

export async function getVacanteById(id: string): Promise<VacanteRow | null> {
  const rows = await sbSelect<VacanteRow>(
    `vacantes?id=eq.${encodeURIComponent(id)}&select=*&limit=1`
  );
  return rows[0] ?? null;
}

export async function listVacantesActivas(): Promise<VacanteRow[]> {
  return sbSelect<VacanteRow>(`vacantes?activa=eq.true&select=*&order=created_at.desc`);
}
