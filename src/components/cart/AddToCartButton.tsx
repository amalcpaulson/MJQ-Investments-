"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { useT } from "@/i18n/client";

interface Props {
  handle: string;
  title: string;
  image: string | null;
  priceFils: number;
  available?: boolean;
  className?: string;
  label?: string;
  compact?: boolean;
}

/** Adds a product to the cart with brief "Added ✓" feedback. */
export default function AddToCartButton({
  handle,
  title,
  image,
  priceFils,
  available = true,
  className = "add-btn",
  label,
  compact,
}: Props) {
  const { add } = useCart();
  const { t } = useT();
  const [added, setAdded] = useState(false);

  if (!available) {
    return (
      <button type="button" className={className} disabled aria-disabled="true">
        {t("common.soldOut")}
      </button>
    );
  }

  const onClick = () => {
    add({ handle, title, image, priceFils });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-label={`${t("common.add")} — ${title}`}
    >
      {added ? (compact ? "✓" : t("common.added")) : label ?? t("common.add")}
    </button>
  );
}
