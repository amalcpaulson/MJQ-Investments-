import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POLICIES, getPolicy } from "@/data/policies";

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
  const policy = getPolicy(slug);
  if (!policy) notFound();

  return (
    <main id="main" className="section container content-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> <span>/</span> <span>{policy.title}</span>
      </nav>

      <div className="page-head">
        <span className="eyebrow">Legal</span>
        <h1>{policy.title}</h1>
        <p>Last updated {policy.updated}</p>
      </div>

      <div className="rich-text prose" dangerouslySetInnerHTML={{ __html: policy.html }} />
    </main>
  );
}
