import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Header from "./layout/header";
import Footer from "./layout/footer";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Podcast Story",
  description: "A curated collection of extraordinary long-form stories from the world's best podcasts",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Podcast Story",
    description: "A curated collection of extraordinary long-form stories from the world's best podcasts",
    type: "website",
  },
  keywords: ["podcast", "long stories", "storytelling", "curated content", "audio stories", "narrative"],
  authors: [{ name: "Podcast Story" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${nunito.variable}`}>
      <body className="min-h-screen bg-white text-black font-nunito antialiased">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 pt-24">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
