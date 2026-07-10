interface BadgeProps {
  children: React.ReactNode
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "purple"
}

export default function Badge({ children, variant = "neutral" }: BadgeProps) {
  const styles = {
    success: "text-green-700 bg-green-50 border-green-200",
    warning: "text-yellow-700 bg-yellow-50 border-yellow-200",
    danger: "text-red-700 bg-red-50 border-red-200",
    info: "text-blue-700 bg-blue-50 border-blue-200",
    purple: "text-purple-700 bg-purple-50 border-purple-200",
    neutral: "text-gray-700 bg-gray-50 border-gray-200",
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[variant]}`}
    >
      {children}
    </span>
  )
}
