import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SurveyOps",
  description: "Plataforma de pesquisas quantitativas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" style={{ height: '100%' }}>
      <body style={{ height: '100%', margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
