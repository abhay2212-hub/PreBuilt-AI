"use client"

import { useState, useEffect } from "react"
import {
  Mic,
  MicOff,
  Video,
  FileAudio,
  Plus,
  Trash2,
  ListTodo,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

interface Meeting {
  id: string
  title: string
  transcript: string
  summary: string
  project_id: string | null
  created_at: string
  project?: {
    title: string
  }
}

interface Project {
  id: string
  title: string
}

export default function MeetingCopilotPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState("")
  const [title, setTitle] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("logs") // 'logs' | 'record'
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)

  useEffect(() => {
    fetchMeetings()
    fetchProjects()
  }, [])

  useEffect(() => {
    let interval: any
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      setSeconds(0)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const fetchMeetings = async () => {
    try {
      const res = await fetch("/api/meetings")
      if (res.ok) {
        const data = await res.json()
        setMeetings(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects")
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleTranscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    if (file) {
      formData.append("file", file)
    }
    formData.append("projectId", selectedProject)
    formData.append("title", title || "Discovery Call Session")

    try {
      const res = await fetch("/api/meetings/transcribe", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        setTitle("")
        setSelectedProject("")
        setFile(null)
        setActiveTab("logs")
        fetchMeetings()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this meeting log?")) return
    try {
      const res = await fetch(`/api/meetings/${id}`, { method: "DELETE" })
      if (res.ok) {
        setMeetings((prev) => prev.filter((m) => m.id !== id))
        if (selectedMeeting?.id === id) {
          setSelectedMeeting(null)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0")
    const s = (sec % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600 animate-pulse" /> Meeting Copilot
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Transcribe discovery calls, auto-generate tasks, summaries and proposal specs.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-gray-100 p-1 rounded-xl self-start">
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "logs"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            All Recordings
          </button>
          <button
            onClick={() => setActiveTab("record")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "record"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            New Session
          </button>
        </div>
      </div>

      {activeTab === "record" ? (
        <div className="max-w-2xl bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-bold text-gray-900">Record or Upload Audio</h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Simulate call audio transcription or drop a call recording file to auto-extract action items.
            </p>
          </div>

          {/* Recording simulation widget */}
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center space-y-4">
            {isRecording ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-red-400 opacity-75"></span>
                  <button
                    onClick={() => setIsRecording(false)}
                    className="relative bg-red-600 hover:bg-red-700 text-white p-5 rounded-full transition-all"
                  >
                    <MicOff className="h-6 w-6" />
                  </button>
                </div>
                <div className="text-lg font-mono font-bold text-red-600">
                  {formatDuration(seconds)}
                </div>
                <p className="text-[10px] text-gray-400 animate-pulse">
                  Recording microphone audio... Click button to stop
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <button
                  onClick={() => setIsRecording(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-full shadow-lg shadow-blue-100 transition-all hover:scale-105"
                >
                  <Mic className="h-6 w-6" />
                </button>
                <span className="text-xs font-medium text-gray-600">
                  Start Live Recording
                </span>
                <span className="text-[10px] text-gray-400">- OR -</span>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-50 flex items-center gap-1.5">
                    <FileAudio className="h-4 w-4 text-purple-600" />
                    {file ? file.name : "Upload audio file (.mp3, .wav)"}
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  {file && (
                    <button
                      onClick={() => setFile(null)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Form parameters */}
          <form onSubmit={handleTranscribe} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Session Name / Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. NextJS App Scope Session"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Link to Project (Auto-creates Tasks)
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">Do not link (just transcribe)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>Transcribing & Analyzing with AI...</>
              ) : (
                <>
                  Generate AI Tasks & Summarize <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of meetings */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Recording Archive ({meetings.length})
            </h3>
            {meetings.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center text-xs text-gray-500">
                No meetings recorded yet. Start a new session.
              </div>
            ) : (
              meetings.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMeeting(m)}
                  className={`bg-white border p-4 rounded-xl shadow-sm hover:shadow cursor-pointer transition-all flex justify-between items-start gap-2 ${
                    selectedMeeting?.id === m.id
                      ? "border-blue-600 bg-blue-50/20"
                      : "border-gray-200"
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
                      {m.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(m.created_at).toLocaleDateString()}
                    </div>
                    {m.project?.title && (
                      <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-[10px] px-2 py-0.5 rounded font-medium">
                        <Layers className="h-3 w-3" /> {m.project.title}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(m.id)
                    }}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Details view */}
          <div className="lg:col-span-2">
            {selectedMeeting ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    {selectedMeeting.title}
                  </h2>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Logged on {new Date(selectedMeeting.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Summary */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-purple-600" /> AI Executive Summary
                    </h4>
                    <div className="bg-purple-50/20 border border-purple-100/50 p-4 rounded-xl text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {selectedMeeting.summary}
                    </div>
                  </div>

                  {/* Transcript */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <FileText className="h-4 w-4 text-blue-600" /> Full Transcript
                    </h4>
                    <div className="bg-gray-55/20 border border-gray-200 p-4 rounded-xl text-xs text-gray-500 h-64 overflow-y-auto font-mono whitespace-pre-wrap">
                      {selectedMeeting.transcript}
                    </div>
                  </div>
                </div>

                {selectedMeeting.project_id && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
                    <div className="bg-blue-600 text-white p-2 rounded-lg">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-blue-900">
                        Action Items Exported
                      </h4>
                      <p className="text-[10px] text-blue-700">
                        Extracted tasks have been automatically created inside project:{" "}
                        <strong className="font-semibold">
                          {selectedMeeting.project?.title}
                        </strong>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full bg-white border border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="bg-gray-50 p-4 rounded-full text-gray-400">
                  <Video className="h-8 w-8" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">
                  No Session Selected
                </h3>
                <p className="text-xs text-gray-500 max-w-xs">
                  Choose a meeting from the archive list to review the summary and extracted task points.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
