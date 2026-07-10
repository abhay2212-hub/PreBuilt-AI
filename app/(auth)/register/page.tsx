"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientBrowser } from "@/lib/supabase"
import Link from "next/link"

export default function RegisterPage() {
  const supabase = createClientBrowser()
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const signUp = async () => {
    setLoading(true)
    setError(null)
    setMsg(null)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        data: { full_name: fullName },
      },
    })
    setLoading(false)
    if (error) setError(error.message)
    else {
      setMsg("Check your email to confirm your account.")
      // If email confirmations are OFF, user is already signed in:
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) router.replace("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Create your account
        </h1>
        {msg && <div className="mb-3 text-sm text-green-600">{msg}</div>}
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

        <div className="mb-3">
          <label className="block text-sm text-gray-700 mb-1">Full name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-5">
          <label className="block text-sm text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={signUp}
          disabled={loading || !email || !password || !fullName}
          className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Creating…" : "Create Account"}
        </button>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link className="text-blue-600 hover:underline" href="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
