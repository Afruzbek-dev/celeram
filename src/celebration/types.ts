import type { CelebrationAnswers as CatalogCelebrationAnswers } from "../catalog/types";

export type CelebrationAnswers = CatalogCelebrationAnswers;

export enum CelebrationStep {
  Recipient = "recipient",
  Occasion = "occasion",
  Date = "date",
  Budget = "budget",
  Style = "style",
}

export const celebrationSteps = [
  CelebrationStep.Recipient,
  CelebrationStep.Occasion,
  CelebrationStep.Date,
  CelebrationStep.Budget,
  CelebrationStep.Style,
] as const;

