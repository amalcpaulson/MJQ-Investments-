import Link from "next/link";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  cta?: { label: string; href: string };
}

/** Consistent section header used across the site. */
export default function SectionHead({ eyebrow, title, description, cta }: Props) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {cta && (
        <Link href={cta.href} className="btn btn-ghost">{cta.label}</Link>
      )}
    </div>
  );
}
