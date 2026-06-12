import { NextResponse, type NextRequest } from "next/server";

/**
 * トップページ `/` の SSR レスポンスをVercelエッジで1時間キャッシュする。
 * これによりSSGに近い TTFB を保ちつつ、クエリパラメータ付き共有URLのUXを損なわない。
 * クエリ文字列はキャッシュキーに含まれるため `/?range=2012,2020` も独立にキャッシュされる。
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.pathname === "/") {
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400",
    );
  }

  return response;
}

export const config = {
  matcher: "/",
};
