"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientBrowser } from "@/lib/supabase"
import Link from "next/link"

function LoginForm() {
  const supabase = createClientBrowser()
  const router = useRouter()
  const params = useSearchParams()

  const [tab, setTab] = useState<"password" | "magic">("password")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const redirectedFrom = params.get("redirectedFrom") || "/dashboard"

  useEffect(() => {
    // If already logged in, bounce to dashboard
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/dashboard")
    })
  }, [])

  const signInWithPassword = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else router.replace(redirectedFrom)
  }

  const sendMagicLink = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })
    setLoading(false)
    if (error) setError(error.message)
    else setMessage("Magic link sent! Check your email.")
  }

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
        Sign in to FreelancerOS
      </h1>
      <p className="text-center text-sm text-gray-500 mb-6">Welcome back!</p>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("password")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "password"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Email & Password
        </button>
        <button
          onClick={() => setTab("magic")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "magic"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Magic Link
        </button>
      </div>

      {message && <div className="mb-3 text-sm text-green-600">{message}</div>}
      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

      {/* Common email field */}
      <div className="mb-3">
        <label className="block text-sm text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </div>

      {tab === "password" && (
        <>
          <div className="mb-2">
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div className="text-right mb-4">
            <Link
              className="text-xs text-blue-600 hover:underline"
              href="/reset-password"
            >
              Forgot password?
            </Link>
          </div>
          <button
            disabled={loading || !email || !password}
            onClick={signInWithPassword}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </>
      )}

      {tab === "magic" && (
        <>
          <p className="text-xs text-gray-500 mb-3">
            We’ll email you a sign‑in link. No password required.
          </p>
          <button
            disabled={loading || !email}
            onClick={sendMagicLink}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Sending…" : "Send Magic Link"}
          </button>
        </>
      )}

      <p className="text-center text-sm text-gray-500 mt-6">
        Don’t have an account?{" "}
        <Link className="text-blue-600 hover:underline" href="/register">
          Sign up free
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Suspense fallback={<p className="text-gray-500 text-sm">Loading...</p>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
