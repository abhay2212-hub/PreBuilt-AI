import { NextResponse } from "next/server"
import { getUserOrThrow } from "@/lib/auth-server"
import { BidSchema } from "@/lib/validate"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { supabase } = await getUserOrThrow()
    const parsed = BidSchema.partial().safeParse(await req.json())
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid" }, { status: 400 })

    const { data, error } = await supabase
      .from("bids")
      .update(parsed.data)
      .eq("id", id)
      .select()
      .single()
    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 550 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { supabase } = await getUserOrThrow()
    const { error } = await supabase.from("bids").delete().eq("id", id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
