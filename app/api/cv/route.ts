import { NextRequest, NextResponse } from "next/server";

// In-memory storage for CV submissions (use database for production)
const submissions: Array<{
  id: string;
  type: "asesoria" | "revision";
  nombre: string;
  email: string;
  area: string;
  createdAt: string;
  data: Record<string, string>;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let type: string;
    let nombre: string;
    let email: string;
    let area: string;
    let extraData: Record<string, string> = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      type = formData.get("type") as string;
      nombre = formData.get("nombre") as string;
      email = formData.get("email") as string;
      area = formData.get("area") as string;
      extraData.vacanteObjetivo = (formData.get("vacanteObjetivo") as string) || "";
      extraData.comentarios = (formData.get("comentarios") as string) || "";

      const cvFile = formData.get("cv") as File | null;
      if (cvFile) {
        extraData.cvFileName = cvFile.name;
        extraData.cvSize = `${(cvFile.size / 1024 / 1024).toFixed(2)} MB`;
      }
    } else {
      const body = await request.json();
      type = body.type;
      nombre = body.nombre;
      email = body.email;
      area = body.area;
      extraData = {
        nivel: body.nivel || "",
        objetivo: body.objetivo || "",
        reto: body.reto || "",
        modalidadAsesoria: body.modalidadAsesoria || "",
      };
    }

    if (!nombre || !email || !area) {
      return NextResponse.json(
        { success: false, error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const submission = {
      id: Date.now().toString(),
      type: type as "asesoria" | "revision",
      nombre,
      email,
      area,
      createdAt: new Date().toISOString(),
      data: extraData,
    };

    submissions.push(submission);

    return NextResponse.json({
      success: true,
      message: type === "asesoria"
        ? "Solicitud de asesoría recibida. Te contactaremos pronto."
        : "CV recibido. Te enviaremos retroalimentación a tu email.",
      id: submission.id,
    });
  } catch (error) {
    console.error("CV API error:", error);
    return NextResponse.json(
      { success: false, error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
