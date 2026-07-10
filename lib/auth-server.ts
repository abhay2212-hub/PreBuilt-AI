import { createClientServer } from "@/lib/supabase"

export async function getUserOrThrow() {
  const supabase = await createClientServer()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) throw new Error("UNAUTHORIZED")
  return { supabase, user }
}
