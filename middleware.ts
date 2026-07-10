import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const protectedPaths = [
    "/dashboard",
    "/projects",
    "/clients",
    "/bids",
    "/invoices",
    "/time-tracking",
    "/earnings",
    "/niche-kits",
    "/ai-tools",
  ]
  const isProtected = protectedPaths.some((p) =>
    req.nextUrl.pathname.startsWith(p)
  )
  if (isProtected && !user) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirectedFrom", req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
  return res
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/clients/:path*",
    "/bids/:path*",
    "/invoices/:path*",
    "/time-tracking/:path*",
    "/earnings/:path*",
    "/niche-kits/:path*",
    "/ai-tools/:path*",
  ],
}
