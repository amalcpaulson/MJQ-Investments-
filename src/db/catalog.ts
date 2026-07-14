import type { NewProduct } from "./schema";

/**
 * Curated catalogue for Luxury.ae — sourced from the real brand portfolio
 * distributed by MJQ Investment LLC (Marvis, Fino, Proraso).
 *
 * This single source of truth is used to (a) seed Neon and (b) act as a
 * graceful offline fallback so the storefront always renders.
 */

export const CATEGORIES = [
  { slug: "oral-care", name: "Oral Care", tagline: "Italian toothpaste & mouthwash", accent: "#1f3d2b" },
  { slug: "hair-care", name: "Hair Care", tagline: "Japanese premium repair", accent: "#7a5b34" },
  { slug: "grooming", name: "Grooming", tagline: "Classic Italian barbering", accent: "#2b2b2b" },
  { slug: "gift-sets", name: "Gift Sets", tagline: "Curated to be gifted", accent: "#8a6d3b" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export const PRODUCTS: NewProduct[] = [
  // ---- Oral Care (Marvis) ----
  {
    slug: "marvis-classic-strong-mint-75ml",
    name: "Classic Strong Mint Toothpaste",
    brand: "Marvis",
    category: "oral-care",
    price: 47,
    size: "75ml",
    description: "The definitive Marvis mint — cool, crisp and long-lasting in the iconic aluminium tube.",
    badge: "Bestseller",
    accent: "#1f3d2b",
    featured: true,
  },
  {
    slug: "marvis-whitening-mint-75ml",
    name: "Whitening Mint Toothpaste",
    brand: "Marvis",
    category: "oral-care",
    price: 57,
    size: "75ml",
    description: "Gentle whitening with a refreshing mint finish for a brighter everyday smile.",
    accent: "#20415c",
    featured: false,
  },
  {
    slug: "marvis-amarelli-licorice-mint-75ml",
    name: "Amarelli Licorice Mint Toothpaste",
    brand: "Marvis",
    category: "oral-care",
    price: 47,
    size: "75ml",
    description: "A rare pairing of Amarelli licorice and mint — unmistakably sophisticated.",
    badge: "Editor's Pick",
    accent: "#3a2c4a",
    featured: true,
  },
  {
    slug: "marvis-jasmin-mint-75ml",
    name: "Jasmin Mint Toothpaste",
    brand: "Marvis",
    category: "oral-care",
    price: 47,
    size: "75ml",
    description: "Delicate jasmine blossom lifted by clean mint for a floral, luxurious ritual.",
    accent: "#5a4b2f",
    featured: false,
  },
  {
    slug: "marvis-spearmint-mouthwash-120ml",
    name: "Spearmint Mouthwash",
    brand: "Marvis",
    category: "oral-care",
    price: 70,
    size: "120ml",
    description: "Alcohol-crisp spearmint rinse that leaves the mouth clean and quietly refined.",
    accent: "#1f3d2b",
    featured: false,
  },
  {
    slug: "marvis-medium-black-toothbrush",
    name: "Medium Toothbrush — Black",
    brand: "Marvis",
    category: "oral-care",
    price: 20,
    size: "Medium",
    description: "The finishing touch to the vanity: a sculpted black brush with medium bristles.",
    accent: "#141414",
    featured: false,
  },

  // ---- Hair Care (Fino) ----
  {
    slug: "fino-premium-touch-hair-mask-230g",
    name: "Premium Touch Hair Mask",
    brand: "Fino",
    category: "hair-care",
    price: 82,
    size: "230g",
    description: "Shiseido's cult Japanese mask with royal jelly EX — deep repair for tired, dry hair.",
    badge: "Cult Favourite",
    accent: "#7a5b34",
    featured: true,
  },
  {
    slug: "fino-premium-touch-hair-oil-70ml",
    name: "Premium Touch Hair Oil",
    brand: "Fino",
    category: "hair-care",
    price: 99,
    size: "70ml",
    description: "A concentrated repairing oil that tames frizz and returns a glassy, healthy shine.",
    accent: "#8a6d3b",
    featured: false,
  },
  {
    slug: "fino-premium-touch-shampoo-550ml",
    name: "Premium Touch Moisturizing Shampoo",
    brand: "Fino",
    category: "hair-care",
    price: 89,
    size: "550ml",
    description: "Salon-grade cleansing with PCA and Lipidure EX for damaged and chemically treated hair.",
    accent: "#6b5330",
    featured: false,
  },

  // ---- Grooming (Proraso) ----
  {
    slug: "proraso-beard-oil-wood-spice-30ml",
    name: "Beard Oil — Wood & Spice",
    brand: "Proraso",
    category: "grooming",
    price: 54,
    size: "30ml",
    description: "Nourishes and tames the beard with a warm cedar-and-spice signature.",
    badge: "New",
    accent: "#2b2b2b",
    featured: true,
  },
  {
    slug: "proraso-shaving-soap-bowl-150ml",
    name: "Shaving Soap in Bowl",
    brand: "Proraso",
    category: "grooming",
    price: 34,
    size: "150ml",
    description: "A rich, protective lather from the century-old Italian barbering house.",
    accent: "#1f3d2b",
    featured: false,
  },
  {
    slug: "proraso-after-shave-balm-100ml",
    name: "After Shave Balm — Wood & Spice",
    brand: "Proraso",
    category: "grooming",
    price: 54,
    size: "100ml",
    description: "Soothes and moisturises post-shave without any greasy residue.",
    accent: "#3a3226",
    featured: false,
  },

  // ---- Gift Sets ----
  {
    slug: "marvis-7-flavors-box",
    name: "Marvis 7 Flavours Box",
    brand: "Marvis",
    category: "gift-sets",
    price: 222,
    size: "7 × 25ml",
    description: "The complete Marvis wardrobe — seven signature flavours in a collector's box.",
    badge: "Gift",
    accent: "#8a6d3b",
    featured: true,
  },
  {
    slug: "marvis-gift-set-of-5",
    name: "Marvis Gift Set of 5",
    brand: "Marvis",
    category: "gift-sets",
    price: 120,
    size: "5 × 25ml",
    description: "Five luxurious Marvis toothpastes presented for effortless gifting.",
    accent: "#5a4b2f",
    featured: false,
  },
];
