import type { Metadata } from "next";
import "./globals.scss";
import {Providers} from "@/app/Providers";
import {LocalizedStringProvider} from "@adobe/react-spectrum/i18n";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import {ClientProviders} from "@/app/ClientProviders";

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
      <body>
        <LocalizedStringProvider locale={"hr"} />
        <Providers>
          <ClientProviders>
            {children}
          </ClientProviders>
        </Providers>
        <Analytics />
        <SpeedInsights/>
      </body>
    </html>
  );
}
