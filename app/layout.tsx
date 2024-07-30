import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import supabase from "@/lib/supabase/client";
import Nav from "@/components/nav";
import ContextWrapper from "@/components/contextWrapper";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: "Habits Tracker",
  description: "Building discipline through public shame",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ContextWrapper>
          <div className="h-screen w-screen items-center justify-center p-8">
            <Nav />
            {children}
          </div>
        </ContextWrapper>
      </body>
    </html>
  );
}
