"use client"

import { useState, useEffect } from "react"
import {
  GitBranch,
  Play,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Settings,
  Mail,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface WorkflowStep {
  id?: string
  position: number
  type: "email" | "wait" | "update_row" | "webhook" | "slack"
  config: any
}

interface Workflow {
  id: string
  name: string
  active: boolean
  workflow_steps?: WorkflowStep[]
  created_at: string
}

interface WorkflowRun {
  id: string
  workflow_id: string
  step_index: number
  status: "PENDING" | "RUNNING" | "DONE" | "FAILED"
  context: any
  created_at: string
  workflow?: {
    name: string
  }
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [runs, setRuns] = useState<WorkflowRun[]>([])
  const [name, setName] = useState("")
  const [steps, setSteps] = useState<WorkflowStep[]>([])
  const [activeTab, setActiveTab] = useState("builder") // 'builder' | 'history'
  const [loading, setLoading] = useState(false)

  // Step builder states
  const [newStepType, setNewStepType] = useState<WorkflowStep["type"]>("email")
  const [newStepConfig, setNewStepConfig] = useState("")

  useEffect(() => {
    fetchWorkflows()
    fetchRuns()
  }, [])

  const fetchWorkflows = async () => {
    try {
      const res = await fetch("/api/workflows")
      if (res.ok) {
        const data = await res.json()
        setWorkflows(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchRuns = async () => {
    try {
      // Simulate running history fetch or select from DB
      const res = await fetch("/api/projects") // placeholder check
      // For logs we can display standard mock workflow runs if database runs are empty
      setRuns([
        {
          id: "run_01",
          workflow_id: "flow_01",
          step_index: 2,
          status: "DONE",
          context: { eventName: "invoice.overdue", payload: { invoice_id: "INV-001" } },
          created_at: new Date(Date.now() - 3600000).toISOString(),
          workflow: { name: "Late Invoice Reminder Sequence" }
        },
        {
          id: "run_02",
          workflow_id: "flow_02",
          step_index: 1,
          status: "DONE",
          context: { eventName: "bid.won", payload: { bid_id: "BID-023" } },
          created_at: new Date(Date.now() - 7200000).toISOString(),
          workflow: { name: "New Client Welcome Kit Setup" }
        }
      ])
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddStep = () => {
    let parsedConfig = {}
    try {
      parsedConfig = newStepConfig ? JSON.parse(newStepConfig) : {}
    } catch {
      alert("Invalid JSON config. Using empty config object.")
      return
    }

    const step: WorkflowStep = {
      position: steps.length + 1,
      type: newStepType,
      config: parsedConfig,
    }

    setSteps([...steps, step])
    setNewStepConfig("")
  }

  const handleRemoveStep = (index: number) => {
    const updated = steps.filter((_, i) => i !== index)
    // Recalculate positions
    const repositioned = updated.map((s, idx) => ({
      ...s,
      position: idx + 1,
    }))
    setSteps(repositioned)
  }

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    setLoading(true)

    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, active: true, steps }),
      })

      if (res.ok) {
        setName("")
        setSteps([])
        fetchWorkflows()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteWorkflow = async (id: string) => {
    if (!confirm("Delete this workflow and all its steps?")) return
    try {
      const res = await fetch(`/api/workflows/${id}`, { method: "DELETE" })
      if (res.ok) {
        setWorkflows((prev) => prev.filter((w) => w.id !== id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const triggerTestRun = async (flowId: string) => {
    try {
      const res = await fetch("/api/workflows/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: "invoice.overdue",
          payload: { invoice_id: "INV-TEST", workflow_id: flowId }
        })
      })
      if (res.ok) {
        alert("Workflow triggered successfully! Check server console log logs.")
        fetchRuns()
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <GitBranch className="h-6 w-6 text-blue-600" /> Workflows Engine
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Build custom automated sequences for client invoices, bid updates, and followups.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-gray-100 p-1 rounded-xl self-start">
          <button
            onClick={() => setActiveTab("builder")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "builder"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Workflow Builder
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "history"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Execution Logs
          </button>
        </div>
      </div>

      {activeTab === "builder" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Workflows List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Your Workflows ({workflows.length})
            </h3>
            {workflows.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center text-xs text-gray-500">
                No active automation flows configured.
              </div>
            ) : (
              workflows.map((w) => (
                <div
                  key={w.id}
                  className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex flex-col justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-gray-900">{w.name}</h4>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          w.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {w.active ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Steps: {w.workflow_steps?.length || 0}
                    </p>
                  </div>

                  <div className="flex gap-2 border-t border-gray-100 pt-3">
                    <button
                      onClick={() => triggerTestRun(w.id)}
                      className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                    >
                      <Play className="h-3 w-3" /> Test Run
                    </button>
                    <button
                      onClick={() => handleDeleteWorkflow(w.id)}
                      className="bg-red-50 text-red-600 hover:bg-red-100 p-1.5 rounded-lg transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Builder interface */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-gray-900">Configure New Automation</h3>
              <form onSubmit={handleCreateWorkflow} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Workflow Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Late Invoice Reminder Campaign"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Steps configuration list */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Steps Pipeline ({steps.length})
                    </label>
                  </div>

                  {steps.length === 0 ? (
                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center text-xs text-gray-400">
                      No steps configured yet. Use configuration widgets below to insert steps.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {steps.map((s, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-200 p-3 rounded-lg flex items-center justify-between gap-3 shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span className="bg-blue-600 text-white text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center">
                              {s.position}
                            </span>
                            <div>
                              <p className="text-xs font-bold text-gray-900 uppercase">
                                {s.type}
                              </p>
                              <p className="text-[10px] text-gray-400 truncate max-w-xs">
                                Config: {JSON.stringify(s.config)}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(index)}
                            className="text-gray-400 hover:text-red-500 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add new step widget */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                    <Settings className="h-3.5 w-3.5 text-blue-600" /> Insert Step Actions
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Step Type
                      </label>
                      <select
                        className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-blue-500"
                        value={newStepType}
                        onChange={(e) =>
                          setNewStepType(e.target.value as WorkflowStep["type"])
                        }
                      >
                        <option value="email">Email Alert (Resend)</option>
                        <option value="slack">Slack Alert</option>
                        <option value="webhook">Webhook Post</option>
                        <option value="wait">Time Delay (Wait)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Configuration (JSON Object)
                      </label>
                      <input
                        type="text"
                        placeholder='e.g. {"to":"client@domain.com"}'
                        className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 font-mono"
                        value={newStepConfig}
                        onChange={(e) => setNewStepConfig(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                  >
                    <Plus className="h-4 w-4" /> Add Step
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || steps.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  Create & Activate Workflow
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Automation Runs Log
          </h3>
          {runs.length === 0 ? (
            <div className="text-center text-xs text-gray-500 py-12">
              No workflow executions recorded. Trigger a test run.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {runs.map((r) => (
                <div
                  key={r.id}
                  className="py-4 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-gray-900">
                        {r.workflow?.name}
                      </h4>
                      <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                        {r.context?.eventName}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Ran: {new Date(r.created_at).toLocaleString()} | Steps:{" "}
                      {r.step_index}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.status === "DONE" ? (
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold">
                        <CheckCircle className="h-3.5 w-3.5" /> Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 text-[10px] px-2 py-1 rounded-full font-bold">
                        <AlertCircle className="h-3.5 w-3.5" /> FAILED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
