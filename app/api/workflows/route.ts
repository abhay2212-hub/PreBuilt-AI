import { NextResponse } from "next/server"
import { getUserOrThrow } from "@/lib/auth-server"
import { WorkflowSchema } from "@/lib/validate"

export async function GET() {
  try {
    const { supabase } = await getUserOrThrow()
    const { data, error } = await supabase
      .from("workflows")
      .select("*, workflow_steps(*)")
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
    const body = await req.json()
    const parsed = WorkflowSchema.safeParse(body)
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid" }, { status: 400 })

    const { steps, ...rest } = parsed.data

    // 1) Insert Workflow
    const { data: flow, error: e1 } = await supabase
      .from("workflows")
      .insert({ user_id: user.id, name: rest.name, active: rest.active })
      .select()
      .single()
    if (e1) throw e1

    // 2) Insert Steps
    if (steps?.length) {
      const stepRows = steps.map((s) => ({
        workflow_id: flow.id,
        position: s.position,
        type: s.type,
        config: s.config,
      }))
      const { error: e2 } = await supabase.from("workflow_steps").insert(stepRows)
      if (e2) throw e2
    }

    return NextResponse.json({ ...flow, steps }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
