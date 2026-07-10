import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  change: string
  icon: LucideIcon
  color: string
  bg: string
  trend?: "positive" | "negative" | "neutral"
}

export default function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  color,
  bg,
  trend = "positive",
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p
            className={`text-xs mt-1 flex items-center gap-1 ${
              trend === "positive"
                ? "text-green-600"
                : trend === "negative"
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {change}
          </p>
        </div>
        <div className={`${bg} p-2.5 rounded-xl`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>
    </div>
  )
}
