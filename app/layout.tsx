import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "./layout/header";
import Footer from "./layout/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neo-Brutalism Blog",
  description: "A minimalist blog with Neo-Brutalism design and good taste",
  openGraph: {
    title: "Neo-Brutalism Blog",
    description: "A minimalist blog with Neo-Brutalism design and good taste",
    type: "website",
  },
  keywords: ["programming", "blog", "neo-brutalism", "design", "technology"],
  authors: [{ name: "Brutal Blog" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-white text-black font-sans antialiased">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
