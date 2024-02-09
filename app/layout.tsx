import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import {LocalizedStringProvider} from "@adobe/react-spectrum/i18n";
import {defaultTheme, Provider} from '@adobe/react-spectrum';


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
        <Provider theme={defaultTheme}>
            <LocalizedStringProvider locale={"hr"} />
        </Provider>
        {children}
      </body>
    </html>
  );
}
