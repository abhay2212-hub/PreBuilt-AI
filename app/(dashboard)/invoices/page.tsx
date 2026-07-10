"use client"

import { useState, useEffect } from "react"
import { Plus, FileText, CheckCircle, Clock, AlertCircle, DollarSign, Download, Send, Trash } from "lucide-react"
import Badge from "@/components/ui/Badge"
import Modal from "@/components/ui/Modal"
import { Invoice, InvoiceStatus, Client } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"

const initialInvoices: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2024-001",
    status: "PAID",
    client: {
      id: "cli-1",
      name: "Alex Rivera",
      email: "alex@techcorp.com",
      company: "TechCorp Inc",
      totalRevenue: 12500,
      healthScore: 95,
      paymentScore: 90,
      tags: [],
      createdAt: new Date()
    },
    total: 3500,
    issueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    currency: "USD",
    items: []
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2024-002",
    status: "SENT",
    client: {
      id: "cli-2",
      name: "Jessica Smith",
      email: "jessica@startupxyz.com",
      company: "StartupXYZ",
      totalRevenue: 2400,
      healthScore: 78,
      paymentScore: 85,
      tags: [],
      createdAt: new Date()
    },
    total: 800,
    issueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    currency: "USD",
    items: []
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-2024-003",
    status: "OVERDUE",
    client: {
      id: "cli-3",
      name: "Marcus Vance",
      email: "marcus@appcollc.co",
      company: "AppCo LLC",
      totalRevenue: 5000,
      healthScore: 45,
      paymentScore: 60,
      tags: [],
      createdAt: new Date()
    },
    total: 2500,
    issueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    currency: "USD",
    items: []
  }
]

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [clients, setClients] = useState<Client[]>([])

  // Form State
  const [clientSelect, setClientSelect] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [dueDate, setDueDate] = useState("")

  useEffect(() => {
    // Load invoices
    const savedInvs = localStorage.getItem("freelancer_os_invoices")
    if (savedInvs) {
      try {
        setInvoices(JSON.parse(savedInvs).map((i: any) => ({
          ...i,
          issueDate: new Date(i.issueDate),
          dueDate: new Date(i.dueDate)
        })))
      } catch {
        setInvoices(initialInvoices)
      }
    } else {
      setInvoices(initialInvoices)
    }

    // Load clients for dropdown selection
    const savedCli = localStorage.getItem("freelancer_os_clients")
    if (savedCli) {
      try {
        setClients(JSON.parse(savedCli))
      } catch {
        setClients([])
      }
    }
  }, [])

  const saveInvoices = (newInvs: Invoice[]) => {
    setInvoices(newInvs)
    localStorage.setItem("freelancer_os_invoices", JSON.stringify(newInvs))
  }

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientSelect || !amount || !dueDate) return

    // Find selected client details
    const selectedClientObj = clients.find(c => c.id === clientSelect) || {
      id: "unknown",
      name: clientSelect,
      email: "billing@client.com",
      totalRevenue: 0,
      healthScore: 100,
      paymentScore: 100,
      tags: [],
      createdAt: new Date()
    }

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invoiceNumber || `INV-2024-${Math.floor(100 + Math.random() * 900)}`,
      status: "SENT",
      client: selectedClientObj,
      total: parseFloat(amount),
      issueDate: new Date(),
      dueDate: new Date(dueDate),
      currency: "USD",
      items: []
    }

    // Update clients total revenue
    if (selectedClientObj.id !== "unknown") {
      const updatedClients = clients.map(c => c.id === selectedClientObj.id ? { ...c, totalRevenue: c.totalRevenue + parseFloat(amount) } : c)
      localStorage.setItem("freelancer_os_clients", JSON.stringify(updatedClients))
    }

    const updatedInvs = [newInvoice, ...invoices]
    saveInvoices(updatedInvs)
    setIsAddOpen(false)

    // Reset Form
    setClientSelect("")
    setInvoiceNumber("")
    setAmount("")
    setDueDate("")
  }

  const handleDeleteInvoice = (id: string) => {
    const updated = invoices.filter(inv => inv.id !== id)
    saveInvoices(updated)
  }

  const handleMarkAsPaid = (id: string) => {
    const updated = invoices.map(inv => inv.id === id ? { ...inv, status: "PAID" as InvoiceStatus } : inv)
    saveInvoices(updated)
  }

  // Summary Metrics
  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.total, 0)
  const totalPaid = invoices.filter(inv => inv.status === "PAID").reduce((acc, inv) => acc + inv.total, 0)
  const totalUnpaid = invoices.filter(inv => ["SENT", "VIEWED"].includes(inv.status)).reduce((acc, inv) => acc + inv.total, 0)
  const totalOverdue = invoices.filter(inv => inv.status === "OVERDUE" || (inv.status !== "PAID" && new Date(inv.dueDate) < new Date())).reduce((acc, inv) => acc + inv.total, 0)

  const statusVariants: Record<string, "success" | "warning" | "danger" | "info" | "neutral" | "purple"> = {
    DRAFT: "neutral",
    SENT: "info",
    VIEWED: "purple",
    PAID: "success",
    OVERDUE: "danger",
    CANCELLED: "danger"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings & Invoicing</h1>
          <p className="text-gray-500 mt-1">Generate invoices, collect payments, and track billing history.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          Create Invoice
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Invoiced</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalInvoiced)}</p>
          </div>
          <div className="bg-blue-50 p-2.5 rounded-xl">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Received</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalPaid)}</p>
          </div>
          <div className="bg-green-50 p-2.5 rounded-xl">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Unpaid</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalUnpaid)}</p>
          </div>
          <div className="bg-purple-50 p-2.5 rounded-xl">
            <Clock className="h-5 w-5 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Overdue Balance</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalOverdue)}</p>
          </div>
          <div className="bg-red-50 p-2.5 rounded-xl">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Billing History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-3">Invoice Number</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Issue Date</th>
                <th className="px-6 py-3">Due Date</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 text-sm">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{inv.client.name}</div>
                      {inv.client.company && <div className="text-xs text-gray-400">{inv.client.company}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(inv.issueDate)}</td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(inv.dueDate)}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{formatCurrency(inv.total)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={statusVariants[inv.status] || "neutral"}>{inv.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inv.status !== "PAID" && (
                        <button
                          onClick={() => handleMarkAsPaid(inv.id)}
                          className="text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 px-2.5 py-1 rounded transition-colors cursor-pointer"
                        >
                          Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteInvoice(inv.id)}
                        className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-gray-100 transition-all cursor-pointer"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    No invoices raised yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Invoice */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Generate New Invoice">
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Invoice Number</label>
            <input
              type="text"
              placeholder="e.g. INV-2024-004 (Leave blank to auto-generate)"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Select Client</label>
            <select
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={clientSelect}
              onChange={(e) => setClientSelect(e.target.value)}
            >
              <option value="">-- Choose CRM Client --</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ""}</option>
              ))}
              {clients.length === 0 && (
                <option value="Manual Client">Manual Bill Client</option>
              )}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Total Bill Amount ($)</label>
              <input
                type="number"
                required
                placeholder="e.g. 2000"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Payment Due Date</label>
              <input
                type="date"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm mt-2 transition-colors cursor-pointer"
          >
            Create & Send Invoice
          </button>
        </form>
      </Modal>
    </div>
  )
}
