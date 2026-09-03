import type {
  CatalogProduct,
  CelebrationAnswers,
  ProductCategory,
  RecommendedPackage,
} from "./types";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function matchesStyle(product: CatalogProduct, style: string) {
  const requestedStyle = normalize(style);

  return product.styleTags.some((tag) => normalize(tag) === requestedStyle);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function scoreProduct(
  product: CatalogProduct,
  targetBudget: number,
  style: string,
) {
  const styleScore = matchesStyle(product, style) ? 40 : 0;
  const budgetGap = Math.abs(product.priceUZS - targetBudget);
  const budgetScore =
    30 - (clamp(budgetGap / Math.max(targetBudget, 1), 0, 1) * 30);
  const popularityScore = (clamp(product.popularity, 0, 100) / 100) * 20;
  const vendorScore = (clamp(product.vendorQuality, 0, 100) / 100) * 10;

  return {
    score: styleScore + budgetScore + popularityScore + vendorScore,
    budgetGap,
  };
}

function targetAllocation(budget: number) {
  const cake = Math.round(budget * 0.5);
  const flowers = Math.round(budget * 0.4);
  const deliveryFee = Math.max(0, budget - cake - flowers);

  return { cake, flowers, deliveryFee };
}

function chooseProduct(
  category: ProductCategory,
  answers: CelebrationAnswers,
  products: CatalogProduct[],
  targetBudget: number,
) {
  const candidates = products
    .filter((product) => product.category === category && product.active)
    .slice()
    .sort((left, right) => left.id.localeCompare(right.id));

  if (candidates.length === 0) {
    throw new Error(`No active ${category} products available`);
  }

  return candidates.reduce((best, product) => {
    const current = scoreProduct(product, targetBudget, answers.style);
    const champion = scoreProduct(best, targetBudget, answers.style);

    if (current.score !== champion.score) {
      return current.score > champion.score ? product : best;
    }

    if (current.budgetGap !== champion.budgetGap) {
      return current.budgetGap < champion.budgetGap ? product : best;
    }

    if (product.popularity !== best.popularity) {
      return product.popularity > best.popularity ? product : best;
    }

    if (product.vendorQuality !== best.vendorQuality) {
      return product.vendorQuality > best.vendorQuality ? product : best;
    }

    if (product.priceUZS !== best.priceUZS) {
      return product.priceUZS < best.priceUZS ? product : best;
    }

    return product.id.localeCompare(best.id) < 0 ? product : best;
  });
}

export function recommendPackage(
  answers: CelebrationAnswers,
  products: CatalogProduct[],
): RecommendedPackage {
  const allocation = targetAllocation(answers.budget);
  const cake = chooseProduct("cake", answers, products, allocation.cake);
  const flowers = chooseProduct("flowers", answers, products, allocation.flowers);
  const deliveryFee = allocation.deliveryFee;
  const total = cake.priceUZS + flowers.priceUZS + deliveryFee;

  return {
    cake,
    flowers,
    deliveryFee,
    total,
    allocation,
  };
}

export function replacePackageCategory(
  currentPackage: RecommendedPackage,
  category: ProductCategory,
  products: CatalogProduct[],
  answers: CelebrationAnswers,
): RecommendedPackage {
  const updated = recommendPackage(answers, products);

  const cake = category === "cake" ? updated.cake : currentPackage.cake;
  const flowers =
    category === "flowers" ? updated.flowers : currentPackage.flowers;
  const deliveryFee = updated.deliveryFee;
  const total = cake.priceUZS + flowers.priceUZS + deliveryFee;

  return {
    cake,
    flowers,
    deliveryFee,
    total,
    allocation: updated.allocation,
  };
}

