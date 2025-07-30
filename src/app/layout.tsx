import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import "../lib/initializeNodes";
import "../lib/initializeExecutors";

const doto = Inter({ subsets: ["latin"], variable: '--font-doto' });

export const metadata: Metadata = {
  title: "AI Workflow Builder",
  description: "Build AI agent workflows with drag and drop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={doto.variable}>
        {children}
      </body>
    </html>
  );
}
