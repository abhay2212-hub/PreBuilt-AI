"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Square, Clock, DollarSign, Briefcase, Plus, AlertCircle, FileText } from "lucide-react"
import Badge from "@/components/ui/Badge"
import { TimeLog, Project } from "@/types"
import { formatCurrency, formatDuration, formatDate } from "@/lib/utils"

const initialLogs: TimeLog[] = [
  {
    id: "log-1",
    projectId: "proj-1",
    projectName: "E-commerce Website Rebuild",
    description: "Configuring layout settings & importing stats cards",
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
    duration: 90, // in minutes
    billable: true,
    hourlyRate: 50
  },
  {
    id: "log-2",
    projectId: "proj-2",
    projectName: "EcoStore Branding & Logo Package",
    description: "Drafting color systems and vectors in Illustrator",
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 22.5 * 60 * 60 * 1000),
    duration: 120, // in minutes
    billable: true,
    hourlyRate: 65
  }
]

export default function TimeTrackingPage() {
  const [logs, setLogs] = useState<TimeLog[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  
  // Timer States
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [timerDescription, setTimerDescription] = useState("")
  const [timerProjectSelect, setTimerProjectSelect] = useState("")
  const [isBillable, setIsBillable] = useState(true)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<Date | null>(null)

  useEffect(() => {
    // Load logs
    const savedLogs = localStorage.getItem("freelancer_os_timelogs")
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs).map((l: any) => ({
          ...l,
          startTime: new Date(l.startTime),
          endTime: l.endTime ? new Date(l.endTime) : undefined
        })))
      } catch {
        setLogs(initialLogs)
      }
    } else {
      setLogs(initialLogs)
    }

    // Load projects for select box
    const savedProj = localStorage.getItem("freelancer_os_projects")
    if (savedProj) {
      try {
        setProjects(JSON.parse(savedProj))
      } catch {
        setProjects([])
      }
    }
  }, [])

  const saveLogs = (newLogs: TimeLog[]) => {
    setLogs(newLogs)
    localStorage.setItem("freelancer_os_timelogs", JSON.stringify(newLogs))
  }

  // Timer interval control
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isTimerRunning])

  const handleStartTimer = () => {
    setIsTimerRunning(true)
    startTimeRef.current = new Date()
    setElapsedSeconds(0)
  }

  const handleStopTimer = () => {
    if (!isTimerRunning || !startTimeRef.current) return
    setIsTimerRunning(false)
    
    const endTime = new Date()
    const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60))
    const selectedProj = projects.find(p => p.id === timerProjectSelect)

    const newLog: TimeLog = {
      id: `log-${Date.now()}`,
      projectId: timerProjectSelect || "independent",
      projectName: selectedProj?.title || "Independent Tasks",
      description: timerDescription || "Worked on project elements",
      startTime: startTimeRef.current,
      endTime,
      duration: durationMinutes,
      billable: isBillable,
      hourlyRate: selectedProj?.hourlyRate || 50
    }

    // Update Project logged hours in LocalStorage
    if (selectedProj) {
      const updatedProj = projects.map(p => p.id === selectedProj.id ? { ...p, hoursLogged: (p.hoursLogged || 0) + durationMinutes / 60 } : p)
      localStorage.setItem("freelancer_os_projects", JSON.stringify(updatedProj))
      setProjects(updatedProj)
    }

    const updatedLogs = [newLog, ...logs]
    saveLogs(updatedLogs)

    // Reset Form
    setTimerDescription("")
    setTimerProjectSelect("")
    setElapsedSeconds(0)
    startTimeRef.current = null
  }

  // Helper formats
  const formatTimerDigits = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600).toString().padStart(2, "0")
    const mins = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, "0")
    const secs = (totalSecs % 60).toString().padStart(2, "0")
    return `${hrs}:${mins}:${secs}`
  }

  const totalTrackedMinutes = logs.reduce((acc, log) => acc + (log.duration || 0), 0)
  const billableLogs = logs.filter(l => l.billable)
  const billableTrackedMinutes = billableLogs.reduce((acc, log) => acc + (log.duration || 0), 0)
  const totalBillableEarnings = billableLogs.reduce((acc, log) => acc + ((log.duration || 0) / 60) * (log.hourlyRate || 50), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Time Tracking</h1>
        <p className="text-gray-500 mt-1">Log billable hours, track efficiency, and auto-invoice hourly tasks.</p>
      </div>

      {/* Stopwatch Area */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="What are you working on right now?"
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 md:col-span-2 w-full"
              value={timerDescription}
              onChange={(e) => setTimerDescription(e.target.value)}
              disabled={isTimerRunning}
            />
            <select
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 w-full"
              value={timerProjectSelect}
              onChange={(e) => setTimerProjectSelect(e.target.value)}
              disabled={isTimerRunning}
            >
              <option value="">-- Link to Project --</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
              {projects.length === 0 && (
                <option value="Independent">Independent</option>
              )}
            </select>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                id="billableCheck"
                checked={isBillable}
                onChange={(e) => setIsBillable(e.target.checked)}
                disabled={isTimerRunning}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="billableCheck" className="text-gray-600 font-medium">Billable</label>
            </div>

            <div className="text-2xl font-mono font-bold text-gray-900 bg-gray-50 px-4 py-1.5 rounded-lg border border-gray-150">
              {formatTimerDigits(elapsedSeconds)}
            </div>

            {isTimerRunning ? (
              <button
                onClick={handleStopTimer}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
              >
                <Square className="h-4 w-4" />
                Stop
              </button>
            ) : (
              <button
                onClick={handleStartTimer}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
              >
                <Play className="h-4 w-4" />
                Start Timer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Logged Time</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatDuration(totalTrackedMinutes)}</p>
          </div>
          <div className="bg-blue-50 p-2.5 rounded-xl">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Billable Hours</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatDuration(billableTrackedMinutes)}</p>
          </div>
          <div className="bg-green-50 p-2.5 rounded-xl">
            <Briefcase className="h-5 w-5 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Estimated Earnings</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalBillableEarnings)}</p>
          </div>
          <div className="bg-purple-50 p-2.5 rounded-xl">
            <DollarSign className="h-5 w-5 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Logs List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Recent Time Sheets</h3>
        </div>
        <div className="divide-y divide-gray-150">
          {logs.map((log) => (
            <div key={log.id} className="p-5 hover:bg-gray-50 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900">{log.projectName}</span>
                  <Badge variant={log.billable ? "success" : "neutral"}>
                    {log.billable ? `Billable @ $${log.hourlyRate}/hr` : "Non-Billable"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{log.description}</p>
                <div className="text-xs text-gray-400">
                  {formatDate(log.startTime)} · {log.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {log.endTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                <div className="text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-150 px-2.5 py-1 rounded">
                  {log.duration ? `${Math.floor(log.duration / 60)}h ${log.duration % 60}m` : "0h"}
                </div>
                {log.billable && log.duration && (
                  <div className="text-sm font-bold text-gray-900">
                    {formatCurrency((log.duration / 60) * (log.hourlyRate || 50))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              No logged time cards found. Complete a timing session to list item.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
