import { NextResponse } from "next/server"
import { getUserOrThrow } from "@/lib/auth-server"
import { ClientSchema } from "@/lib/validate"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { supabase } = await getUserOrThrow()
    const body = await req.json()
    const parsed = ClientSchema.partial().safeParse(body)
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid" }, { status: 400 })

    const { data, error } = await supabase
      .from("clients")
      .update(parsed.data)
      .eq("id", id)
      .select()
      .single()
    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { supabase } = await getUserOrThrow()
    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
