import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/nav/Navigation";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ジガクル | オンライン家庭教師のサブスク",
  description: "ジガクルは月額定額の家庭教師サブスクです。お好きなプランからレベルに合わせたオンライン学習をサポートします。",
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="ja">
      <body className={`${inter.className} h-screen bg-gray-50`}>
        <Navigation />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
