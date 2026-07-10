import { NextResponse } from "next/server"
import { getUserOrThrow } from "@/lib/auth-server"
import { TimeLogSchema } from "@/lib/validate"

export async function GET() {
  try {
    const { supabase } = await getUserOrThrow()
    const { data, error } = await supabase
      .from("time_logs")
      .select("*, project:projects(title), task:tasks(title)")
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
    const parsed = TimeLogSchema.safeParse(await req.json())
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid" }, { status: 400 })

    const d = parsed.data
    const duration =
      d.duration_min ??
      (d.end_time
        ? Math.max(
            0,
            Math.floor(
              (Number(new Date(d.end_time)) - Number(new Date(d.start_time))) /
                60000
            )
          )
        : null)

    const payload = {
      user_id: user.id,
      project_id: d.project_id,
      task_id: d.task_id ?? null,
      description: d.description ?? null,
      start_time: new Date(d.start_time).toISOString(),
      end_time: d.end_time ? new Date(d.end_time).toISOString() : null,
      duration_min: duration,
      billable: d.billable ?? true,
      hourly_rate: d.hourly_rate ?? null,
    }
    const { data, error } = await supabase
      .from("time_logs")
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
