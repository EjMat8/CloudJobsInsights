import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { CloudJobProvider } from "@/store";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cloud Job Insights",
  description: "Smart cloud computing job management dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 p-6">
            <CloudJobProvider>{children}</CloudJobProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
