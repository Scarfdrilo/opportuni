import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { listVacantesActivas } from "../../lib/supabase";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        {
          message: "El servicio de IA no está configurado. Por favor configura tu ANTHROPIC_API_KEY en el archivo .env.local",
          opportunities: [],
        },
        { status: 200 }
      );
    }

    const { messages, userProfile } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { message: "Formato de mensaje inválido", opportunities: [] },
        { status: 400 }
      );
    }

    const vacantes = await listVacantesActivas().catch(() => []);

    const systemPrompt = `Eres el asistente de Opportuni, una comunidad que conecta jóvenes talentosos en Latinoamérica con oportunidades educativas y profesionales.

Tu rol es ayudar a los usuarios a encontrar oportunidades que se ajusten a su perfil. Responde siempre en español, sé amigable, conciso y útil.

Vacantes disponibles actualmente:
${JSON.stringify(vacantes, null, 2)}

${userProfile ? `Perfil del usuario:
- Área de interés: ${userProfile.areaInteres}
- Nivel: ${userProfile.nivel}
- Modalidad preferida: ${userProfile.modalidad}` : ""}

Cuando recomiendes oportunidades específicas de la lista de vacantes, incluye al final de tu mensaje un bloque JSON con el formato:
<opportunities>
[{"titulo": "...", "empresa": "...", "tipo": "...", "ubicacion": "...", "descripcion": "...", "url": "..."}]
</opportunities>

Si no hay vacantes que coincidan exactamente, sugiere áreas relacionadas o da consejos sobre cómo encontrar oportunidades similares. Sé motivador y positivo.`;

    const conversationMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      system: systemPrompt,
      messages: conversationMessages,
    });

    const textContent = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");

    // Parse opportunities from response
    let opportunities: Array<{
      titulo: string;
      empresa: string;
      tipo: string;
      ubicacion: string;
      descripcion: string;
      url?: string;
    }> = [];

    const oppMatch = textContent.match(/<opportunities>([\s\S]*?)<\/opportunities>/);
    if (oppMatch) {
      try {
        opportunities = JSON.parse(oppMatch[1]);
      } catch {
        // If parsing fails, ignore
      }
    }

    // Clean the message text (remove the opportunities tag)
    const cleanMessage = textContent.replace(/<opportunities>[\s\S]*?<\/opportunities>/, "").trim();

    return NextResponse.json({
      message: cleanMessage,
      opportunities,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        message: "Hubo un error al procesar tu mensaje. Intenta de nuevo en un momento.",
        opportunities: [],
      },
      { status: 500 }
    );
  }
}
