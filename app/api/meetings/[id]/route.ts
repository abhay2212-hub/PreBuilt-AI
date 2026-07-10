import { NextResponse } from "next/server"
import { getUserOrThrow } from "@/lib/auth-server"
import { MeetingSchema } from "@/lib/validate"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { supabase } = await getUserOrThrow()
    const { data, error } = await supabase
      .from("meetings")
      .select("*, project:projects(*)")
      .eq("id", id)
      .single()
    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { supabase } = await getUserOrThrow()
    const body = await req.json()
    const parsed = MeetingSchema.partial().safeParse(body)
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid" }, { status: 400 })

    const { data, error } = await supabase
      .from("meetings")
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
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { supabase } = await getUserOrThrow()
    const { error } = await supabase.from("meetings").delete().eq("id", id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
