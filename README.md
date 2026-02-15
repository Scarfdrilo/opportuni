# 🚀 Opportuni

**Conectando talento con oportunidades en LATAM**

Plataforma para publicar y encontrar vacantes en México, Colombia y toda Latinoamérica. Con más de 2,500 miembros en nuestras comunidades de WhatsApp.

## Features

- 🔐 **Social Login** con Accesly SDK
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

```env
NEXT_PUBLIC_ACCESLY_APP_ID=acc_your_app_id
```

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
- Accesly SDK (Social Login)
- TypeScript

## Deploy

Deploy automático en Vercel (pepitos-projects).

## License

MIT
