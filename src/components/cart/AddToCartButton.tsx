"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

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
  label = "Add",
  compact,
}: Props) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  if (!available) {
    return (
      <button type="button" className={className} disabled aria-disabled="true">
        Sold out
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
      aria-label={`Add ${title} to cart`}
    >
      {added ? (compact ? "✓" : "Added ✓") : label}
    </button>
  );
}
