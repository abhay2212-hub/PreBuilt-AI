import { Bid } from "@/types"
import Badge from "@/components/ui/Badge"
import { Calendar, DollarSign, Globe, ExternalLink } from "lucide-react"
import { formatDate, formatCurrency } from "@/lib/utils"

interface BidCardProps {
  bid: Bid
  onGenerateProposal?: (bid: Bid) => void
}

export default function BidCard({ bid, onGenerateProposal }: BidCardProps) {
  const statusVariants: Record<
    string,
    "success" | "warning" | "danger" | "info" | "neutral" | "purple"
  > = {
    DRAFT: "neutral",
    SUBMITTED: "info",
    VIEWED: "purple",
    SHORTLISTED: "warning",
    WON: "success",
    LOST: "danger",
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 text-lg leading-snug">
            {bid.jobTitle}
          </h4>
          <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <Globe className="h-3 w-3" />
            {bid.platform} {bid.clientName && `· ${bid.clientName}`}
          </span>
        </div>
        <Badge variant={statusVariants[bid.status] || "neutral"}>
          {bid.status}
        </Badge>
      </div>

      <p className="text-sm text-gray-600 line-clamp-3 mb-4 h-15">
        {bid.jobDescription}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex items-center gap-1 font-bold text-gray-900">
          <DollarSign className="h-3.5 w-3.5 text-gray-400" />
          <span>{formatCurrency(bid.bidAmount)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400">
          <Calendar className="h-3.5 w-3.5" />
          <span>Submitted {formatDate(bid.submittedAt)}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {bid.jobUrl && (
          <a
            href={bid.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 border border-gray-200 hover:bg-gray-50 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Job Link <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {onGenerateProposal && (
          <button
            onClick={() => onGenerateProposal(bid)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer"
          >
            AI Bid Proposal
          </button>
        )}
      </div>
    </div>
  )
}
