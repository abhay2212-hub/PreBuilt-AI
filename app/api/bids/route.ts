import { NextResponse } from "next/server"
import { getUserOrThrow } from "@/lib/auth-server"
import { BidSchema } from "@/lib/validate"

export async function GET() {
  try {
    const { supabase } = await getUserOrThrow()
    const { data, error } = await supabase
      .from("bids")
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
    const parsed = BidSchema.safeParse(await req.json())
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid" }, { status: 400 })

    const payload = {
      user_id: user.id,
      platform: parsed.data.platform,
      job_title: parsed.data.job_title,
      job_description: parsed.data.job_description,
      client_name: parsed.data.client_name,
      bid_amount: parsed.data.bid_amount,
      status: parsed.data.status ?? "SUBMITTED",
      submitted_at: parsed.data.submitted_at ?? new Date().toISOString(),
      follow_up_at: parsed.data.follow_up_at ?? null,
      job_url: parsed.data.job_url,
      proposal_text: parsed.data.proposal_text,
    }
    const { data, error } = await supabase
      .from("bids")
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
