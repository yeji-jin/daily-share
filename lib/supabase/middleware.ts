import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/types/database.types";

const PROTECTED_PATHS = ["/", "/post", "/profile", "/settings", "/reset-password"];
const AUTH_ONLY_PATHS = ["/signin", "/signup", "/forgot-password"];

function matchesPath(pathname: string, paths: string[]) {
  return paths.some((path) => (path === "/" ? pathname === "/" : pathname.startsWith(path)));
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // supabase.auth.getUser()를 호출해야 만료된 토큰이 갱신되고 쿠키가 새로 세팅
  // 이 호출 전에 다른 로직으로 일찍 return하면 세션 갱신이 누락될 수 있음
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtectedPath = matchesPath(pathname, PROTECTED_PATHS);
  const isAuthOnlyPath = matchesPath(pathname, AUTH_ONLY_PATHS);

  if (!user && isProtectedPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/signin";
    redirectUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthOnlyPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
