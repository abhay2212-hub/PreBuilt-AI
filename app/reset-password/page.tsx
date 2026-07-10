"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientBrowser } from "@/lib/supabase"

export default function ResetPasswordPage() {
  const supabase = createClientBrowser()
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  const update = async () => {
    setError(null)
    setMsg(null)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setError(error.message)
    else {
      setMsg("Password updated. Redirecting…")
      setTimeout(() => router.replace("/dashboard"), 1000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6">
        <h1 className="text-xl font-bold mb-2">Set a new password</h1>
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        {msg && <p className="text-sm text-green-600 mb-2">{msg}</p>}
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 mb-4"
        />
        <button
          onClick={update}
          disabled={!password}
          className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60 cursor-pointer"
        >
          Update password
        </button>
      </div>
    </div>
  )
}
