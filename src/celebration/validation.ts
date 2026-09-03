import { CelebrationStep, type CelebrationAnswers } from "./types";

export function validateStep(
  step: CelebrationStep,
  answers: CelebrationAnswers,
): Record<string, string> {
  switch (step) {
    case CelebrationStep.Recipient:
      return answers.recipient.trim() ? {} : { recipient: "Qabul qiluvchi ismini kiriting." };
    case CelebrationStep.Occasion:
      return answers.occasion.trim() ? {} : { occasion: "Bayram turini tanlang." };
    case CelebrationStep.Date: {
      if (!answers.date) return { date: "Sanani tanlang." };
      const selected = new Date(`${answers.date}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today ? {} : { date: "Sana bugun yoki keyin bo'lishi kerak." };
    }
    case CelebrationStep.Budget:
      if (answers.budget <= 0) return { budget: "Byudjet 0 dan katta bo'lishi kerak." };
      return answers.budget <= 2_000_000
        ? {}
        : { budget: "Byudjet 2 000 000 so'mdan oshmasligi kerak." };
    case CelebrationStep.Style:
      return answers.style.trim() ? {} : { style: "Uslubni tanlang." };
  }
}

