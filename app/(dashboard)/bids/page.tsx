"use client"

import { useState, useEffect } from "react"
import { Plus, Target, CheckCircle, Clock, Percent, Sparkles, Send, Copy, FileText } from "lucide-react"
import Badge from "@/components/ui/Badge"
import Modal from "@/components/ui/Modal"
import BidCard from "@/components/bids/BidCard"
import { Bid, BidStatus, Platform } from "@/types"

const initialBids: Bid[] = [
  {
    id: "bid-1",
    jobTitle: "React Native Developer for Fitness App",
    platform: "Upwork",
    clientName: "FitLife LLC",
    jobDescription: "Looking for an expert mobile developer to build a subscription-based fitness tracking application. Must have experience with integration of Google Fit and Apple HealthKit APIs.",
    bidAmount: 4500,
    status: "SHORTLISTED",
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    notes: "Client sent a screening question; answered on Tuesday."
  },
  {
    id: "bid-2",
    jobTitle: "E-commerce Website Maintenance & Redesign",
    platform: "Fiverr",
    clientName: "EcoStore",
    jobDescription: "We need someone to refactor our Shopify custom storefront built in Next.js and optimize page load speed to under 1.5 seconds.",
    bidAmount: 1800,
    status: "WON",
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    notes: "Project successfully kicked off. Milestone 1 active."
  },
  {
    id: "bid-3",
    jobTitle: "SaaS Dashboard UX/UI Design",
    platform: "Toptal",
    clientName: "DataDash Inc",
    jobDescription: "Seeking a senior designer to create 15 key dashboard frames with responsive variants. High fidelity prototypes are required.",
    bidAmount: 75,
    status: "SUBMITTED",
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
]

export default function BidTrackerPage() {
  const [bids, setBids] = useState<Bid[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isAIProposalOpen, setIsAIProposalOpen] = useState(false)
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null)
  
  // Form State
  const [jobTitle, setJobTitle] = useState("")
  const [platform, setPlatform] = useState<Platform>("Upwork")
  const [clientName, setClientName] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [bidAmount, setBidAmount] = useState("")
  const [skills, setSkills] = useState("React, Next.js, Tailwind CSS, TypeScript, API Integration")

  // AI Proposal generation states
  const [generatedProposal, setGeneratedProposal] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Hydration / Load state
  useEffect(() => {
    const saved = localStorage.getItem("freelancer_os_bids")
    if (saved) {
      try {
        setBids(JSON.parse(saved).map((b: any) => ({ ...b, submittedAt: new Date(b.submittedAt) })))
      } catch {
        setBids(initialBids)
      }
    } else {
      setBids(initialBids)
    }
  }, [])

  const saveBids = (newBids: Bid[]) => {
    setBids(newBids)
    localStorage.setItem("freelancer_os_bids", JSON.stringify(newBids))
  }

  const handleAddBid = (e: React.FormEvent) => {
    e.preventDefault()
    if (!jobTitle || !jobDescription || !bidAmount) return

    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      jobTitle,
      platform,
      clientName: clientName || "Unknown Client",
      jobDescription,
      bidAmount: parseFloat(bidAmount),
      status: "DRAFT",
      submittedAt: new Date()
    }

    const updated = [newBid, ...bids]
    saveBids(updated)
    setIsAddOpen(false)
    
    // Clear Form
    setJobTitle("")
    setClientName("")
    setJobDescription("")
    setBidAmount("")
  }

  const triggerAIProposal = (bid: Bid) => {
    setSelectedBid(bid)
    setGeneratedProposal("")
    setIsAIProposalOpen(true)
  }

  const generateProposal = async () => {
    if (!selectedBid) return
    setIsGenerating(true)
    setGeneratedProposal("")
    try {
      const res = await fetch("/api/ai/bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: selectedBid.jobTitle,
          jobDescription: selectedBid.jobDescription,
          freelancerSkills: skills,
          budget: `$${selectedBid.bidAmount}`
        })
      })
      const data = await res.json()
      if (data.proposal) {
        setGeneratedProposal(data.proposal)
        // Also update the bid in LocalStorage with the proposal text
        const updated = bids.map(b => b.id === selectedBid.id ? { ...b, proposalText: data.proposal, status: "SUBMITTED" as BidStatus } : b)
        saveBids(updated)
      } else {
        setGeneratedProposal("Error: Unable to generate proposal. Please verify your Groq API Key.")
      }
    } catch (err) {
      setGeneratedProposal("An unexpected error occurred during generation.")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedProposal)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // Stats calculation
  const totalBidsCount = bids.length
  const wonBids = bids.filter(b => b.status === "WON")
  const wonBidsCount = wonBids.length
  const pendingBidsCount = bids.filter(b => ["SUBMITTED", "VIEWED", "SHORTLISTED"].includes(b.status)).length
  const winRate = totalBidsCount > 0 ? Math.round((wonBidsCount / totalBidsCount) * 100) : 0
  const pipelineValue = bids.reduce((acc, curr) => acc + curr.bidAmount, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Bid Assistant</h1>
          <p className="text-gray-500 mt-1">Track platforms, drafts, and automatically write proposals using Groq AI.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          Add New Job Bid
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Bids</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalBidsCount}</p>
          </div>
          <div className="bg-blue-50 p-2.5 rounded-xl">
            <Target className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Bids Won</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{wonBidsCount}</p>
          </div>
          <div className="bg-green-50 p-2.5 rounded-xl">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Active Pipelines</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{pendingBidsCount}</p>
          </div>
          <div className="bg-orange-50 p-2.5 rounded-xl">
            <Clock className="h-5 w-5 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Win Rate</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{winRate}%</p>
          </div>
          <div className="bg-purple-50 p-2.5 rounded-xl">
            <Percent className="h-5 w-5 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bids List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Active Opportunities</h2>
            <span className="text-xs text-gray-400 font-medium">Pipeline Value: ${pipelineValue.toLocaleString()}</span>
          </div>

          {bids.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No bids logged yet</p>
              <p className="text-gray-400 text-xs mt-1">Add your first job listing to write an AI proposal.</p>
              <button
                onClick={() => setIsAddOpen(true)}
                className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 font-semibold text-xs rounded-lg hover:bg-blue-100 transition-colors"
              >
                Log New Bid
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bids.map((bid) => (
                <BidCard key={bid.id} bid={bid} onGenerateProposal={triggerAIProposal} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Job */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Log New Bid Opportunity">
        <form onSubmit={handleAddBid} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Job Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Next.js Developer Needed"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Platform</label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
              >
                <option value="Upwork">Upwork</option>
                <option value="Fiverr">Fiverr</option>
                <option value="Toptal">Toptal</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Direct">Direct Client</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Budget / Bid Amount ($)</label>
              <input
                type="number"
                required
                placeholder="e.g. 1500"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Client Name / Agency</label>
            <input
              type="text"
              placeholder="e.g. Acme Corp"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Job Description</label>
            <textarea
              required
              rows={4}
              placeholder="Paste the job post detail description here..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm mt-2 transition-colors cursor-pointer"
          >
            Create Opportunity
          </button>
        </form>
      </Modal>

      {/* Modal: AI Proposal generator */}
      <Modal isOpen={isAIProposalOpen} onClose={() => setIsAIProposalOpen(false)} title="AI Winning Proposal Writer">
        {selectedBid && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg text-xs border border-gray-150">
              <h4 className="font-bold text-gray-900">{selectedBid.jobTitle}</h4>
              <p className="text-gray-500 mt-1 line-clamp-2">{selectedBid.jobDescription}</p>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Your Skills Context</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Tailwind, Node.js..."
              />
            </div>

            {generatedProposal ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase">Generated Pitch:</span>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-700 cursor-pointer"
                  >
                    {isCopied ? <CheckCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {isCopied ? "Copied!" : "Copy Proposal"}
                  </button>
                </div>
                <div className="bg-gray-950 text-gray-100 p-4 rounded-xl text-sm font-mono overflow-y-auto max-h-60 whitespace-pre-wrap leading-relaxed select-all">
                  {generatedProposal}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                {isGenerating ? (
                  <div className="space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
                    <p className="text-xs text-gray-500 font-medium">Llama 3.1 is drafting your winning bid...</p>
                  </div>
                ) : (
                  <button
                    onClick={generateProposal}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:from-blue-700 hover:to-purple-700 transition-colors shadow shadow-blue-100 cursor-pointer"
                  >
                    <Sparkles className="h-4.5 w-4.5" />
                    Generate Proposal
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
