import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const post = await getBlogPost(handle);
  if (!post) return { title: "Article" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function BlogPost({ params }: Params) {
  const { handle } = await params;
  const post = await getBlogPost(handle);
  if (!post) notFound();

  const { rows: all } = await getBlogPosts();
  const more = all.filter((p) => p.handle !== post.handle).slice(0, 3);

  return (
    <main id="main" className="section container article">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> <span>/</span>
        <Link href="/blogs">Journal</Link> <span>/</span> <span className="crumb-current">{post.title}</span>
      </nav>

      <header className="article-head">
        <span className="journal-date">{post.published} · {post.author}</span>
        <h1>{post.title}</h1>
      </header>

      <div className="rich-text prose article-body" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

      {more.length > 0 && (
        <section className="section">
          <div className="section-head"><div><span className="eyebrow">Keep reading</span><h2>More from the Journal</h2></div></div>
          <div className="journal-grid">
            {more.map((p) => (
              <Link key={p.handle} href={`/blogs/${p.handle}`} className="journal-card">
                <span className="journal-date">{p.published}</span>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <span className="journal-more">Read more →</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
