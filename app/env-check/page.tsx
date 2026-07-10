"use client"

import { Suspense } from "react"

function EnvCheckContent() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const keyPrefix = key ? `${key.slice(0, 10)}...` : "not set"

  return (
    <pre className="p-6 text-xs bg-gray-900 text-green-400 font-mono rounded-xl max-w-md shadow-lg border border-gray-800">
      {JSON.stringify(
        {
          url,
          keyPrefix,
          isPlaceholder: key === "YOUR_PUBLIC_ANON_KEY" || !key,
        },
        null,
        2
      )}
    </pre>
  )
}

export default function EnvCheck() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-6">
      <Suspense fallback={<p className="text-gray-400 text-sm">Loading...</p>}>
        <EnvCheckContent />
      </Suspense>
    </div>
  )
}
