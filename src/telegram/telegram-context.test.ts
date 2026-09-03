import { afterEach, describe, expect, it, vi } from "vitest";
import { getTelegramUser } from "./telegram-context";

describe("getTelegramUser", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("maps Telegram init data user fields", () => {
    const ready = vi.fn();

    vi.stubGlobal("window", {
      Telegram: {
        WebApp: {
          ready,
          initDataUnsafe: {
            user: {
              id: 42,
              first_name: "Nodira",
              last_name: "Karimova",
              username: "nodira",
            },
          },
        },
      },
    });

    expect(getTelegramUser()).toEqual({
      id: "42",
      firstName: "Nodira",
      lastName: "Karimova",
      username: "nodira",
    });
    expect(ready).toHaveBeenCalledTimes(1);
  });

  it("returns null when Telegram is absent", () => {
    vi.stubGlobal("window", {});

    expect(getTelegramUser()).toBeNull();
  });

  it("calls ready when WebApp exists but init data has no user", () => {
    const ready = vi.fn();

    vi.stubGlobal("window", {
      Telegram: {
        WebApp: {
          ready,
        },
      },
    });

    expect(getTelegramUser()).toBeNull();
    expect(ready).toHaveBeenCalledTimes(1);
  });
});

