import type { Metadata } from "next";
import { Nunito, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PilulAmi — Sachez que maman a bien pris ses médicaments",
  description:
    "PilulAmi rappelle les prises à votre proche et vous prévient en cas d’oubli. Simple pour lui, rassurant pour vous.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${nunito.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
