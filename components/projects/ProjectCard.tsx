import { Project } from "@/types"
import Badge from "@/components/ui/Badge"
import { Calendar, DollarSign, Clock, ArrowRight } from "lucide-react"
import { calculateDaysLeft, getDeadlineColor, formatCurrency } from "@/lib/utils"

interface ProjectCardProps {
  project: Project
  onViewDetails?: (project: Project) => void
}

export default function ProjectCard({
  project,
  onViewDetails,
}: ProjectCardProps) {
  const daysLeft = project.deadline ? calculateDaysLeft(project.deadline) : 0
  const deadlineColor = project.deadline ? getDeadlineColor(daysLeft) : ""

  const statusVariants: Record<
    string,
    "success" | "warning" | "danger" | "info" | "neutral" | "purple"
  > = {
    LEAD: "neutral",
    PROPOSAL: "purple",
    ACTIVE: "info",
    REVIEW: "warning",
    COMPLETED: "success",
    PAUSED: "neutral",
    CANCELLED: "danger",
  }

  const priorityVariants: Record<
    string,
    "neutral" | "info" | "warning" | "danger"
  > = {
    LOW: "neutral",
    MEDIUM: "info",
    HIGH: "warning",
    URGENT: "danger",
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 text-lg">
            {project.title}
          </h4>
          <p className="text-xs text-gray-400 mt-0.5">
            {project.client?.name || "Independent Project"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Badge variant={statusVariants[project.status] || "neutral"}>
            {project.status}
          </Badge>
          <Badge variant={priorityVariants[project.priority] || "neutral"}>
            {project.priority}
          </Badge>
        </div>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
        {project.description || "No description provided."}
      </p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span className="font-semibold">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          {project.budget && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5 text-gray-400" />
              <span className="font-semibold text-gray-700">
                {formatCurrency(project.budget)}
              </span>
            </div>
          )}
          {project.hoursLogged !== undefined && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              <span>{project.hoursLogged} hrs</span>
            </div>
          )}
        </div>
        {project.deadline ? (
          <span className={`px-2 py-0.5 rounded font-medium ${deadlineColor}`}>
            {daysLeft < 0
              ? "Overdue"
              : daysLeft === 0
              ? "Due today"
              : `${daysLeft}d left`}
          </span>
        ) : (
          <span>No deadline</span>
        )}
      </div>

      {onViewDetails && (
        <button
          onClick={() => onViewDetails(project)}
          className="w-full mt-4 flex items-center justify-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Manage with AI <ArrowRight className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
