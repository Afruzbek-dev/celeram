import { describe, expect, it } from "vitest";
import type { CelebrationAnswers } from "./types";
import { CelebrationStep } from "./types";
import { createCelebrationController } from "./use-celebration";
import { validateStep } from "./validation";

function buildAnswers(
  overrides: Partial<CelebrationAnswers> = {},
): CelebrationAnswers {
  return {
    recipient: "Onam",
    occasion: "Tug'ilgan kun",
    date: "2026-09-03",
    budget: 500_000,
    style: "Yumshoq",
    ...overrides,
  };
}

describe("validateStep", () => {
  it("requires a recipient on the first step", () => {
    expect(
      validateStep(
        CelebrationStep.Recipient,
        buildAnswers({ recipient: "   " }),
      ),
    ).toEqual({
      recipient: "Qabul qiluvchi ismini kiriting.",
    });
  });

  it("requires an occasion on the second step", () => {
    expect(
      validateStep(
        CelebrationStep.Occasion,
        buildAnswers({ occasion: "" }),
      ),
    ).toEqual({
      occasion: "Bayram turini tanlang.",
    });
  });

  it("allows same-day dates and rejects past dates", () => {
    expect(
      validateStep(
        CelebrationStep.Date,
        buildAnswers({ date: "2026-09-03" }),
      ),
    ).toEqual({});

    expect(
      validateStep(
        CelebrationStep.Date,
        buildAnswers({ date: "2026-09-02" }),
      ),
    ).toEqual({
      date: "Sana bugun yoki keyin bo'lishi kerak.",
    });
  });

  it("requires a positive budget no greater than 2,000,000 UZS", () => {
    expect(
      validateStep(
        CelebrationStep.Budget,
        buildAnswers({ budget: 0 }),
      ),
    ).toEqual({
      budget: "Byudjet 0 dan katta bo'lishi kerak.",
    });

    expect(
      validateStep(
        CelebrationStep.Budget,
        buildAnswers({ budget: 2_000_001 }),
      ),
    ).toEqual({
      budget: "Byudjet 2 000 000 so'mdan oshmasligi kerak.",
    });
  });

  it("requires a style on the final step", () => {
    expect(
      validateStep(
        CelebrationStep.Style,
        buildAnswers({ style: " " }),
      ),
    ).toEqual({
      style: "Uslubni tanlang.",
    });
  });
});

describe("createCelebrationController", () => {
  it("preserves answers when moving backward between steps", () => {
    const controller = createCelebrationController();

    controller.setAnswer("recipient", "Onajon");
    expect(controller.next()).toEqual({});
    controller.setAnswer("occasion", "Nikoh yubileyi");
    expect(controller.next()).toEqual({});
    controller.back();
    controller.back();

    expect(controller.currentStep).toBe(CelebrationStep.Recipient);
    expect(controller.answers.recipient).toBe("Onajon");
    expect(controller.answers.occasion).toBe("Nikoh yubileyi");
  });

  it("blocks next on current-step errors and preserves prior values", () => {
    const controller = createCelebrationController();

    controller.setAnswer("recipient", "Dadam");
    expect(controller.next()).toEqual({});
    controller.setAnswer("occasion", " ");

    expect(controller.next()).toEqual({
      occasion: "Bayram turini tanlang.",
    });
    expect(controller.currentStep).toBe(CelebrationStep.Occasion);
    expect(controller.answers.recipient).toBe("Dadam");
    expect(controller.answers.occasion).toBe(" ");
  });

  it("resets back to the first step with blank answers", () => {
    const controller = createCelebrationController();

    controller.setAnswer("recipient", "Singlim");
    controller.setAnswer("budget", 250_000);
    controller.reset();

    expect(controller.currentStep).toBe(CelebrationStep.Recipient);
    expect(controller.answers).toEqual({
      recipient: "",
      occasion: "",
      date: "",
      budget: 0,
      style: "",
    });
  });
});

