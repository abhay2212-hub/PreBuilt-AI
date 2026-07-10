"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  FileText,
  Clock,
  Target,
  Brain,
  BookOpen,
  DollarSign,
  Settings,
  ArrowLeftRight,
  ChevronRight,
  TrendingUp,
  Video,
  GitBranch,
} from "lucide-react"

const navigation = [
  {
    group: "MAIN",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Projects", href: "/projects", icon: FolderKanban },
      { name: "Clients", href: "/clients", icon: Users },
    ],
  },
  {
    group: "FREELANCING",
    items: [
      { name: "Bid Tracker", href: "/bids", icon: Target },
      { name: "Time Tracking", href: "/time-tracking", icon: Clock },
      { name: "Invoices", href: "/invoices", icon: FileText },
      { name: "Workflows", href: "/workflows", icon: GitBranch },
      { name: "Earnings", href: "/earnings", icon: DollarSign },
    ],
  },
  {
    group: "AI TOOLS",
    items: [
      { name: "AI Tools", href: "/ai-tools", icon: Brain },
      { name: "Meeting Copilot", href: "/meetings", icon: Video },
      { name: "Niche Kits", href: "/niche-kits", icon: BookOpen },
      { name: "Analytics", href: "/analytics", icon: TrendingUp },
    ],
  },
  {
    group: "ACCOUNT",
    items: [
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">

      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <ArrowLeftRight className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900">
              FreelancerOS
            </span>
            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded ml-1">
              USA
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto space-y-4">
        {navigation.map((group) => (
          <div key={group.group}>
            <p className="text-xs font-semibold text-gray-400 px-3 mb-2">
              {group.group}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={`h-4 w-4 ${
                          isActive ? "text-blue-600" : "text-gray-400"
                        }`}
                      />
                      {item.name}
                    </div>
                    {isActive && (
                      <ChevronRight className="h-3 w-3 text-blue-600" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Upgrade Banner */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-4 mb-4 text-white">
          <p className="text-xs font-bold mb-1">🚀 Upgrade to Pro</p>
          <p className="text-xs opacity-80 mb-3">
            Unlock unlimited AI proposals and more
          </p>
          <button className="w-full bg-white text-blue-600 text-xs font-bold py-2 rounded-lg hover:bg-blue-50 cursor-pointer">
            Upgrade — $49/mo
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              John Doe
            </p>
            <p className="text-xs text-gray-400">Free Plan</p>
          </div>
        </div>
      </div>

    </div>
  )
}
