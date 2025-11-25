import Link from "next/link";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";


import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Campus Job Links",
  description:
    "Share the latest campus hiring updates with branded short links.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen flex-col bg-slate-950 text-white">
          <header className="border-b border-white/10 bg-slate-950/80 px-6 py-4 backdrop-blur">
            <nav className="mx-auto flex w-full max-w-6xl items-center justify-between">
              <Link
                href="/"
                className="text-lg font-semibold tracking-wide text-lime-300"
              >
                Offcampus jobs
              </Link>
              <Link
                href="/"
                className="rounded-full border border-white/30 px-4 py-1.5 text-sm font-medium text-white transition hover:border-lime-300 hover:text-lime-200"
              >
                Home
              </Link>
            </nav>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-white/10 bg-slate-950/90 px-6 py-6 text-sm text-slate-200">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} Leela Mani Kumar. Sharing campus job
                updates daily.
              </p>
              <p className="text-xs text-slate-400">
                Contact: leelamanikumar@email.com • LinkedIn @leelamanikumar
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
