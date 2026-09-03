"use client";

import { createContext, createElement, useEffect, useState, type ReactNode } from "react";

export type TelegramUser = {
  id: string;
  firstName: string;
  lastName?: string;
  username?: string;
};

type TelegramWebAppUser = {
  id: number | string;
  first_name?: string;
  last_name?: string;
  username?: string;
};

type TelegramWebApp = {
  ready?: () => void;
  initDataUnsafe?: {
    user?: TelegramWebAppUser;
  };
};

type TelegramWindow = Window & {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
};

export const TelegramUserContext = createContext<TelegramUser | null>(null);

export function getTelegramUser(): TelegramUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const telegramWindow = window as TelegramWindow;
  const webApp = telegramWindow.Telegram?.WebApp;

  if (!webApp) {
    return null;
  }

  webApp.ready?.();

  const user = webApp.initDataUnsafe?.user;

  if (!user) {
    return null;
  }

  return {
    id: String(user.id),
    firstName: user.first_name ?? "",
    lastName: user.last_name,
    username: user.username,
  };
}

export function TelegramUserProvider({ children }: { children: ReactNode }) {
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    setTelegramUser(getTelegramUser());
  }, []);

  return createElement(TelegramUserContext.Provider, { value: telegramUser }, children);
}

