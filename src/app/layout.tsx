import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });

export const metadata: Metadata = {
  title: "Multaqa — ملتقى",
  description: "Everything, in one place.",
};

// Locale (lang/dir) is applied on a wrapper inside src/app/[locale]/layout.tsx
// rather than here, since this root layout is shared with the non-localized
// /admin section and Next.js only allows one <html>/<body> pair per tree.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cairo.variable}`}>
      <body className="min-h-screen bg-sand font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
