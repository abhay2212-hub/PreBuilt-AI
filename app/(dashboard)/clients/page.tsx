"use client"

import { useState, useEffect } from "react"
import { Plus, Users, ShieldAlert, Sparkles, MessageSquare, DollarSign, Activity, CheckCircle } from "lucide-react"
import ClientCard from "@/components/clients/ClientCard"
import Modal from "@/components/ui/Modal"
import Badge from "@/components/ui/Badge"
import { Client } from "@/types"
import { formatCurrency } from "@/lib/utils"

const initialClients: Client[] = [
  {
    id: "cli-1",
    name: "Alex Rivera",
    email: "alex@techcorp.com",
    company: "TechCorp Inc",
    totalRevenue: 12500,
    healthScore: 95,
    paymentScore: 90,
    tags: ["Enterprise", "Tech Stack"],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
  },
  {
    id: "cli-2",
    name: "Jessica Smith",
    email: "jessica@startupxyz.com",
    company: "StartupXYZ",
    totalRevenue: 2400,
    healthScore: 78,
    paymentScore: 85,
    tags: ["Branding", "Creative"],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  },
  {
    id: "cli-3",
    name: "Marcus Vance",
    email: "marcus@appcollc.co",
    company: "AppCo LLC",
    totalRevenue: 5000,
    healthScore: 45,
    paymentScore: 60,
    tags: ["Mobile", "Delayed Pay"],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  }
]

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isScopeCreepOpen, setIsScopeCreepOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  // Form State
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [tagsInput, setTagsInput] = useState("")
  const [healthScore, setHealthScore] = useState("90")
  const [paymentScore, setPaymentScore] = useState("90")

  // Scope Creep Analyzer States
  const [originalScope, setOriginalScope] = useState("")
  const [clientMessage, setClientMessage] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("freelancer_os_clients")
    if (saved) {
      try {
        setClients(JSON.parse(saved).map((c: any) => ({ ...c, createdAt: new Date(c.createdAt) })))
      } catch {
        setClients(initialClients)
      }
    } else {
      setClients(initialClients)
    }
  }, [])

  const saveClients = (newCli: Client[]) => {
    setClients(newCli)
    localStorage.setItem("freelancer_os_clients", JSON.stringify(newCli))
  }

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return

    const newClient: Client = {
      id: `cli-${Date.now()}`,
      name,
      email,
      company: company || undefined,
      totalRevenue: 0,
      healthScore: parseInt(healthScore),
      paymentScore: parseInt(paymentScore),
      tags: tagsInput ? tagsInput.split(",").map(t => t.trim()) : ["New Client"],
      createdAt: new Date()
    }

    const updated = [newClient, ...clients]
    saveClients(updated)
    setIsAddOpen(false)

    // Clear Form
    setName("")
    setEmail("")
    setCompany("")
    setTagsInput("")
  }

  const triggerScopeCreepAnalysis = (client: Client) => {
    setSelectedClient(client)
    setOriginalScope("")
    setClientMessage("")
    setAnalysisResult(null)
    setIsScopeCreepOpen(true)
  }

  const analyzeScopeCreep = async () => {
    if (!originalScope || !clientMessage) return
    setIsAnalyzing(true)
    setAnalysisResult(null)
    try {
      const res = await fetch("/api/ai/scope-creep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalScope, clientMessage })
      })
      const data = await res.json()
      setAnalysisResult(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const totalClients = clients.length
  const avgHealth = totalClients > 0 ? Math.round(clients.reduce((acc, c) => acc + c.healthScore, 0) / totalClients) : 0
  const avgPayment = totalClients > 0 ? Math.round(clients.reduce((acc, c) => acc + c.paymentScore, 0) / totalClients) : 0
  const totalRevenue = clients.reduce((acc, c) => acc + c.totalRevenue, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM & Scope Creep Protection</h1>
          <p className="text-gray-500 mt-1">Manage client records, check health ratings, and analyze conversation scope updates with AI.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Client
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Clients</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalClients}</p>
          </div>
          <div className="bg-blue-50 p-2.5 rounded-xl">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total CRM Value</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="bg-green-50 p-2.5 rounded-xl">
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Avg Health Rating</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{avgHealth}/100</p>
          </div>
          <div className="bg-purple-50 p-2.5 rounded-xl">
            <Activity className="h-5 w-5 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Avg Pay Score</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{avgPayment}/100</p>
          </div>
          <div className="bg-orange-50 p-2.5 rounded-xl">
            <CheckCircle className="h-5 w-5 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((cli) => (
          <ClientCard key={cli.id} client={cli} onSelectClient={triggerScopeCreepAnalysis} />
        ))}
      </div>

      {/* Modal: Add Client */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Log New Client Details">
        <form onSubmit={handleAddClient} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Sarah Jenkins"
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
              placeholder="e.g. sarah@company.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Company / Team Name</label>
            <input
              type="text"
              placeholder="e.g. Stripe Design Labs"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Tags (Comma Separated)</label>
            <input
              type="text"
              placeholder="e.g. Enterprise, WebDev, Design"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Health Score (1-100)</label>
              <input
                type="number"
                min="1"
                max="100"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={healthScore}
                onChange={(e) => setHealthScore(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Payment Rating (1-100)</label>
              <input
                type="number"
                min="1"
                max="100"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={paymentScore}
                onChange={(e) => setPaymentScore(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm mt-2 transition-colors cursor-pointer"
          >
            Save Client
          </button>
        </form>
      </Modal>

      {/* Modal: AI Scope Creep Protection */}
      <Modal isOpen={isScopeCreepOpen} onClose={() => setIsScopeCreepOpen(false)} title="AI Scope Creep Safeguard">
        {selectedClient && (
          <div className="space-y-4">
            <div className="p-3 bg-purple-50 rounded-lg text-xs border border-purple-150 flex items-center gap-2 text-purple-950">
              <ShieldAlert className="h-4 w-4 text-purple-600 flex-shrink-0" />
              <span>Analyzing updates from client: <strong>{selectedClient.name}</strong></span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Original Scope of Work</label>
              <textarea
                rows={2}
                placeholder="Describe what was in the contract scope... (e.g. Build 5-page static site in Next.js)"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none"
                value={originalScope}
                onChange={(e) => setOriginalScope(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Client Message / New Request</label>
              <textarea
                rows={3}
                placeholder="Paste the email or message here... (e.g. Can you add a payment form and database?)"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none"
                value={clientMessage}
                onChange={(e) => setClientMessage(e.target.value)}
              />
            </div>

            {analysisResult ? (
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-gray-500">Analysis Verdict:</span>
                  <Badge variant={analysisResult.isScopeCreep ? "danger" : "success"}>
                    {analysisResult.isScopeCreep ? "SCOPE CREEP DETECTED" : "WITHIN SCOPE"}
                  </Badge>
                </div>
                
                {analysisResult.isScopeCreep && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-50 p-2.5 rounded-lg border border-red-100">
                        <span className="text-red-700 font-bold block">Additional Cost:</span>
                        <span className="text-red-950 font-semibold">{analysisResult.additionalCost || "$150-250"}</span>
                      </div>
                      <div className="bg-red-50 p-2.5 rounded-lg border border-red-100">
                        <span className="text-red-700 font-bold block">Extra Hours Required:</span>
                        <span className="text-red-950 font-semibold">{analysisResult.extraHours || "3-4 hours"}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <span className="text-gray-700 font-bold block uppercase tracking-wider text-[10px] mb-1">Suggested Client Response:</span>
                      <p className="text-gray-900 leading-relaxed italic bg-white p-2.5 rounded border border-gray-100 select-all">
                        {analysisResult.suggestedResponse}
                      </p>
                    </div>
                  </div>
                )}
                
                {!analysisResult.isScopeCreep && (
                  <p className="text-xs text-green-700 bg-green-50 p-3 rounded-lg leading-relaxed">
                    This request appears to be within the initial scope. You can proceed with development safely!
                  </p>
                )}
              </div>
            ) : (
              <div className="py-2 text-center">
                {isAnalyzing ? (
                  <div className="space-y-2">
                    <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-purple-600 mx-auto" />
                    <p className="text-xs text-gray-500 font-medium">Checking message against original scope limits...</p>
                  </div>
                ) : (
                  <button
                    onClick={analyzeScopeCreep}
                    disabled={!originalScope || !clientMessage}
                    className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-sm cursor-pointer"
                  >
                    <Sparkles className="h-4.5 w-4.5" />
                    Check with AI Guard
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
