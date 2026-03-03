import type { Metadata } from "next";
import "./globals.css";
import { Orbitron, DM_Sans, Poetsen_One } from "next/font/google";

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const poetsenOne = Poetsen_One({ subsets: ["latin"], weight: "400", variable: "--font-poetsen" });

export const metadata: Metadata = {
  title: "ACM Forge Camera | Winter 2026",
  description: "A live feed from the ACM Forge camera, with detection logs and night vision capabilities.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${dmSans.variable} ${poetsenOne.variable}`}>
      <body>{children}</body>
    </html>
  );
}
