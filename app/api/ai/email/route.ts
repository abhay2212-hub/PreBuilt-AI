import { NextResponse } from "next/server"
import { generateEmail } from "@/lib/ai"

export async function POST(request: Request) {
  try {
    const { emailType, clientName, projectName, context } =
      await request.json()
    const email = await generateEmail(
      emailType,
      clientName,
      projectName,
      context
    )
    return NextResponse.json({ email })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Failed to generate email" },
      { status: 500 }
    )
  }
}
