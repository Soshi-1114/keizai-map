import { describe, it, expect } from "vitest";
import { articleOpenGraph } from "./article-metadata";
import { ARTICLES } from "./articles";

describe("articleOpenGraph", () => {
  const known = ARTICLES[0];

  it("returns type=article with JST publishedTime/modifiedTime", () => {
    const og = articleOpenGraph(known.slug);
    expect((og as { type: string }).type).toBe("article");
    expect((og as { publishedTime: string }).publishedTime).toBe(`${known.publishedAt}T00:00:00+09:00`);
    expect((og as { modifiedTime: string }).modifiedTime).toBe(`${known.updatedAt}T00:00:00+09:00`);
  });

  it("includes KeizaiMap author and tags from article meta", () => {
    const og = articleOpenGraph(known.slug);
    expect((og as { authors: string[] }).authors).toEqual(["KeizaiMap"]);
    expect((og as { tags: string[] }).tags).toEqual(known.tags);
  });

  it("emits og:image pointing to /og/article?slug=...", () => {
    const og = articleOpenGraph(known.slug);
    const images = (og as { images: Array<{ url: string }> }).images;
    expect(images).toHaveLength(1);
    expect(images[0].url).toBe(`/og/article?slug=${known.slug}`);
  });

  it("throws on unknown slug", () => {
    expect(() => articleOpenGraph("missing-slug-zzz")).toThrowError(
      /unknown slug "missing-slug-zzz"/,
    );
  });

  it("works for every article registered in ARTICLES (smoke)", () => {
    for (const a of ARTICLES) {
      const og = articleOpenGraph(a.slug);
      expect((og as { type: string }).type).toBe("article");
      expect((og as { tags: string[] }).tags).toEqual(a.tags);
    }
  });
});
