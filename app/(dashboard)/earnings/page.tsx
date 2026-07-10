"use client"

import { useState, useEffect } from "react"
import { DollarSign, FileText, PiggyBank, Briefcase, TrendingUp, Sparkles, AlertCircle } from "lucide-react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts"
import { formatCurrency } from "@/lib/utils"

const initialFinancialData = [
  { month: "Jan", revenue: 2400, expenses: 400, tax: 600 },
  { month: "Feb", revenue: 3200, expenses: 450, tax: 800 },
  { month: "Mar", revenue: 4500, expenses: 500, tax: 1125 },
  { month: "Apr", revenue: 5600, expenses: 600, tax: 1400 },
  { month: "May", revenue: 7100, expenses: 800, tax: 1775 },
  { month: "Jun", revenue: 8450, expenses: 850, tax: 2112 }
]

export default function EarningsPage() {
  const [data, setData] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setData(initialFinancialData)
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="py-12 text-center text-gray-500">
        Loading financial models...
      </div>
    )
  }

  // Financial Metrics
  const currentMonthRevenue = 8450
  const taxEstimation = Math.round(currentMonthRevenue * 0.25) // 25% USA Self Employment / Income tax
  const businessExpenses = 850
  const netEarnings = currentMonthRevenue - taxEstimation - businessExpenses

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Earnings & Financial Console</h1>
        <p className="text-gray-500 mt-1">Track payouts, evaluate business expenses, and plan USA quarterly tax estimates.</p>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Gross Income</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(currentMonthRevenue)}</p>
            <span className="text-[10px] text-green-600 font-bold">+18% vs last month</span>
          </div>
          <div className="bg-blue-50 p-2.5 rounded-xl">
            <DollarSign className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">USA Tax Reserve</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(taxEstimation)}</p>
            <span className="text-[10px] text-gray-400 font-medium">Estimated 25% bracket</span>
          </div>
          <div className="bg-orange-50 p-2.5 rounded-xl">
            <PiggyBank className="h-5 w-5 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Expenses</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(businessExpenses)}</p>
            <span className="text-[10px] text-gray-400 font-medium">Software, hosting, office</span>
          </div>
          <div className="bg-red-50 p-2.5 rounded-xl">
            <FileText className="h-5 w-5 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Net Take-Home</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(netEarnings)}</p>
            <span className="text-[10px] text-green-600 font-bold">65% Profit Margin</span>
          </div>
          <div className="bg-green-50 p-2.5 rounded-xl">
            <Briefcase className="h-5 w-5 text-green-600" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Income Growth</h3>
              <p className="text-xs text-gray-400">Monthly billing revenue logs</p>
            </div>
            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded font-bold">
              <TrendingUp className="h-3.5 w-3.5" />
              Upward Trend
            </span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tax Reserve Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">USA Tax Safeguard</h3>
            <p className="text-xs text-gray-400">Projected quarterly tax liabilities</p>

            <div className="mt-6 bg-orange-50 border border-orange-100 p-4 rounded-xl space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-orange-950 leading-relaxed">
                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-orange-900">Self-Employment Taxes</span>
                  USA freelancers pay self-employment tax (15.3%) plus federal/state income tax. Keeping 25-30% in reserve is highly recommended.
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Estimated Q1 Liability:</span>
                <span className="font-bold text-gray-900">$2,450</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Estimated Q2 Liability:</span>
                <span className="font-bold text-gray-900">$3,100</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-50">
                <span className="text-gray-900 font-bold">Total Saved Reserve:</span>
                <span className="font-bold text-orange-600">$5,550</span>
              </div>
            </div>
          </div>

          <button className="w-full mt-6 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold py-2.5 rounded-lg border border-gray-200 transition-colors flex items-center justify-center gap-1 cursor-pointer">
            <Sparkles className="h-4 w-4 text-orange-600" />
            Optimize with AI Tax Planner
          </button>
        </div>
      </div>
    </div>
  )
}
