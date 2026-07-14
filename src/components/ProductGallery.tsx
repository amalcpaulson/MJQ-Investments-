"use client";

import { useState } from "react";
import Image from "next/image";

/** Product image gallery with selectable thumbnails. */
export default function ProductGallery({ images, title, accent }: { images: string[]; title: string; accent: string }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [];

  if (list.length === 0) {
    return (
      <div className="pdp-gallery">
        <div className="pdp-main" style={{ background: `linear-gradient(160deg, ${accent}, #10120e)` }} />
      </div>
    );
  }

  return (
    <div className="pdp-gallery">
      <div className="pdp-main" style={{ "--card-accent": accent } as React.CSSProperties}>
        <Image
          key={list[active]}
          src={list[active]}
          alt={title}
          fill
          sizes="(max-width: 900px) 100vw, 560px"
          className="product-img"
          priority
        />
      </div>
      {list.length > 1 && (
        <div className="pdp-thumbs" role="group" aria-label="Product images">
          {list.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`pdp-thumb ${i === active ? "active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === active}
              style={{ "--card-accent": accent } as React.CSSProperties}
            >
              <Image src={src} alt="" fill sizes="80px" className="product-img" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
