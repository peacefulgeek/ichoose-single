/**
 * Plain fetch helpers for the public article API. Articles are served via
 * REST (not tRPC) so SSR / crawlers can hit them without any client code.
 */
import { useEffect, useState } from "react";

export interface ArticleSummary {
  slug: string;
  title: string;
  description: string;
  tldr: string;
  category: string;
  tags: string[];
  heroUrl: string | null;
  publishedAt: string;
  lastModifiedAt: string;
  wordCount: number;
  authorName: string;
}

export interface ArticleFull extends ArticleSummary {
  bodyHtml: string;
  asinsUsed: string[];
  internalLinks: { slug: string; title: string }[];
  externalLinks: { url: string; anchor: string }[];
}

interface ListResp {
  total: number;
  articles: ArticleSummary[];
}

export function useArticles(opts: { limit?: number; category?: string; q?: string } = {}) {
  const { limit = 30, category, q } = opts;
  const [data, setData] = useState<ListResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    if (category) params.set("category", category);
    if (q) params.set("q", q);
    setLoading(true);
    fetch(`/api/articles?${params.toString()}`)
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        setError(String(e));
        setLoading(false);
      });
  }, [limit, category, q]);

  return { data, loading, error };
}

export function useArticle(slug: string) {
  const [data, setData] = useState<ArticleFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/articles/${slug}`)
      .then(r => {
        if (r.status === 404) throw new Error("Article not found");
        return r.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        setError(String(e));
        setLoading(false);
      });
  }, [slug]);
  return { data, loading, error };
}
