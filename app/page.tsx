import Link from "next/link"
import {
  Zap,
  Target,
  Clock,
  DollarSign,
  Users,
  Brain,
  Shield,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  ArrowLeftRight,
} from "lucide-react"

const features = [
  {
    icon: Target,
    title: "Smart Bid Assistant",
    description:
      "AI writes winning proposals for ANY job in 60 seconds. Track all bids across Upwork, Fiverr and more.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    tag: "Most Used",
  },
  {
    icon: Brain,
    title: "AI Project Executor",
    description:
      "Win any project even outside your expertise. AI breaks it into steps with resources and tools.",
    color: "text-purple-600",
    bg: "bg-purple-50",
    tag: "Most Unique",
  },
  {
    icon: Clock,
    title: "Deadline Tracker",
    description:
      "Never miss a deadline. Smart reminders, workload manager and calendar view for all projects.",
    color: "text-green-600",
    bg: "bg-green-50",
    tag: "",
  },
  {
    icon: DollarSign,
    title: "Earnings & Invoicing",
    description:
      "Professional invoices, online payments, USA tax assistant and earnings dashboard.",
    color: "text-orange-600",
    bg: "bg-orange-50",
    tag: "USA Specific",
  },
  {
    icon: Users,
    title: "Client Management",
    description:
      "CRM built for freelancers. Client portal, scope creep detector and communication hub.",
    color: "text-red-600",
    bg: "bg-red-50",
    tag: "",
  },
  {
    icon: Shield,
    title: "Niche Starter Kits",
    description:
      "50+ niche starter kits. Pick any niche and get tools, pricing, templates and first client strategy.",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    tag: "Game Changer",
  },
]

const stats = [
  { value: "59M+", label: "Freelancers in USA" },
  { value: "$0", label: "Cost to Start" },
  { value: "50+", label: "Niche Starter Kits" },
  { value: "10x", label: "Faster Proposals" },
]

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect to get started",
    features: [
      "2 Active Projects",
      "3 Clients",
      "5 AI Proposals/month",
      "Basic Time Tracking",
      "Basic Invoicing",
      "Community Access",
    ],
    cta: "Start Free",
    popular: false,
    color: "border-gray-200",
  },
  {
    name: "Starter",
    price: "$19",
    period: "month",
    description: "For growing freelancers",
    features: [
      "10 Active Projects",
      "20 Clients",
      "50 AI Proposals/month",
      "All Niche Starter Kits",
      "USA Tax Assistant",
      "Client Portal",
      "Email Support",
    ],
    cta: "Start Free Trial",
    popular: false,
    color: "border-gray-200",
  },
  {
    name: "Professional",
    price: "$49",
    period: "month",
    description: "Most popular choice",
    features: [
      "Unlimited Everything",
      "Unlimited AI Proposals",
      "AI Project Executor",
      "Scope Creep Protector",
      "Portfolio Website",
      "All Integrations",
      "Priority Support",
      "Mentorship Access",
    ],
    cta: "Start Free Trial",
    popular: true,
    color: "border-blue-600",
  },
  {
    name: "Agency",
    price: "$99",
    period: "month",
    description: "For freelancers with team",
    features: [
      "Everything in Pro",
      "5 Team Members",
      "White Label Portal",
      "Expert Marketplace",
      "Advanced Analytics",
      "Account Manager",
    ],
    cta: "Start Free Trial",
    popular: false,
    color: "border-gray-200",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Freelance Developer, Texas",
    text: "I went from making $2k/month to $8k/month in 3 months. The AI bid writer alone paid for itself 100x over.",
    rating: 5,
  },
  {
    name: "Mike Chen",
    role: "Freelance Designer, California",
    text: "I was scared to take design projects outside my niche. Now I use AI Project Executor and deliver everything perfectly.",
    rating: 5,
  },
  {
    name: "Jessica Martinez",
    role: "Virtual Assistant, Florida",
    text: "The USA tax assistant saved me $800 in accountant fees. This platform genuinely cares about freelancers.",
    rating: 5,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <ArrowLeftRight className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                FreelancerOS
              </span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium ml-1">
                USA
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">
                Features
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">
                Pricing
              </a>
              <a href="#testimonials" className="text-sm text-gray-600 hover:text-gray-900">
                Reviews
              </a>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Zap className="h-4 w-4" />
            AI-Powered Platform for USA Freelancers
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Pick Any Niche.
            <br />
            <span className="text-blue-600">Win Any Project.</span>
            <br />
            Deliver Like a Pro.
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            You do not need to be an expert in everything. FreelancerOS helps
            you bid, plan, execute and deliver ANY type of freelance project
            successfully — with AI by your side every step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              Start For Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              View Live Demo
            </Link>
          </div>
          <p className="text-sm text-gray-400">
            No credit card required · Free forever plan · Cancel anytime
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 px-6 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold text-blue-600 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stop using 6 different tools. FreelancerOS gives you everything
              in one place — with AI that actually helps you work.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${feature.bg} w-12 h-12 rounded-xl flex items-center justify-center`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  {feature.tag && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                      {feature.tag}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title
}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 mb-16">
            From zero to earning — in 4 simple steps
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Pick a Niche", desc: "Choose from 50+ niche starter kits or any skill you have", icon: Target },
              { step: "02", title: "Win Projects", desc: "AI writes winning proposals. Track all bids in one place", icon: Brain },
              { step: "03", title: "Deliver Work", desc: "AI breaks project into steps. Never miss a deadline", icon: Clock },
              { step: "04", title: "Get Paid", desc: "Send invoices, collect payments and track your earnings", icon: DollarSign },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-xs font-bold text-blue-600 mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by USA Freelancers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  "{t.text}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free. Upgrade when you are ready.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl p-6 border-2 ${plan.color} ${plan.popular ? "shadow-2xl scale-105" : ""} relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {plan.name
}
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 text-sm">/{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  className={`block text-center py-2.5 px-4 rounded-xl font-medium text-sm transition-colors ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Freelance Career?
          </h2>
          <p className="text-blue-100 text-xl mb-8">
            Join thousands of USA freelancers already using FreelancerOS
            to earn more and stress less.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition-colors"
          >
            Start For Free Today
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-blue-200 text-sm mt-4">
            No credit card required
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <ArrowLeftRight className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FreelancerOS</span>
            </div>
            <p className="text-sm">
              © 2024 FreelancerOS. Built for USA Freelancers.
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
