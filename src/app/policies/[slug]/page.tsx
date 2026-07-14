import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POLICIES, getPolicy } from "@/data/policies";
import { getT } from "@/i18n/server";
import { POLICIES_AR } from "@/i18n/content-ar";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POLICIES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);
  return { title: policy?.title ?? "Policy" };
}

export default async function PolicyPage({ params }: Params) {
  const { slug } = await params;
  const { locale, t } = await getT();
  const en = getPolicy(slug);
  const policy = locale === "ar" ? (POLICIES_AR[slug] ?? en) : en;
  if (!policy) notFound();

  const legal = locale === "ar" ? "قانوني" : "Legal";
  const updated = locale === "ar" ? "آخر تحديث" : "Last updated";

  return (
    <main id="main" className="section container content-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">{t("common.home")}</Link> <span>/</span> <span>{policy.title}</span>
      </nav>

      <div className="page-head">
        <span className="eyebrow">{legal}</span>
        <h1>{policy.title}</h1>
        <p>{updated} {policy.updated}</p>
      </div>

      <div className="rich-text prose" dangerouslySetInnerHTML={{ __html: policy.html }} />
    </main>
  );
}
