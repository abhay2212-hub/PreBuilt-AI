import { NextResponse } from "next/server"
import { generateProjectPlan } from "@/lib/ai"

export async function POST(request: Request) {
  try {
    const { title, description, deadline } = await request.json()
    const planText = await generateProjectPlan(title, description, deadline)

    try {
      let cleanString = planText.trim()
      if (cleanString.includes("```json")) {
        cleanString = cleanString.split("```json")[1].split("```")[0].trim()
      } else if (cleanString.includes("```")) {
        cleanString = cleanString.split("```")[1].split("```")[0].trim()
      }
      const parsed = JSON.parse(cleanString)
      return NextResponse.json(parsed)
    } catch {
      return NextResponse.json({ rawPlan: planText })
    }
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Failed to generate project plan" },
      { status: 500 }
    )
  }
}
