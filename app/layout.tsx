import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Opportuni - Conectando talento con oportunidades en LATAM",
  description: "Encuentra las mejores vacantes en México, Colombia y toda Latinoamérica. Únete a nuestra comunidad de más de 2,500 profesionales.",
  openGraph: {
    title: "Opportuni",
    description: "Conectando talento con oportunidades en LATAM",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
