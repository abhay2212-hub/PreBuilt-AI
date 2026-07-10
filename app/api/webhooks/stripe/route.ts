import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClientAdmin } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 })
  const secret = process.env.STRIPE_WEBHOOK_SECRET!
  const body = await req.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  const admin = createClientAdmin()

  try {
    if (event.type === "checkout.session.completed") {
      const session: any = event.data.object
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      )
      const priceId = subscription.items.data[0].price.id
      const customerId = session.customer as string

      const plan =
        priceId === process.env.NEXT_PUBLIC_PRICE_PRO
          ? "PRO"
          : priceId === process.env.NEXT_PUBLIC_PRICE_AGENCY
            ? "AGENCY"
            : "STARTER"

      await admin
        .from("profiles")
        .update({ plan })
        .eq("stripe_customer_id", customerId)
    }

    if (event.type === "customer.subscription.deleted") {
      const sub: any = event.data.object
      await admin
        .from("profiles")
        .update({ plan: "FREE" })
        .eq("stripe_customer_id", sub.customer as string)
    }
    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ error: "Handler failed" }, { status: 500 })
  }
}
