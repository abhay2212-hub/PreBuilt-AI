import { NextResponse } from "next/server"
import { detectScopeCreep } from "@/lib/ai"

export async function POST(request: Request) {
  try {
    const { originalScope, clientMessage } = await request.json()
    const resultString = await detectScopeCreep(originalScope, clientMessage)

    try {
      // Find JSON block if AI wrapped it in markdown code fences
      let cleanString = resultString.trim()
      if (cleanString.includes("```json")) {
        cleanString = cleanString.split("```json")[1].split("```")[0].trim()
      } else if (cleanString.includes("```")) {
        cleanString = cleanString.split("```")[1].split("```")[0].trim()
      }
      const parsed = JSON.parse(cleanString)
      return NextResponse.json(parsed)
    } catch {
      return NextResponse.json({
        isScopeCreep: resultString.toLowerCase().includes("true") || resultString.toLowerCase().includes("yes"),
        explanation: resultString,
      })
    }
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Failed to analyze scope creep" },
      { status: 500 }
    )
  }
}
