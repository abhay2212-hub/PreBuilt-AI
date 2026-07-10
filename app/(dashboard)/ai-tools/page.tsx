"use client"

import { useState } from "react"
import { Brain, Sparkles, Send, ShieldAlert, FileText, Copy, CheckCircle, Mail } from "lucide-react"
import Badge from "@/components/ui/Badge"
import { generateEmail } from "@/lib/ai"

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState<"proposal" | "creep" | "email" | "roadmap">("proposal")

  // Shared Copied States
  const [isCopied, setIsCopied] = useState(false)

  // 1. Proposal Writer States
  const [jobTitle, setJobTitle] = useState("")
  const [jobDesc, setJobDesc] = useState("")
  const [skills, setSkills] = useState("Next.js, TypeScript, Tailwind CSS, API Integration")
  const [budget, setBudget] = useState("$2,500")
  const [proposalOutput, setProposalOutput] = useState("")
  const [isProposalGen, setIsProposalGen] = useState(false)

  // 2. Scope Creep Analyzer States
  const [scope, setScope] = useState("")
  const [message, setMessage] = useState("")
  const [creepOutput, setCreepOutput] = useState<any | null>(null)
  const [isCreepGen, setIsCreepGen] = useState(false)

  // 3. Client Email Writer States
  const [emailType, setEmailType] = useState("milestone-completed")
  const [clientName, setClientName] = useState("")
  const [projectName, setProjectName] = useState("")
  const [context, setContext] = useState("")
  const [emailOutput, setEmailOutput] = useState("")
  const [isEmailGen, setIsEmailGen] = useState(false)

  // 4. Project Roadmap States
  const [roadTitle, setRoadTitle] = useState("")
  const [roadDesc, setRoadDesc] = useState("")
  const [roadDeadline, setRoadDeadline] = useState("3 weeks")
  const [roadOutput, setRoadOutput] = useState<any | null>(null)
  const [isRoadGen, setIsRoadGen] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // Action Handlers
  const handleProposalGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProposalGen(true)
    setProposalOutput("")
    try {
      const res = await fetch("/api/ai/bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          jobDescription: jobDesc,
          freelancerSkills: skills,
          budget
        })
      })
      const data = await res.json()
      setProposalOutput(data.proposal || "Could not generate proposal. Verify API key.")
    } catch {
      setProposalOutput("An error occurred during generation.")
    } finally {
      setIsProposalGen(false)
    }
  }

  const handleScopeCreepGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreepGen(true)
    setCreepOutput(null)
    try {
      const res = await fetch("/api/ai/scope-creep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalScope: scope, clientMessage: message })
      })
      const data = await res.json()
      setCreepOutput(data)
    } catch {
      setCreepOutput({ explanation: "An error occurred during scope creep analysis." })
    } finally {
      setIsCreepGen(false)
    }
  }

  const handleEmailGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsEmailGen(true)
    setEmailOutput("")
    try {
      const res = await fetch("/api/ai/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailType, clientName, projectName, context })
      })
      const data = await res.json()
      setEmailOutput(data.email || "Could not generate email draft.")
    } catch {
      setEmailOutput("An error occurred during generation.")
    } finally {
      setIsEmailGen(false)
    }
  }

  const handleRoadmapGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRoadGen(true)
    setRoadOutput(null)
    try {
      const res = await fetch("/api/ai/project-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: roadTitle, description: roadDesc, deadline: roadDeadline })
      })
      const data = await res.json()
      setRoadOutput(data)
    } catch {
      setRoadOutput({ overview: "An error occurred during plan generation." })
    } finally {
      setIsRoadGen(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Co-Pilot Playground</h1>
        <p className="text-gray-500 mt-1">Access all FreelancerOS Llama 3 intelligence models in a unified playground dashboard.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab("proposal")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "proposal" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          Winning Proposal Writer
        </button>
        <button
          onClick={() => setActiveTab("creep")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "creep" ? "border-purple-600 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          Scope Creep Shield
        </button>
        <button
          onClick={() => setActiveTab("email")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "email" ? "border-pink-600 text-pink-600" : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          Client Email Generator
        </button>
        <button
          onClick={() => setActiveTab("roadmap")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "roadmap" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          Project Roadmap Planner
        </button>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Forms */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          {activeTab === "proposal" && (
            <form onSubmit={handleProposalGenerate} className="space-y-4">
              <div className="flex items-center gap-2 mb-2 text-blue-700">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-bold text-gray-900">Proposal Parameters</h3>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js Developer for Web Dashboard"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Freelancer Skills</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Client Budget</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Job Description</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Paste Upwork / Fiverr job post content details..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none"
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isProposalGen}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
              >
                {isProposalGen ? "Drafting..." : "Generate AI Proposal"}
              </button>
            </form>
          )}

          {activeTab === "creep" && (
            <form onSubmit={handleScopeCreepGenerate} className="space-y-4">
              <div className="flex items-center gap-2 mb-2 text-purple-700">
                <ShieldAlert className="h-5 w-5" />
                <h3 className="font-bold text-gray-900">Scope Parameters</h3>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Original Contracted Scope</label>
                <textarea
                  required
                  rows={3}
                  placeholder="What was originally agreed? (e.g. Design 3 mobile app screens in Figma)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500 resize-none"
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">New Client Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Paste the message showing updates/requests... (e.g. Can we add 2 more views and user signup?)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500 resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isCreepGen}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
              >
                {isCreepGen ? "Analyzing..." : "Analyze Scope Creep"}
              </button>
            </form>
          )}

          {activeTab === "email" && (
            <form onSubmit={handleEmailGenerate} className="space-y-4">
              <div className="flex items-center gap-2 mb-2 text-pink-700">
                <Mail className="h-5 w-5" />
                <h3 className="font-bold text-gray-900">Email Parameters</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marcus Vance"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-500"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EcoStore Portal"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-500"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Type / Intent</label>
                <select
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-500"
                  value={emailType}
                  onChange={(e) => setEmailType(e.target.value)}
                >
                  <option value="milestone-completed">Milestone Completed & Invoice Sent</option>
                  <option value="follow-up-bid">Follow-up on Proposal Pitch</option>
                  <option value="payment-reminder">Polite Payment Due Reminder</option>
                  <option value="scope-change-request">Requesting Scope Adjustment Rate</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Context / Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Any details to insert? (e.g. Completed header component, billing details attached)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-500 resize-none"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isEmailGen}
                className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
              >
                {isEmailGen ? "Drafting..." : "Compose Email Draft"}
              </button>
            </form>
          )}

          {activeTab === "roadmap" && (
            <form onSubmit={handleRoadmapGenerate} className="space-y-4">
              <div className="flex items-center gap-2 mb-2 text-indigo-700">
                <FileText className="h-5 w-5" />
                <h3 className="font-bold text-gray-900">Project Details</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SaaS Portal Integration"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    value={roadTitle}
                    onChange={(e) => setRoadTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Deadline Date</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3 weeks"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    value={roadDeadline}
                    onChange={(e) => setRoadDeadline(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Brief Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe key requirements for step outline plan..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 resize-none"
                  value={roadDesc}
                  onChange={(e) => setRoadDesc(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isRoadGen}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
              >
                {isRoadGen ? "Calculating..." : "Draft Roadmap Steps"}
              </button>
            </form>
          )}
        </div>

        {/* Output Workspaces */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[400px] flex flex-col shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Model Outputs</span>
            <div className="flex items-center gap-1 text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold uppercase">
              Llama-3-70b-Versatile
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            {/* 1. Proposal Output */}
            {activeTab === "proposal" && (
              proposalOutput ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-500">PROPOSAL BODY:</span>
                    <button
                      onClick={() => copyToClipboard(proposalOutput)}
                      className="flex items-center gap-1 text-xs text-blue-600 font-bold cursor-pointer"
                    >
                      {isCopied ? <CheckCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {isCopied ? "Copied" : "Copy to Clipboard"}
                    </button>
                  </div>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-xl text-sm font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto select-all border border-gray-800">
                    {proposalOutput}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center flex-1 text-gray-450 p-6">
                  <Brain className="h-10 w-10 text-gray-300 mb-2" />
                  <p className="text-sm font-semibold">Your Generated Bid Pitch will show here.</p>
                </div>
              )
            )}

            {/* 2. Scope Creep Output */}
            {activeTab === "creep" && (
              creepOutput ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-500">ANALYSIS:</span>
                    <Badge variant={creepOutput.isScopeCreep ? "danger" : "success"}>
                      {creepOutput.isScopeCreep ? "SCOPE CREEP" : "WITHIN CONTRACT LIMITS"}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 text-purple-950 rounded-lg text-xs leading-relaxed border border-purple-100">
                      <strong>Verdict Details:</strong> {creepOutput.explanation}
                    </div>

                    {creepOutput.isScopeCreep && (
                      <>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="bg-red-50 p-2.5 rounded-lg border border-red-100">
                            <span className="text-red-700 font-bold block">Rate Delta:</span>
                            <span className="text-red-950 font-bold text-sm">{creepOutput.additionalCost || "$150+"}</span>
                          </div>
                          <div className="bg-red-50 p-2.5 rounded-lg border border-red-100">
                            <span className="text-red-700 font-bold block">Extra Dev Time:</span>
                            <span className="text-red-950 font-bold text-sm">{creepOutput.extraHours || "3 hours"}</span>
                          </div>
                        </div>

                        {creepOutput.suggestedResponse && (
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-150 text-xs">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-gray-700">SUGGESTED CLIENT REPLY:</span>
                              <button
                                onClick={() => copyToClipboard(creepOutput.suggestedResponse)}
                                className="text-purple-600 hover:text-purple-700 font-bold cursor-pointer"
                              >
                                Copy Response
                              </button>
                            </div>
                            <p className="italic bg-white p-2.5 rounded border border-gray-100 leading-normal select-all">
                              {creepOutput.suggestedResponse}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center flex-1 text-gray-450 p-6">
                  <ShieldAlert className="h-10 w-10 text-gray-300 mb-2" />
                  <p className="text-sm font-semibold">Scope creep analytics & metrics will show here.</p>
                </div>
              )
            )}

            {/* 3. Email Output */}
            {activeTab === "email" && (
              emailOutput ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-500">COMPOSED EMAIL DRAFT:</span>
                    <button
                      onClick={() => copyToClipboard(emailOutput)}
                      className="flex items-center gap-1 text-xs text-pink-600 font-bold cursor-pointer"
                    >
                      {isCopied ? <CheckCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {isCopied ? "Copied" : "Copy to Clipboard"}
                    </button>
                  </div>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-xl text-sm font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto select-all border border-gray-800">
                    {emailOutput}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center flex-1 text-gray-450 p-6">
                  <Mail className="h-10 w-10 text-gray-300 mb-2" />
                  <p className="text-sm font-semibold">AI composed client email drafts will show here.</p>
                </div>
              )
            )}

            {/* 4. Roadmap Output */}
            {activeTab === "roadmap" && (
              roadOutput ? (
                <div className="space-y-4">
                  <span className="text-xs font-semibold text-gray-500">ROADMAP STEPS:</span>
                  <div className="bg-indigo-50 border border-indigo-150 p-3 rounded-lg text-xs leading-relaxed text-indigo-950">
                    <strong>Milestone Overview:</strong> {roadOutput.overview}
                  </div>
                  <div className="space-y-3 overflow-y-auto max-h-80 pr-1">
                    {roadOutput.phases?.map((phase: any, index: number) => (
                      <div key={index} className="border border-gray-100 rounded-lg p-3 bg-gray-50 text-xs">
                        <div className="flex justify-between items-center border-b border-gray-150 pb-1.5 mb-2">
                          <span className="font-bold text-gray-900">{phase.name}</span>
                          <Badge variant="neutral">{phase.duration}</Badge>
                        </div>
                        <div className="space-y-2">
                          {phase.tasks?.map((t: any, i: number) => (
                            <div key={i} className="bg-white p-2 rounded border border-gray-100 space-y-1">
                              <div className="flex justify-between items-center font-semibold text-gray-700">
                                <span>{t.task}</span>
                                <span>{t.hours}h</span>
                              </div>
                              <p className="text-[11px] text-gray-400 leading-normal">{t.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center flex-1 text-gray-450 p-6">
                  <FileText className="h-10 w-10 text-gray-300 mb-2" />
                  <p className="text-sm font-semibold">AI roadmap phases & tools will show here.</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
