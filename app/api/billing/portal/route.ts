import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClientServer, createClientAdmin } from "@/lib/supabase"

export async function POST() {
  try {
    const supabase = await createClientServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const admin = createClientAdmin()
    const { data: profile, error } = await admin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single()
    if (error || !profile?.stripe_customer_id)
      return NextResponse.json({ error: "No customer" }, { status: 400 })

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    })
    return NextResponse.json({ url: session.url })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
