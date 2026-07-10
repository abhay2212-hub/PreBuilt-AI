import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClientServer, createClientAdmin } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const supabase = await createClientServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { priceId } = (await req.json()) as { priceId: string }
    const admin = createClientAdmin()

    // Ensure stripe customer id on profile
    const { data: profile } = await admin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single()
    let customerId = profile?.stripe_customer_id
    if (!customerId) {
      const c = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      })
      customerId = c.id
      await admin
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id)
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId!,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?canceled=1`,
    })
    return NextResponse.json({ url: session.url })
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 550 })
  }
}
