# 🚀 Opportuni

**Conectando talento con oportunidades en LATAM**

Plataforma para publicar y encontrar vacantes en México, Colombia y toda Latinoamérica. Con más de 2,500 miembros en nuestras comunidades de WhatsApp.

## Features

- 🌐 **Acceso libre** — sin login; todo el contenido es público
- 📋 **API de Vacantes** para publicar oportunidades
- 🎨 **UI moderna** con paleta rosa-naranja
- 📱 **Responsive** para web y móvil

## Quick Start

```bash
# Install
bun install

# Dev server
bun run dev

# Build
bun run build
```

## Environment Variables

Copia `.env.example` a `.env.local` y llena los valores (Supabase, Vercel Blob
y el calendario de citas). No hay variables de login: el SDK de Accesly se
retiró del proyecto.

> **Desactivado tras retirar Accesly:** el login Google, la wallet, el cobro
> on-chain de "Review de CV" y "Asesoría 1:1" en el home, y el dashboard
> `/admin` (su gate era la wallet del usuario, así que `/api/admin/*` responde
> 503 — ver `ADMIN_API_ENABLED` en `app/lib/submissions.ts`). `/cv` y
> `/cv/asesoria` siguen funcionando: cobran por transferencia.

## API Reference

### GET /api/vacantes

Lista todas las vacantes.

```json
{
  "success": true,
  "count": 2,
  "vacantes": [...]
}
```

### POST /api/vacantes

Crea una nueva vacante.

**Body:**
```json
{
  "titulo": "Senior Developer",
  "empresa": "TechCorp",
  "ubicacion": "México (Remoto)",
  "tipo": "remoto",
  "salario": "$3,000 - $5,000 USD",
  "descripcion": "Descripción del puesto...",
  "requisitos": ["React", "TypeScript"],
  "url": "https://apply.example.com"
}
```

**Campos requeridos:** titulo, empresa, ubicacion, tipo, descripcion

**Tipos válidos:** remoto, presencial, hibrido

### DELETE /api/vacantes?id={id}

Elimina una vacante por ID.

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS
- TypeScript

## Deploy

Deploy automático en Vercel (pepitos-projects).

## License

MIT
