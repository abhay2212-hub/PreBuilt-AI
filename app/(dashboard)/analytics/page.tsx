"use client"

import { useState, useEffect } from "react"
import { TrendingUp, BarChart2, Sparkles, Award } from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const initialWorkloadData = [
  { day: "Mon", logged: 4, limit: 8 },
  { day: "Tue", logged: 7.5, limit: 8 },
  { day: "Wed", logged: 6, limit: 8 },
  { day: "Thu", logged: 9, limit: 8 },
  { day: "Fri", logged: 5.5, limit: 8 },
]

const initialPlatformShare = [
  { name: "Upwork", value: 45, color: "#10b981" },
  { name: "Fiverr", value: 30, color: "#2563eb" },
  { name: "Toptal", value: 15, color: "#8b5cf6" },
  { name: "Direct", value: 10, color: "#f97316" },
]

export default function AnalyticsPage() {
  const [workload, setWorkload] = useState<any[]>([])
  const [platformShare, setPlatformShare] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setWorkload(initialWorkloadData)
    setPlatformShare(initialPlatformShare)
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="py-12 text-center text-gray-500">
        Loading workload engines...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Workload</h1>
        <p className="text-gray-500 mt-1">
          Monitor your platform distribution share, weekly hours workload caps, and key performance ratios.
        </p>
      </div>

      {/* Ratios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">
            Hourly Yield Average
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <strong className="text-2xl font-bold text-gray-900">$59.50</strong>
            <span className="text-xs text-gray-500">/hr effective</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">
            Client Retention Ratio
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <strong className="text-2xl font-bold text-gray-900">83.3%</strong>
            <span className="text-xs text-gray-500">repeat work</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">
            Project On-Time Rate
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <strong className="text-2xl font-bold text-green-600">92.5%</strong>
            <span className="text-xs text-gray-500">milestone delivery</span>
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workload */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Workload Allocation</h3>
            <p className="text-xs text-gray-400 mb-6">Track daily logged hours against standard 8h/day targets</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workload}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Tooltip formatter={(value) => [`${value} hrs`, "Duration"]} />
                <Legend />
                <Bar dataKey="logged" name="Logged Hours" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="limit" name="Maximum Target" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Share */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Marketplace Funnels</h3>
            <p className="text-xs text-gray-400 mb-4">Volume distribution by platforms</p>

            <div className="h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformShare}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {platformShare.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Volume Share"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-4 border-t border-gray-50">
              {platformShare.map((p) => (
                <div key={p.name} className="flex items-center gap-1.5 text-gray-600">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span>{p.name}: <strong>{p.value}%</strong></span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
            <Sparkles className="h-4 w-4" />
            Recalculate Funnel Analytics
          </button>
        </div>
      </div>
    </div>
  )
}
