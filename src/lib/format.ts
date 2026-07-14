/** Format a price stored in fils (1/100 AED) as a display string. */
export function formatPrice(fils: number): string {
  const aed = fils / 100;
  const value = Number.isInteger(aed) ? aed.toLocaleString("en-AE") : aed.toFixed(2);
  return `AED ${value}`;
}

const COLLECTION_NAMES: Record<string, string> = {
  marvis: "Marvis Toothpaste",
  "toothpaste-75ml": "Toothpaste · 75ml",
  "toothpaste-25ml": "Toothpaste · 25ml",
  mouthwash: "Mouthwash",
  toothbrushes: "Toothbrushes",
  fino: "Fino Hair Care",
  proraso: "Proraso Grooming",
  "proraso-shaving-products": "Proraso Shaving",
  "proraso-beard-moustache-care": "Beard & Moustache",
  "gift-set-collection": "Gift Sets",
  "uae-favorite": "UAE Favourites",
  featured: "Featured",
};

/** Human-friendly collection title (the raw Shopify titles are SEO-stuffed). */
export function collectionTitle(handle: string, fallback = ""): string {
  return COLLECTION_NAMES[handle] ?? fallback ?? handle;
}

/** Deterministic accent colour per brand — used for gradients/placeholders. */
export function brandAccent(vendor: string): string {
  switch (vendor.toLowerCase()) {
    case "marvis": return "#1f3d2b";
    case "fino": return "#7a5b34";
    case "proraso": return "#2b2b2b";
    default: return "#3a2c4a";
  }
}
