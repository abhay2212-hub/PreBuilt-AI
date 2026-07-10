import { NextResponse } from "next/server"
import { getUserOrThrow } from "@/lib/auth-server"

export async function POST(req: Request) {
  try {
    const { supabase, user } = await getUserOrThrow()
    const { eventName, payload } = await req.json()

    // 1) Find workflows
    const { data: flows, error: e1 } = await supabase
      .from("workflows")
      .select("*, workflow_steps(*)")
      .eq("user_id", user.id)
      .eq("active", true)
    if (e1) throw e1

    const executedRuns = []

    // 2) Run matching workflows
    for (const flow of flows || []) {
      // Log event
      await supabase.from("workflow_events").insert({
        user_id: user.id,
        name: eventName,
        payload,
      })

      // Create workflow run
      const { data: run, error: rErr } = await supabase
        .from("workflow_runs")
        .insert({
          user_id: user.id,
          workflow_id: flow.id,
          status: "RUNNING",
          context: { eventName, payload },
        })
        .select()
        .single()

      if (rErr) continue

      // Process steps
      let failed = false
      const steps = flow.workflow_steps || []
      steps.sort((a: any, b: any) => a.position - b.position)

      for (const step of steps) {
        // Execute step type
        try {
          if (step.type === "email") {
            console.log(
              `[Workflow Run ${run.id}] Simulated Resend dispatch of:`,
              step.config
            )
          } else if (step.type === "slack") {
            console.log(
              `[Workflow Run ${run.id}] Simulated Slack notification of:`,
              step.config
            )
          } else if (step.type === "webhook") {
            console.log(
              `[Workflow Run ${run.id}] Simulated Webhook ping to:`,
              step.config.url
            )
          }
        } catch (err) {
          failed = true
          break
        }
      }

      // Update run status
      const finalStatus = failed ? "FAILED" : "DONE"
      const { data: finalRun } = await supabase
        .from("workflow_runs")
        .update({ status: finalStatus, step_index: steps.length })
        .eq("id", run.id)
        .select()
        .single()

      executedRuns.push(finalRun)
    }

    return NextResponse.json({ success: true, runs: executedRuns.length })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Run execution failed" },
      { status: 500 }
    )
  }
}
