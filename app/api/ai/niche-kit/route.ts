import { NextResponse } from "next/server"
import { generateNicheKit } from "@/lib/ai"

export async function POST(request: Request) {
  try {
    const { niche } = await request.json()
    const kitText = await generateNicheKit(niche)

    try {
      let cleanString = kitText.trim()
      if (cleanString.includes("```json")) {
        cleanString = cleanString.split("```json")[1].split("```")[0].trim()
      } else if (cleanString.includes("```")) {
        cleanString = cleanString.split("```")[1].split("```")[0].trim()
      }
      const parsed = JSON.parse(cleanString)
      return NextResponse.json(parsed)
    } catch {
      return NextResponse.json({ rawKit: kitText })
    }
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Failed to generate niche kit" },
      { status: 500 }
    )
  }
}
