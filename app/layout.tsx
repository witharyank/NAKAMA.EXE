import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/navigation";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NAKAMA.EXE",
  description: "Smart Team Formation & Challenge Assignment Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1 flex flex-col bg-slate-50/50">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
