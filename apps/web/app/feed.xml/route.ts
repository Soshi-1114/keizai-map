import { ARTICLES } from "@/lib/articles";
import { BASE_URL } from "@/lib/constants";

export async function GET() {
  const items = ARTICLES.map(
    (a) => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${BASE_URL}/articles/${a.slug}</link>
      <description><![CDATA[${a.description}]]></description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <guid isPermaLink="true">${BASE_URL}/articles/${a.slug}</guid>
    </item>`
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>KeizaiMap 解説記事</title>
    <link>${BASE_URL}/articles</link>
    <description>日本経済のキーワードをデータとともに解説する記事一覧</description>
    <language>ja</language>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
