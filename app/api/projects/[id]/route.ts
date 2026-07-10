import { NextResponse } from "next/server"
import { getUserOrThrow } from "@/lib/auth-server"
import { ProjectSchema } from "@/lib/validate"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { supabase } = await getUserOrThrow()
    const { data, error } = await supabase
      .from("projects")
      .select("*, client:clients(), tasks:tasks(), time_logs:time_logs()")
      .eq("id", id)
      .single()
    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { supabase } = await getUserOrThrow()
    const body = await req.json()
    const parsed = ProjectSchema.partial().safeParse(body)
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid" }, { status: 400 })

    const patch = {
      ...parsed.data,
      deadline: parsed.data.deadline
        ? new Date(parsed.data.deadline).toISOString()
        : undefined,
    }
    const { data, error } = await supabase
      .from("projects")
      .update(patch)
      .eq("id", id)
      .select()
      .single()
    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { supabase } = await getUserOrThrow()
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
