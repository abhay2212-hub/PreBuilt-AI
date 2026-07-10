import { createBrowserClient, createServerClient } from "@supabase/ssr"
import { createClient as createAdmin } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const createClientBrowser = () =>
  createBrowserClient(supabaseUrl, supabaseAnon)

export const createClientServer = async () => {
  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()
  return createServerClient(supabaseUrl, supabaseAnon, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Can be ignored if session refresh is handled by middleware
        }
      },
    },
  })
}

// ONLY on server routes/webhooks (never import this in client bundles)
export const createClientAdmin = () =>
  createAdmin(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  })
