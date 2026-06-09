import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineLina — Movie Downloads",
  description: "Download movies from CineLina",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
