import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {LocalizedStringProvider} from "@adobe/react-spectrum/i18n";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Slanje citanja dana na Kindle",
  description: "Slanje citanja dana na Kindle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr">
      <body className={inter.className}>
        <LocalizedStringProvider locale={"hr"} />
        {children}
      </body>
    </html>
  );
}
