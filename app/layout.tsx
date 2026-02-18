import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  variable: "--font-body",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Opportuni - Conectamos jóvenes talentosos con oportunidades en LATAM",
  description:
    "Conectamos a jóvenes talentosos con oportunidades educativas y profesionales en México, Colombia y toda Latinoamérica. Más de 9,500 miembros en nuestra comunidad.",
  openGraph: {
    title: "Opportuni",
    description: "Conectamos a jóvenes talentosos con oportunidades educativas y profesionales en LATAM",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${bricolage.variable} ${dmMono.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={bricolage.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
