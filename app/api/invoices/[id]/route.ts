import { NextResponse } from "next/server"
import { getUserOrThrow } from "@/lib/auth-server"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { supabase } = await getUserOrThrow()
    const { data, error } = await supabase
      .from("invoices")
      .select("*, client:clients(), items:invoice_items(*)")
      .eq("id", id)
      .single()
    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
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
      .from("invoices")
      .delete()
      .eq("id", id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
