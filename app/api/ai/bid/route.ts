import { NextResponse } from "next/server"
import { generateBidProposal } from "@/lib/ai"

export async function POST(request: Request) {
  try {
    const { jobTitle, jobDescription, freelancerSkills, budget } =
      await request.json()
    const proposal = await generateBidProposal(
      jobTitle,
      jobDescription,
      freelancerSkills,
      budget
    )
    return NextResponse.json({ proposal })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Failed to generate bid proposal" },
      { status: 500 }
    )
  }
}
