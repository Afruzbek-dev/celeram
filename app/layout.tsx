import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { TelegramUserProvider } from "../src/telegram/telegram-context";

export const metadata: Metadata = {
  title: "Bayramni rejalashtiring",
  description: "Bayram uchun cake va gullarni bir joyda tanlashning oddiy prototipi.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="uz">
      <body>
        <TelegramUserProvider>{children}</TelegramUserProvider>
      </body>
    </html>
  );
}

