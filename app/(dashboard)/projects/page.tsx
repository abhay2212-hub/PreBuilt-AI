"use client"

import { useState, useEffect } from "react"
import { Plus, Briefcase, Sparkles, BookOpen, Clock, AlertTriangle, CheckCircle2 } from "lucide-react"
import ProjectCard from "@/components/projects/ProjectCard"
import Modal from "@/components/ui/Modal"
import Badge from "@/components/ui/Badge"
import { Project, ProjectStatus, Priority } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"

const initialProjects: Project[] = [
  {
    id: "proj-1",
    title: "E-commerce Website Rebuild",
    description: "Rebuild the custom Shopify React storefront to utilize Next.js 14 and Tailwind CSS for better server performance.",
    status: "ACTIVE",
    priority: "HIGH",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    budget: 3500,
    progress: 75,
    hoursLogged: 24,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  },
  {
    id: "proj-2",
    title: "EcoStore Branding & Logo Package",
    description: "Create brand guidelines, typography scale, logo variants, and social media templates.",
    status: "REVIEW",
    priority: "MEDIUM",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    budget: 800,
    progress: 90,
    hoursLogged: 12,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  },
  {
    id: "proj-3",
    title: "SaaS Mobile App UX Designs",
    description: "Design UI mockups in Figma for 10 core views of the SaaS dashboard companion mobile app.",
    status: "LEAD",
    priority: "LOW",
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    budget: 5000,
    progress: 10,
    hoursLogged: 2,
    createdAt: new Date()
  }
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // Form State
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<ProjectStatus>("ACTIVE")
  const [priority, setPriority] = useState<Priority>("MEDIUM")
  const [deadline, setDeadline] = useState("")
  const [budget, setBudget] = useState("")
  const [hourlyRate, setHourlyRate] = useState("")

  // AI Plan states
  const [aiPlan, setAiPlan] = useState<any | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("freelancer_os_projects")
    if (saved) {
      try {
        setProjects(JSON.parse(saved).map((p: any) => ({
          ...p,
          deadline: p.deadline ? new Date(p.deadline) : undefined,
          createdAt: new Date(p.createdAt)
        })))
      } catch {
        setProjects(initialProjects)
      }
    } else {
      setProjects(initialProjects)
    }
  }, [])

  const saveProjects = (newProj: Project[]) => {
    setProjects(newProj)
    localStorage.setItem("freelancer_os_projects", JSON.stringify(newProj))
  }

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title,
      description,
      status,
      priority,
      deadline: deadline ? new Date(deadline) : undefined,
      budget: budget ? parseFloat(budget) : undefined,
      hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
      progress: 0,
      hoursLogged: 0,
      createdAt: new Date()
    }

    const updated = [newProject, ...projects]
    saveProjects(updated)
    setIsAddOpen(false)

    // Clear Form
    setTitle("")
    setDescription("")
    setDeadline("")
    setBudget("")
    setHourlyRate("")
  }

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project)
    setAiPlan(null)
    setIsDetailsOpen(true)
  }

  const generatePlan = async () => {
    if (!selectedProject) return
    setIsGenerating(true)
    setAiPlan(null)
    try {
      const res = await fetch("/api/ai/project-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedProject.title,
          description: selectedProject.description || "",
          deadline: selectedProject.deadline ? formatDate(selectedProject.deadline) : "2 weeks"
        })
      })
      const data = await res.json()
      setAiPlan(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Executor</h1>
          <p className="text-gray-500 mt-1">Manage deliverables and draft instant step-by-step implementation roadmaps using AI.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          Create Project
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <ProjectCard key={proj.id} project={proj} onViewDetails={handleViewDetails} />
        ))}
      </div>

      {/* Modal: Add Project */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create New Project Workspace">
        <form onSubmit={handleAddProject} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Project Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Mobile Design Redesign"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Brief details about the client's goal..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Status</label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              >
                <option value="LEAD">Lead</option>
                <option value="PROPOSAL">Proposal</option>
                <option value="ACTIVE">Active</option>
                <option value="REVIEW">Review</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Priority</label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Deadline Date</label>
              <input
                type="date"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Budget ($)</label>
              <input
                type="number"
                placeholder="Total"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm mt-2 transition-colors cursor-pointer"
          >
            Launch Project
          </button>
        </form>
      </Modal>

      {/* Modal: Project details and AI executor */}
      <Modal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title="Project Execution Console">
        {selectedProject && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedProject.title}</h3>
                  {selectedProject.deadline && (
                    <p className="text-xs text-gray-400 mt-1">Deadline: {formatDate(selectedProject.deadline)}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Badge variant={selectedProject.priority === "HIGH" || selectedProject.priority === "URGENT" ? "danger" : "info"}>
                    {selectedProject.priority}
                  </Badge>
                  <Badge variant="purple">{selectedProject.status}</Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3 bg-gray-50 p-3 rounded-lg border border-gray-150">
                {selectedProject.description || "No description provided."}
              </p>
            </div>

            {/* AI Generator Trigger */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  AI Execution Roadmap
                </span>
                {!aiPlan && !isGenerating && (
                  <button
                    onClick={generatePlan}
                    className="text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Generate Step-by-Step Plan
                  </button>
                )}
              </div>

              {isGenerating && (
                <div className="py-6 text-center space-y-2">
                  <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-purple-600 mx-auto" />
                  <p className="text-xs text-gray-500 font-medium">Drafting milestone roadmap structure...</p>
                </div>
              )}

              {aiPlan && (
                <div className="space-y-4">
                  {aiPlan.overview && (
                    <div className="bg-purple-50/50 border border-purple-100 p-3 rounded-lg text-xs leading-relaxed text-purple-950">
                      <strong>Overview:</strong> {aiPlan.overview}
                    </div>
                  )}

                  {aiPlan.phases && (
                    <div className="space-y-3">
                      {aiPlan.phases.map((phase: any, index: number) => (
                        <div key={index} className="border border-gray-100 rounded-lg p-3 space-y-2 bg-white">
                          <div className="flex justify-between items-center border-b border-gray-50 pb-1.5">
                            <span className="text-xs font-bold text-gray-900">{phase.name}</span>
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">{phase.duration}</span>
                          </div>
                          <div className="space-y-2">
                            {phase.tasks?.map((task: any, idx: number) => (
                              <div key={idx} className="text-xs space-y-1">
                                <div className="flex items-start justify-between font-medium text-gray-700">
                                  <span>{task.task}</span>
                                  <span className="text-gray-400 font-normal">{task.hours}h</span>
                                </div>
                                <p className="text-[11px] text-gray-400 leading-normal">{task.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {aiPlan.risks && (
                    <div className="p-3 bg-red-50/50 border border-red-100 rounded-lg space-y-1">
                      <span className="text-[10px] font-bold text-red-700 uppercase flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Identified Execution Risks:
                      </span>
                      <ul className="list-disc list-inside text-[11px] text-red-900 space-y-0.5">
                        {aiPlan.risks.map((risk: string, i: number) => (
                          <li key={i}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
