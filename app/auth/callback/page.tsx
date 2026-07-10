"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientBrowser } from "@/lib/supabase"

export default function AuthCallback() {
  const router = useRouter()
  const supabase = createClientBrowser()
  const [status, setStatus] = useState("Finalizing sign-in…")

  useEffect(() => {
    const run = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      )
      if (error) {
        setStatus(`Error: ${error.message}`)
        return
      }

      const url = new URL(window.location.href)
      const isRecovery = url.searchParams.get("type") === "recovery"

      if (isRecovery) {
        router.replace("/reset-password")
      } else {
        router.replace("/dashboard")
      }
    }
    run()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600 text-sm">{status}</p>
    </div>
  )
}
