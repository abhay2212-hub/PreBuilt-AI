import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "placeholder_key",
})

export async function askAI(prompt: string): Promise<string> {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.warn("GROQ_API_KEY is not set. Using simulated response.")
      return getSimulatedResponse(prompt)
    }
    const response = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
      temperature: 0.7,
    })
    return response.choices[0]?.message?.content || ""
  } catch (error) {
    console.error("AI Error:", error)
    return "AI temporarily unavailable. Using simulated offline backup: \n\n" + getSimulatedResponse(prompt)
  }
}

function getSimulatedResponse(prompt: string): string {
  // If the prompt is asking for JSON, return simulated JSON.
  if (prompt.includes("Return as JSON")) {
    if (prompt.includes("detectScopeCreep") || prompt.includes("scope creep") || prompt.includes("Scope creep")) {
      return JSON.stringify({
        isScopeCreep: true,
        confidence: 90,
        explanation: "The client is requesting 2 additional custom revisions that were not part of the initial agreed scope details.",
        extraHours: "4-5 hours",
        suggestedResponse: "Hi Client! I would love to help you with these additions. As these fall outside our original scope of work, they will require an additional 4 hours of development which will cost $200. Please let me know if you would like me to draft an updated proposal for this change.",
        additionalCost: "$200"
      }, null, 2)
    }
    if (prompt.includes("generateProjectPlan") || prompt.includes("project plan") || prompt.includes("PROJECT")) {
      return JSON.stringify({
        overview: "A structured workflow to deliver the project in record time with verified quality checkpoints.",
        totalHours: 35,
        phases: [
          {
            name: "Research & Planning",
            duration: "2 days",
            tasks: [
              { task: "Initial discovery & setup", hours: 5, description: "Align on design systems and configure project variables.", tools: ["Figma", "Next.js"] }
            ]
          },
          {
            name: "Development Phase",
            duration: "5 days",
            tasks: [
              { task: "Component building & page structures", hours: 15, description: "Code responsive modules and views.", tools: ["TailwindCSS", "React"] }
            ]
          },
          {
            name: "Testing & Deployment",
            duration: "2 days",
            tasks: [
              { task: "Vercel hosting & performance audit", hours: 5, description: "Check responsiveness, run builds, and deploy live.", tools: ["Vercel", "Lighthouse"] }
            ]
          }
        ],
        risks: ["Delay in API credential delivery from client", "Scope adjustments mid-milestone"],
        deliverables: ["Responsive web application code link", "Design-to-code components library", "Production deployment URL"],
        tools: ["Next.js", "Tailwind CSS", "Groq AI"]
      }, null, 2)
    }
    if (prompt.includes("generateNicheKit") || prompt.includes("niche") || prompt.includes("NICHE")) {
      return JSON.stringify({
        overview: "A curated roadmap to establish authority and attract high-paying clients in this freelance niche.",
        avgRates: {
          beginner: "$35-50/hr",
          intermediate: "$65-90/hr",
          expert: "$120-180/hr"
        },
        skills: ["Technical Expertise", "Client Communication", "Responsive Web Layouts", "API Integrations"],
        freeTools: ["Next.js", "Tailwind CSS", "Vercel", "Cursor IDE", "GitHub"],
        learningPath: [
          { week: 1, goal: "Design Systems & Tailwind CSS Fundamentals", resources: ["Tailwind Docs", "YouTube Crash Courses"] },
          { week: 2, goal: "TypeScript & State Management in Next.js", resources: ["Next.js App Router Guides"] }
        ],
        portfolioIdeas: ["SaaS Landing Page mockup", "Client CRM dashboard demo project", "E-commerce checkout prototype"],
        firstClientSteps: ["Optimize LinkedIn & Upwork profiles with niche keywords", "Cold outreach to 10 local agencies with customized audit loom videos", "Contribute minor fixes to active open-source projects in the niche"],
        commonMistakes: ["Underpricing to win the first contract", "Poor communication when milestones slip", "Failing to establish a formal scope of work"],
        incomePotential: "$5,000 - $12,000 per month within 6 months of active prospecting"
      }, null, 2)
    }
  }

  // Text response simulations
  if (prompt.includes("bid proposal") || prompt.includes("proposal")) {
    return `Dear Client,

I read your job post and understand you are looking for an experienced freelancer to deliver this project successfully. With my expertise in the required skills, I am confident I can build a solution that meets your exact needs.

My approach will be:
1. Setup & Discovery: Review design guidelines and outline responsive layouts.
2. Clean Coding: Implement clean, type-safe Next.js code with modern styling.
3. Rapid Deployment: Deliver fully functional code deployed on Vercel with clean API endpoints.

I have completed similar projects with great feedback. I can start immediately and deliver the first milestone within 5 days.

Let's hop on a quick call to discuss the project details.

Best regards,
John Doe`
  }

  if (prompt.includes("email") || prompt.includes("EMAIL")) {
    return `Subject: Update on Project Milestones & Deliverables

Hi Client Name,

I hope you are having a wonderful week.

I wanted to send a quick update on our progress for Project Name. We have completed the core setup and layout components, and we are currently on track to deliver the first interactive milestone by our deadline.

Please let me know if you have any questions or would like to review the staging link!

Best regards,
John Doe`
  }

  return "This is a simulated AI response. To get real AI responses, please obtain a free Groq API Key and configure GROQ_API_KEY in your .env.local file."
}

export async function generateBidProposal(
  jobTitle: string,
  jobDescription: string,
  freelancerSkills: string,
  budget: string
): Promise<string> {
  const prompt = `
You are an expert freelance proposal writer for USA market.
Write a WINNING bid proposal for this job.

JOB TITLE: ${jobTitle}
JOB DESCRIPTION: ${jobDescription}
FREELANCER SKILLS: ${freelancerSkills}
CLIENT BUDGET: ${budget}

Write a professional personalized proposal that:
1. Opens by understanding the client problem
2. Explains your solution clearly
3. Mentions relevant experience
4. Gives a clear timeline
5. Ends with confident call to action

Keep under 300 words. Be specific not generic.
Sound human not robotic.
`
  return askAI(prompt)
}

export async function generateProjectPlan(
  projectTitle: string,
  projectDescription: string,
  deadline: string
): Promise<string> {
  const prompt = `
You are a project manager helping a freelancer.
Create a step by step project plan.

PROJECT: ${projectTitle}
DESCRIPTION: ${projectDescription}
DEADLINE: ${deadline}

Return as JSON:
{
  "overview": "brief overview",
  "totalHours": 20,
  "phases": [
    {
      "name": "Phase name",
      "duration": "2 days",
      "tasks": [
        {
          "task": "task name",
          "hours": 2,
          "description": "details",
          "tools": ["tool1"]
        }
      ]
    }
  ],
  "risks": ["risk1"],
  "deliverables": ["item1"],
  "tools": ["tool1"]
}
`
  return askAI(prompt)
}

export async function detectScopeCreep(
  originalScope: string,
  clientMessage: string
): Promise<string> {
  const prompt = `
Analyze if this client request is scope creep.

ORIGINAL SCOPE: ${originalScope}
CLIENT NEW REQUEST: ${clientMessage}

Return as JSON:
{
  "isScopeCreep": true,
  "confidence": 85,
  "explanation": "why",
  "extraHours": "2-3 hours",
  "suggestedResponse": "message to send client",
  "additionalCost": "$150-200"
}
`
  return askAI(prompt)
}

export async function generateEmail(
  emailType: string,
  clientName: string,
  projectName: string,
  context: string
): Promise<string> {
  const prompt = `
Write a professional freelancer email.

TYPE: ${emailType}
CLIENT: ${clientName}
PROJECT: ${projectName}
CONTEXT: ${context}

Write only the email body.
Be professional but friendly.
Keep concise and clear.
`
  return askAI(prompt)
}

export async function generateNicheKit(
  niche: string
): Promise<string> {
  const prompt = `
Create a complete freelance starter kit for:
NICHE: ${niche}

Return as JSON:
{
  "overview": "what this niche involves",
  "avgRates": {
    "beginner": "$20-40/hr",
    "intermediate": "$50-80/hr",
    "expert": "$100-150/hr"
  },
  "skills": ["skill1", "skill2"],
  "freeTools": ["tool1"],
  "learningPath": [
    {
      "week": 1,
      "goal": "learn basics",
      "resources": ["resource1"]
    }
  ],
  "portfolioIdeas": ["idea1"],
  "firstClientSteps": ["step1"],
  "commonMistakes": ["mistake1"],
  "incomePotential": "realistic expectations"
}
`
  return askAI(prompt)
}
