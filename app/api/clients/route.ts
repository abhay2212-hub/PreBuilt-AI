import { NextResponse } from "next/server"
import { getUserOrThrow } from "@/lib/auth-server"
import { ClientSchema } from "@/lib/validate"

export async function GET() {
  try {
    const { supabase } = await getUserOrThrow()
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    const { supabase, user } = await getUserOrThrow()
    const body = await req.json()
    const parsed = ClientSchema.safeParse(body)
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })

    const payload = { user_id: user.id, ...parsed.data }
    const { data, error } = await supabase
      .from("clients")
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
