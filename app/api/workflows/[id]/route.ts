import { NextResponse } from "next/server"
import { getUserOrThrow } from "@/lib/auth-server"
import { WorkflowSchema } from "@/lib/validate"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { supabase } = await getUserOrThrow()
    const body = await req.json()
    const parsed = WorkflowSchema.partial().safeParse(body)
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid" }, { status: 400 })

    const { steps, ...rest } = parsed.data

    // 1) Update workflow row
    const { data: flow, error: e1 } = await supabase
      .from("workflows")
      .update(rest)
      .eq("id", id)
      .select()
      .single()
    if (e1) throw e1

    // 2) If steps are provided, clear old and write new
    if (steps) {
      await supabase.from("workflow_steps").delete().eq("workflow_id", id)
      if (steps.length) {
        const stepRows = steps.map((s) => ({
          workflow_id: id,
          position: s.position,
          type: s.type,
          config: s.config,
        }))
        const { error: e2 } = await supabase
          .from("workflow_steps")
          .insert(stepRows)
        if (e2) throw e2
      }
    }

    return NextResponse.json(flow)
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { supabase } = await getUserOrThrow()
    const { error } = await supabase.from("workflows").delete().eq("id", id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
