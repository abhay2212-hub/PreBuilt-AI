import { Client } from "@/types"
import Badge from "@/components/ui/Badge"
import { Mail, DollarSign } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface ClientCardProps {
  client: Client
  onSelectClient?: (client: Client) => void
}

export default function ClientCard({
  client,
  onSelectClient,
}: ClientCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50"
    if (score >= 50) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 text-lg">{client.name}</h4>
          {client.company && (
            <p className="text-xs text-gray-400 mt-0.5">{client.company}</p>
          )}
        </div>
        <div className="flex gap-1.5 flex-wrap max-w-[50%] justify-end">
          {client.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="neutral">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2 mb-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-gray-400" />
          <span className="truncate">{client.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-3.5 w-3.5 text-gray-400" />
          <span>
            Revenue:{" "}
            <strong className="text-gray-950">
              {formatCurrency(client.totalRevenue)}
            </strong>
          </span>
        </div>
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 text-center">
        <div className="p-2 rounded-lg bg-gray-50">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
            Health Score
          </p>
          <span
            className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${getScoreColor(
              client.healthScore
            )}`}
          >
            {client.healthScore}/100
          </span>
        </div>
        <div className="p-2 rounded-lg bg-gray-50">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
            Pay History
          </p>
          <span
            className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${getScoreColor(
              client.paymentScore
            )}`}
          >
            {client.paymentScore}/100
          </span>
        </div>
      </div>

      {onSelectClient && (
        <button
          onClick={() => onSelectClient(client)}
          className="w-full mt-4 text-xs font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Analyze Scope Creep
        </button>
      )}
    </div>
  )
}
