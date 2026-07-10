import {
  DollarSign,
  FolderKanban,
  Clock,
  Target,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  Calendar,
  Zap,
  CheckCircle,
} from "lucide-react"

const stats = [
  {
    title: "Total Earnings",
    value: "$8,450",
    change: "+23% this month",
    type: "positive",
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    title: "Active Projects",
    value: "6",
    change: "2 due this week",
    type: "warning",
    icon: FolderKanban,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Bids Submitted",
    value: "24",
    change: "8 win rate this month",
    type: "positive",
    icon: Target,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    title: "Hours Tracked",
    value: "142h",
    change: "$59/hr effective rate",
    type: "positive",
    icon: Clock,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
]

const projects = [
  {
    name: "E-commerce Website",
    client: "TechCorp Inc",
    progress: 75,
    daysLeft: 3,
    status: "On Track",
    statusColor: "text-green-600 bg-green-50",
    budget: "$3,500",
  },
  {
    name: "Logo Design Package",
    client: "StartupXYZ",
    progress: 40,
    daysLeft: 7,
    status: "On Track",
    statusColor: "text-green-600 bg-green-50",
    budget: "$800",
  },
  {
    name: "Mobile App UI",
    client: "AppCo LLC",
    progress: 20,
    daysLeft: 14,
    status: "At Risk",
    statusColor: "text-orange-600 bg-orange-50",
    budget: "$5,000",
  },
  {
    name: "SEO Campaign",
    client: "GrowthBiz",
    progress: 90,
    daysLeft: 1,
    status: "Urgent",
    statusColor: "text-red-600 bg-red-50",
    budget: "$1,200",
  },
]

const recentBids = [
  { job: "React Developer Needed", platform: "Upwork", amount: "$45/hr", status: "SHORTLISTED", statusColor: "text-yellow-700 bg-yellow-50" },
  { job: "WordPress Website Build", platform: "Fiverr", amount: "$650", status: "WON", statusColor: "text-green-700 bg-green-50" },
  { job: "Social Media Manager", platform: "LinkedIn", amount: "$35/hr", status: "SUBMITTED", statusColor: "text-blue-700 bg-blue-50" },
]

const invoices = [
  { client: "TechCorp Inc", amount: "$3,500", due: "Due in 2 days", status: "urgent" },
  { client: "StartupXYZ", amount: "$800", due: "Due in 7 days", status: "normal" },
  { client: "AppCo LLC", amount: "$2,500", due: "Overdue 2 days", status: "overdue" },
]

const aiInsights = [
  "Your win rate is 33% — above average for USA freelancers",
  "Best time to submit bids: Tuesday-Thursday morning",
  "E-commerce projects give you highest hourly rate",
  "Follow up on 3 bids that were viewed but not responded",
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good morning, John! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Your freelance business at a glance
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 px-3 py-2 rounded-lg">
          <Calendar className="h-4 w-4" />
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-xs mt-1 flex items-center gap-1 ${stat.type === "positive" ? "text-green-600" : "text-orange-500"}`}>
                  {stat.type === "positive" && <TrendingUp className="h-3 w-3" />}
                  {stat.change}
                </p>
              </div>
              <div className={`${stat.bg} p-2.5 rounded-xl`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Projects */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Active Projects
            </h2>
            <button className="text-sm text-blue-600 flex items-center gap-1 hover:text-blue-700 cursor-pointer">
              View all <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-3">
            {projects.map((p) => (
              <div
                key={p.name}
                className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {p.name}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.statusColor}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-900">
                      {p.budget}
                    </span>
                    <span className="text-xs text-gray-400">
                      {p.daysLeft}d left
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        p.progress === 100 ? "bg-green-500" :
                        p.progress >= 70 ? "bg-blue-500" :
                        p.progress >= 40 ? "bg-yellow-500" : "bg-red-400"
                      }`}
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8">{p.progress}%</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{p.client}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4" />
              <h2 className="text-sm font-semibold">AI Insights</h2>
            </div>
            <div className="space-y-2">
              {aiInsights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-blue-200 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-100 leading-relaxed">
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bids */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">
                Recent Bids
              </h2>
              <button className="text-xs text-blue-600 cursor-pointer">View all</button>
            </div>
            <div className="space-y-3">
              {recentBids.map((bid) => (
                <div key={bid.job} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {bid.job}
                    </p>
                    <p className="text-xs text-gray-400">{bid.platform}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <span className="text-xs font-bold text-gray-900">
                      {bid.amount}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${bid.statusColor}`}>
                      {bid.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoices */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">
                Invoices Due
              </h2>
              <button className="text-xs text-blue-600 cursor-pointer">View all</button>
            </div>
            <div className="space-y-2">
              {invoices.map((inv) => (
                <div
                  key={inv.client}
                  className={`flex items-center justify-between p-2.5 rounded-lg ${
                    inv.status === "overdue" ? "bg-red-50" :
                    inv.status === "urgent" ? "bg-orange-50" : "bg-gray-50"
                  }`}
                >
                  <div>
                    <p className="text-xs font-medium text-gray-900">
                      {inv.client}
                    </p>
                    <p className={`text-xs ${
                      inv.status === "overdue" ? "text-red-500" :
                      inv.status === "urgent" ? "text-orange-500" : "text-gray-400"
                    }`}>
                      {inv.status === "overdue" && (
                        <AlertCircle className="h-3 w-3 inline mr-1" />
                      )}
                      {inv.due}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-gray-900">
                    {inv.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
