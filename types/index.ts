export type ProjectStatus =
  | "LEAD"
  | "PROPOSAL"
  | "ACTIVE"
  | "REVIEW"
  | "COMPLETED"
  | "PAUSED"
  | "CANCELLED"

export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "REVIEW"
  | "COMPLETED"

export type Priority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT"

export type InvoiceStatus =
  | "DRAFT"
  | "SENT"
  | "VIEWED"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED"

export type BidStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "VIEWED"
  | "SHORTLISTED"
  | "WON"
  | "LOST"

export type Platform =
  | "Upwork"
  | "Fiverr"
  | "Freelancer"
  | "Toptal"
  | "PeoplePerHour"
  | "LinkedIn"
  | "Direct"
  | "Other"

export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  website?: string
  location?: string
  totalRevenue: number
  healthScore: number
  paymentScore: number
  tags: string[]
  notes?: string
  createdAt: Date
}

export interface Project {
  id: string
  title: string
  description?: string
  status: ProjectStatus
  priority: Priority
  deadline?: Date
  budget?: number
  hourlyRate?: number
  client?: Client
  progress: number
  hoursLogged?: number
  createdAt: Date
}

export interface Bid {
  id: string
  jobTitle: string
  platform: Platform
  clientName?: string
  jobDescription: string
  bidAmount: number
  status: BidStatus
  submittedAt: Date
  followUpDate?: Date
  notes?: string
  proposalText?: string
  jobUrl?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  dueDate?: Date
  estimatedHrs?: number
  actualHrs?: number
  projectId: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  status: InvoiceStatus
  client: Client
  total: number
  dueDate: Date
  issueDate: Date
  currency: string
  items: InvoiceItem[]
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface TimeLog {
  id: string
  projectId: string
  projectName: string
  description?: string
  startTime: Date
  endTime?: Date
  duration?: number
  billable: boolean
  hourlyRate?: number
}

export interface NicheKit {
  id: string
  name: string
  category: string
  icon: string
  description: string
  avgRate: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  timeToFirstClient: string
}
