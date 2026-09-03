import { CelebrationStep, celebrationSteps, type CelebrationAnswers } from "./types";
import { validateStep } from "./validation";

export type CelebrationController = {
  answers: CelebrationAnswers;
  currentStep: CelebrationStep;
  setAnswer: <K extends keyof CelebrationAnswers>(key: K, value: CelebrationAnswers[K]) => void;
  next: () => Record<string, string>;
  back: () => void;
  reset: () => void;
};

const emptyAnswers = (): CelebrationAnswers => ({ recipient: "", occasion: "", date: "", budget: 0, style: "" });

export function createCelebrationController(): CelebrationController {
  let answers = emptyAnswers();
  let stepIndex = 0;
  return {
    get answers() { return answers; },
    get currentStep() { return celebrationSteps[stepIndex]; },
    setAnswer(key, value) { answers = { ...answers, [key]: value }; },
    next() {
      const errors = validateStep(celebrationSteps[stepIndex], answers);
      if (Object.keys(errors).length || stepIndex === celebrationSteps.length - 1) return errors;
      stepIndex += 1;
      return {};
    },
    back() { stepIndex = Math.max(0, stepIndex - 1); },
    reset() { answers = emptyAnswers(); stepIndex = 0; },
  };
}

