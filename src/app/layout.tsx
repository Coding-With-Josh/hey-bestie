import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const recoleta = localFont({
  src: [{ path: "./fonts/recoleta-regulardemo.otf", style: "normal", weight: "400" }],
  variable: "--font-recoleta",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export const metadata: Metadata = {
  title: "hey, bestie!",
  description: "A little birthday surprise for my bestie.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={recoleta.variable}>
      <body>{children}</body>
    </html>
  );
}
