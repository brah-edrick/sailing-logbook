import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";

import "./globals.css";
import { Container } from "@chakra-ui/react";
import { Toaster } from "@/components/toaster";
import { Navigation } from "@/components/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brandon's Sailing Log",
  description: "View Brandon's sailing activities and boat information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <Container maxW="4xl">
            <Navigation />
            {children}
          </Container>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
