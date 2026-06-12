/**
 * OG画像（satori）用に Noto Sans JP のサブセットを取得する。
 * satori は woff2 非対応のため、css2 API から ttf/otf の URL を抽出して取得する。
 */
export async function loadNotoSansJP(text: string, weight = 700): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (
    await fetch(cssUrl, {
      // woff2 ではなく ttf を返させるための古いUA
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; rv:10.0) Gecko/20100101 Firefox/10.0" },
    })
  ).text();

  const resource = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!resource) throw new Error("Failed to resolve font URL from Google Fonts CSS");

  const res = await fetch(resource[1]);
  if (!res.ok) throw new Error(`Failed to fetch font: ${res.status}`);
  return res.arrayBuffer();
}
