"use client"

import { useState } from "react"
import { BookOpen, Sparkles, Star, ChevronRight, DollarSign, Award, Heart, CheckCircle } from "lucide-react"
import Modal from "@/components/ui/Modal"
import Badge from "@/components/ui/Badge"

interface Niche {
  id: string
  name: string
  category: string
  icon: string
  description: string
  avgRate: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  timeToFirstClient: string
}

const initialNiches: Niche[] = [
  {
    id: "niche-1",
    name: "Next.js SaaS Developer",
    category: "Software Development",
    icon: "💻",
    description: "Build premium interactive storefronts and subscription platforms with Next.js, Tailwind, and Supabase integration.",
    avgRate: "$65 - $120/hr",
    difficulty: "Advanced",
    timeToFirstClient: "3-4 weeks"
  },
  {
    id: "niche-2",
    name: "Shopify Speed Optimizer",
    category: "E-commerce Tech",
    icon: "⚡",
    description: "Audit custom e-commerce stores, fix render-blocking scripts, and configure CDNs to boost conversion metrics.",
    avgRate: "$50 - $90/hr",
    difficulty: "Intermediate",
    timeToFirstClient: "2 weeks"
  },
  {
    id: "niche-3",
    name: "Ghostwriter for Founders",
    category: "Creative & Writing",
    icon: "✍️",
    description: "Draft authority-building LinkedIn posts and newsletters for venture founders, CEOs, and agency owners.",
    avgRate: "$40 - $75/hr",
    difficulty: "Beginner",
    timeToFirstClient: "1-2 weeks"
  },
  {
    id: "niche-4",
    name: "Notion Systems Architect",
    category: "Operations",
    icon: "📓",
    description: "Build custom workspaces, templates, client portals, and CRM trackers for growing companies and creators.",
    avgRate: "$45 - $80/hr",
    difficulty: "Intermediate",
    timeToFirstClient: "2 weeks"
  },
  {
    id: "niche-5",
    name: "SEO Technical Auditor",
    category: "Marketing",
    icon: "🔍",
    description: "Run SEO crawlers, map broken redirects, write clean meta tags, and build organic traffic growth schemes.",
    avgRate: "$35 - $65/hr",
    difficulty: "Beginner",
    timeToFirstClient: "2 weeks"
  }
]

export default function NicheKitsPage() {
  const [niches] = useState<Niche[]>(initialNiches)
  const [isKitOpen, setIsKitOpen] = useState(false)
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null)
  const [kitData, setKitData] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleUnlockKit = async (niche: Niche) => {
    setSelectedNiche(niche)
    setKitData(null)
    setIsKitOpen(true)
    setIsLoading(true)

    try {
      const res = await fetch("/api/ai/niche-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche: niche.name })
      })
      const data = await res.json()
      setKitData(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getDifficultyColor = (diff: string) => {
    if (diff === "Beginner") return "success"
    if (diff === "Intermediate") return "warning"
    return "danger"
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Niche Starter Kits</h1>
        <p className="text-gray-500 mt-1">Unlock step-by-step roadmaps, pricing strategies, learning resources, and portfolio concepts for hot niches.</p>
      </div>

      {/* Grid of Niches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {niches.map((niche) => (
          <div key={niche.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="text-3xl bg-gray-50 p-2 rounded-xl">{niche.icon}</div>
                <Badge variant={getDifficultyColor(niche.difficulty)}>{niche.difficulty}</Badge>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">{niche.category}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-0.5">{niche.name}</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{niche.description}</p>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-medium">Average Market Rates:</span>
                <span className="font-bold text-gray-900">{niche.avgRate}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-medium">Time to First Client:</span>
                <span className="font-semibold text-gray-800">{niche.timeToFirstClient}</span>
              </div>
              <button
                onClick={() => handleUnlockKit(niche)}
                className="w-full mt-2 flex items-center justify-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 rounded-lg text-xs transition-colors cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Unlock AI Starter Kit <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Niche Kit display */}
      <Modal isOpen={isKitOpen} onClose={() => setIsKitOpen(false)} title="Freelance Niche Roadmap Console">
        {selectedNiche && (
          <div className="space-y-6">
            <div>
              <span className="text-3xl">{selectedNiche.icon}</span>
              <h3 className="text-xl font-bold text-gray-900 mt-2">{selectedNiche.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{selectedNiche.category} · {selectedNiche.difficulty} Difficulty</p>
            </div>

            {isLoading && (
              <div className="py-12 text-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
                <p className="text-xs text-gray-500 font-medium">Consulting Llama 3 intelligence for roadmap templates...</p>
              </div>
            )}

            {!isLoading && kitData && (
              <div className="space-y-5">
                {kitData.overview && (
                  <div className="bg-blue-50 border border-blue-150 p-3 rounded-lg text-xs leading-relaxed text-blue-950">
                    <strong>Niche Scope:</strong> {kitData.overview}
                  </div>
                )}

                {/* Avg Rates */}
                {kitData.avgRates && (
                  <div className="border border-gray-100 rounded-lg p-3 space-y-2">
                    <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      Rates Strategy
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-[10px] text-gray-400 block font-semibold uppercase">Beginner</span>
                        <strong className="text-gray-900">{kitData.avgRates.beginner}</strong>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-[10px] text-gray-400 block font-semibold uppercase">Midweight</span>
                        <strong className="text-gray-900">{kitData.avgRates.intermediate}</strong>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-[10px] text-gray-400 block font-semibold uppercase">Expert</span>
                        <strong className="text-gray-900">{kitData.avgRates.expert}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Skills & Tools */}
                <div className="grid grid-cols-2 gap-4">
                  {kitData.skills && (
                    <div className="border border-gray-100 rounded-lg p-3 space-y-1.5">
                      <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                        <Award className="h-3.5 w-3.5 text-blue-500" />
                        Skills to Learn
                      </span>
                      <ul className="text-xs space-y-1 text-gray-600 list-disc list-inside">
                        {kitData.skills.slice(0, 4).map((s: string, i: number) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {kitData.freeTools && (
                    <div className="border border-gray-100 rounded-lg p-3 space-y-1.5">
                      <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5 text-red-500" />
                        Recommended Tools
                      </span>
                      <ul className="text-xs space-y-1 text-gray-600 list-disc list-inside">
                        {kitData.freeTools.slice(0, 4).map((t: string, i: number) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Learning Path */}
                {kitData.learningPath && (
                  <div className="border border-gray-100 rounded-lg p-3 space-y-2">
                    <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-purple-600" />
                      Weekly Study Roadmap
                    </span>
                    <div className="space-y-2">
                      {kitData.learningPath.map((step: any, idx: number) => (
                        <div key={idx} className="bg-gray-50 p-2.5 rounded text-xs space-y-0.5 border border-gray-150">
                          <span className="font-bold text-gray-800">Week {step.week || step.step || idx+1}: {step.goal}</span>
                          {step.resources && (
                            <p className="text-[10px] text-gray-400 leading-normal">
                              Resources: {Array.isArray(step.resources) ? step.resources.join(", ") : step.resources}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* First Client Steps */}
                {kitData.firstClientSteps && (
                  <div className="border border-gray-100 rounded-lg p-3 space-y-1.5">
                    <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Customer Prospecting Strategy
                    </span>
                    <ul className="text-xs space-y-1 text-gray-600 list-disc list-inside">
                      {kitData.firstClientSteps.map((step: string, i: number) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
