import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from "@/components/ui/provider";

import "./globals.css";
import { Container } from "@chakra-ui/react";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/ui/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sailing Log",
  description: "Track your sailing activities and boat information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider>
          <Container maxW="4xl">
            <Navigation />
            {children}
          </Container>
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
