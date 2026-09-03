import { describe, expect, it } from "vitest";
import type { CelebrationAnswers } from "./types";
import { mockProducts } from "./mock-products";
import { recommendPackage, replacePackageCategory } from "./recommend";

const answers: CelebrationAnswers = {
  recipient: "Onam",
  occasion: "Tug'ilgan kun",
  date: "2026-09-12",
  budget: 250_000,
  style: "Yumshoq",
};

describe("recommendPackage", () => {
  it("prefers products that match the selected style and budget allocation", () => {
    const packageRecommendation = recommendPackage(answers, mockProducts);

    expect(packageRecommendation.cake.id).toBe("cake-soft-rose");
    expect(packageRecommendation.flowers.id).toBe("flowers-soft-white");
    expect(packageRecommendation.allocation).toEqual({
      cake: 125_000,
      flowers: 100_000,
      deliveryFee: 25_000,
    });
    expect(packageRecommendation.total).toBe(
      packageRecommendation.cake.priceUZS +
        packageRecommendation.flowers.priceUZS +
        packageRecommendation.deliveryFee,
    );
  });

  it("excludes inactive products from the recommendation", () => {
    const packageRecommendation = recommendPackage(
      {
        ...answers,
        budget: 180_000,
        style: "Klassik",
      },
      [
        {
          id: "cake-active",
          category: "cake",
          nameUz: "Faol tort",
          priceUZS: 85_000,
          styleTags: ["Klassik"],
          popularity: 52,
          vendorQuality: 61,
          active: true,
        },
        {
          id: "cake-inactive",
          category: "cake",
          nameUz: "Nofaol tort",
          priceUZS: 80_000,
          styleTags: ["Klassik"],
          popularity: 99,
          vendorQuality: 99,
          active: false,
        },
        {
          id: "flowers-active",
          category: "flowers",
          nameUz: "Faol gullar",
          priceUZS: 65_000,
          styleTags: ["Klassik"],
          popularity: 48,
          vendorQuality: 50,
          active: true,
        },
      ],
    );

    expect(packageRecommendation.cake.id).toBe("cake-active");
    expect(packageRecommendation.cake.id).not.toBe("cake-inactive");
  });

  it("falls back to the closest complete package when exact targets are unavailable", () => {
    const packageRecommendation = recommendPackage(
      {
        ...answers,
        budget: 100_000,
        style: "Yorqin",
      },
      [
        {
          id: "cake-close",
          category: "cake",
          nameUz: "Yaqin tort",
          priceUZS: 52_000,
          styleTags: ["Yorqin"],
          popularity: 40,
          vendorQuality: 45,
          active: true,
        },
        {
          id: "cake-far",
          category: "cake",
          nameUz: "Uzoq tort",
          priceUZS: 92_000,
          styleTags: ["Yorqin"],
          popularity: 95,
          vendorQuality: 95,
          active: true,
        },
        {
          id: "flowers-close",
          category: "flowers",
          nameUz: "Yaqin gullar",
          priceUZS: 39_000,
          styleTags: ["Yorqin"],
          popularity: 44,
          vendorQuality: 43,
          active: true,
        },
        {
          id: "flowers-far",
          category: "flowers",
          nameUz: "Uzoq gullar",
          priceUZS: 72_000,
          styleTags: ["Yorqin"],
          popularity: 90,
          vendorQuality: 91,
          active: true,
        },
      ],
    );

    expect(packageRecommendation.cake.id).toBe("cake-close");
    expect(packageRecommendation.flowers.id).toBe("flowers-close");
    expect(packageRecommendation.total).toBe(52_000 + 39_000 + 10_000);
  });

  it("is deterministic for repeated calls with the same answers and catalog", () => {
    const first = recommendPackage(answers, mockProducts);
    const second = recommendPackage(answers, mockProducts);

    expect(second).toEqual(first);
  });
});

describe("replacePackageCategory", () => {
  it("replaces one category without changing the other category", () => {
    const original = recommendPackage(answers, mockProducts);
    const updated = replacePackageCategory(
      original,
      "flowers",
      [
        ...mockProducts,
        {
          id: "flowers-premium-white",
          category: "flowers",
          nameUz: "Premium oq gullar",
          priceUZS: 100_000,
          styleTags: ["Yumshoq"],
          popularity: 81,
          vendorQuality: 94,
          active: true,
        },
      ],
      answers,
    );

    expect(updated.cake).toEqual(original.cake);
    expect(updated.flowers.id).toBe("flowers-premium-white");
    expect(updated.total).toBe(
      original.cake.priceUZS + updated.flowers.priceUZS + updated.deliveryFee,
    );
  });
});

