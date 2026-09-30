import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nababi Ristorante | Roma",
  description:
    "Nababi Ristorante in Rome — Italian tradition, Indian flavours and Roman hospitality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
