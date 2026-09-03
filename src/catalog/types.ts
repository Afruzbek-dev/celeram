export type ProductCategory = "cake" | "flowers";

export type CelebrationAnswers = {
  recipient: string;
  occasion: string;
  date: string;
  budget: number;
  style: string;
};

export type CatalogProduct = {
  id: string;
  category: ProductCategory;
  nameUz: string;
  priceUZS: number;
  styleTags: string[];
  popularity: number;
  vendorQuality: number;
  active: boolean;
};

export type PackageAllocation = {
  cake: number;
  flowers: number;
  deliveryFee: number;
};

export type RecommendedPackage = {
  cake: CatalogProduct;
  flowers: CatalogProduct;
  deliveryFee: number;
  total: number;
  allocation: PackageAllocation;
};

