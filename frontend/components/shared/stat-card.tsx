import type React from "react"

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  className?: string
  valueClassName?: string
  formatValue?: (value: number | string) => string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  className = "bg-primary",
  valueClassName = "text-2xl",
  formatValue = (value) => value.toString(),
}) => {
  return (
    <div className={`p-4 rounded-lg text-white flex items-center justify-between ${className}`}>
      <div>
        <div className="text-sm font-light opacity-90 uppercase">{title}</div>
        <div className={`font-bold ${valueClassName}`}>{formatValue(value)}</div>
      </div>
      <div className="text-3xl opacity-80">{icon}</div>
    </div>
  )
}

