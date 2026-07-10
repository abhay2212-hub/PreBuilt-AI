"use client"

import { useState, useEffect } from "react"
import { Settings, User, Key, CheckCircle, Save, Sparkles } from "lucide-react"

export default function SettingsPage() {
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john@doe.com")
  const [title, setTitle] = useState("Senior Fullstack Developer")
  const [rate, setRate] = useState("65")
  const [groqKey, setGroqKey] = useState("")
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const savedName = localStorage.getItem("freelancer_os_settings_name")
    const savedEmail = localStorage.getItem("freelancer_os_settings_email")
    const savedTitle = localStorage.getItem("freelancer_os_settings_title")
    const savedRate = localStorage.getItem("freelancer_os_settings_rate")
    const savedKey = localStorage.getItem("freelancer_os_settings_groq_key")

    if (savedName) setName(savedName)
    if (savedEmail) setEmail(savedEmail)
    if (savedTitle) setTitle(savedTitle)
    if (savedRate) setRate(savedRate)
    if (savedKey) setGroqKey(savedKey)
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    
    localStorage.setItem("freelancer_os_settings_name", name)
    localStorage.setItem("freelancer_os_settings_email", email)
    localStorage.setItem("freelancer_os_settings_title", title)
    localStorage.setItem("freelancer_os_settings_rate", rate)
    localStorage.setItem("freelancer_os_settings_groq_key", groqKey)

    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Workspace Settings</h1>
        <p className="text-gray-500 mt-1">Configure profile details, base pricing rates, and connect custom AI API integrations.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2 text-blue-700">
            <User className="h-5 w-5" />
            <h3 className="font-bold text-gray-900">Freelancer Profile</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Professional Title</label>
              <input
                type="text"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Target Rate ($/hr)</label>
              <input
                type="number"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* AI Key Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2 text-purple-700">
            <Key className="h-5 w-5" />
            <h3 className="font-bold text-gray-900">API Credentials</h3>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Groq AI API Key</label>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-purple-600 font-bold hover:underline"
              >
                Get Free API Key
              </a>
            </div>
            <input
              type="password"
              placeholder="gsk_..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500"
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
            />
            <p className="text-[10px] text-gray-400 mt-1 leading-normal">
              Entering your custom Groq API key overrides the server defaults, ensuring fast, rate-limit-free model operations.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          {isSaved ? (
            <div className="flex items-center gap-1.5 text-green-600 font-semibold text-sm">
              <CheckCircle className="h-4 w-4" />
              Settings updated successfully!
            </div>
          ) : (
            <div className="text-xs text-gray-450 font-medium">Click save to apply workspace values.</div>
          )}

          <button
            type="submit"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
          >
            <Save className="h-4.5 w-4.5" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
