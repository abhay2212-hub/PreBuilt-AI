import { z } from "zod"

export const ClientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  website: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export const ProjectSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  client_id: z.string().uuid().optional(),
  status: z
    .enum([
      "LEAD",
      "PROPOSAL",
      "ACTIVE",
      "REVIEW",
      "COMPLETED",
      "PAUSED",
      "CANCELLED",
    ])
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  deadline: z.string().optional(),
  budget: z.coerce.number().optional(),
  hourly_rate: z.coerce.number().optional(),
})

export const BidSchema = z.object({
  platform: z.string().min(2),
  job_title: z.string().min(2),
  job_description: z.string().optional(),
  client_name: z.string().optional(),
  bid_amount: z.string().optional(),
  status: z
    .enum(["DRAFT", "SUBMITTED", "VIEWED", "SHORTLISTED", "WON", "LOST"])
    .optional(),
  submitted_at: z.string().optional(),
  follow_up_at: z.string().optional(),
  job_url: z.string().url().optional(),
  proposal_text: z.string().optional(),
})

export const TimeLogSchema = z.object({
  project_id: z.string().uuid(),
  task_id: z.string().uuid().optional(),
  description: z.string().optional(),
  start_time: z.string(),
  end_time: z.string().optional(),
  duration_min: z.coerce.number().optional(),
  billable: z.boolean().optional(),
  hourly_rate: z.coerce.number().optional(),
})

export const InvoiceSchema = z.object({
  client_id: z.string().uuid(),
  project_id: z.string().uuid().optional(),
  issue_date: z.string().optional(),
  due_date: z.string(),
  currency: z.string().default("USD"),
  notes: z.string().optional(),
  terms: z.string().optional(),
  items: z.array(
    z.object({
      description: z.string(),
      quantity: z.coerce.number().positive(),
      rate: z.coerce.number().nonnegative(),
    })
  ),
})

export const MeetingSchema = z.object({
  project_id: z.string().uuid().optional().nullable(),
  title: z.string().min(2),
  transcript: z.string().optional(),
  summary: z.string().optional(),
  audio_url: z.string().optional(),
})

export const WorkflowSchema = z.object({
  name: z.string().min(2),
  active: z.boolean().default(true),
  steps: z
    .array(
      z.object({
        position: z.number().int(),
        type: z.enum(["email", "wait", "update_row", "webhook", "slack"]),
        config: z.record(z.string(), z.any()).default({}),
      })
    )
    .optional(),
})
