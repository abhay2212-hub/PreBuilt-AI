import { NextResponse } from "next/server"
import { getUserOrThrow } from "@/lib/auth-server"
import { InvoiceSchema } from "@/lib/validate"

export async function GET() {
  try {
    const { supabase } = await getUserOrThrow()
    const { data, error } = await supabase
      .from("invoices")
      .select("*, client:clients(name,email), items:invoice_items()")
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
    const parsed = InvoiceSchema.safeParse(await req.json())
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid" }, { status: 400 })

    const { items, ...rest } = parsed.data

    // 1) create invoice (invoice_number autogenerates in trigger)
    const { data: inv, error: e1 } = await supabase
      .from("invoices")
      .insert({
        user_id: user.id,
        client_id: rest.client_id,
        project_id: rest.project_id ?? null,
        issue_date: rest.issue_date ?? new Date().toISOString(),
        due_date: rest.due_date,
        currency: rest.currency,
        notes: rest.notes ?? null,
        terms: rest.terms ?? null,
      })
      .select()
      .single()
    if (e1) throw e1

    // 2) insert items
    if (items?.length) {
      const rows = items.map((i) => ({
        user_id: user.id,
        invoice_id: inv.id,
        description: i.description,
        quantity: i.quantity,
        rate: i.rate,
        amount: i.quantity * i.rate,
      }))
      const { error: e2 } = await supabase.from("invoice_items").insert(rows)
      if (e2) throw e2
    }

    // 3) return full invoice with computed totals
    const { data: full, error: e3 } = await supabase
      .from("invoices")
      .select("*, client:clients(*), items:invoice_items(*)")
      .eq("id", inv.id)
      .single()
    if (e3) throw e3

    return NextResponse.json(full, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
