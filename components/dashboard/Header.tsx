"use client"

import { Bell, Search, Plus, Zap, LogOut } from "lucide-react"
import { createClientBrowser } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Header() {
  const supabase = createClientBrowser()
  const router = useRouter()

  async function signOut() {
    await supabase.auth.signOut()
    router.replace("/login")
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-80">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects, clients, bids..."
            className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full"
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* AI Badge */}
          <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-medium">
            <Zap className="h-3.5 w-3.5" />
            AI Active
          </div>

          {/* New Project */}
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer">
            <Plus className="h-4 w-4" />
            New Project
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Sign Out */}
          <button
            onClick={signOut}
            title="Sign Out"
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
