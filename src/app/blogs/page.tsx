import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/catalog";
import { getT } from "@/i18n/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Journal",
  description: "Stories, guides and rituals from Luxury.ae — on Marvis, Fino, Proraso and the art of everyday luxury.",
};

export default async function BlogIndex() {
  const { t } = await getT();
  const { rows: posts } = await getBlogPosts();
  const [lead, ...rest] = posts;

  return (
    <main id="main" className="section container">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">{t("common.home")}</Link> <span>/</span> <span>{t("journal.eyebrow")}</span>
      </nav>

      <div className="page-head">
        <span className="eyebrow">{t("journal.eyebrow")}</span>
        <h1>{t("journal.title")}</h1>
        <p>{t("journal.lead")}</p>
      </div>

      {lead && (
        <Link href={`/blogs/${lead.handle}`} className="journal-lead">
          <span className="journal-date">{lead.published}</span>
          <h2>{lead.title}</h2>
          <p>{lead.excerpt}</p>
          <span className="journal-more">{t("journal.readArticle")}</span>
        </Link>
      )}

      <div className="journal-grid">
        {rest.map((post) => (
          <Link key={post.handle} href={`/blogs/${post.handle}`} className="journal-card">
            <span className="journal-date">{post.published}</span>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <span className="journal-more">{t("journal.readMore")}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
