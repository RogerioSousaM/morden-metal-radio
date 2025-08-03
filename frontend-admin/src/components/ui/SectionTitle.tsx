import { LucideIcon } from 'lucide-react'

interface SectionTitleProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  className?: string
}

const SectionTitle = ({ title, subtitle, icon: Icon, className = "" }: SectionTitleProps) => {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        {Icon && (
          <div className="w-8 h-8 bg-metal-orange/20 rounded-lg flex items-center justify-center">
            <Icon className="w-4 h-4 text-metal-orange" />
          </div>
        )}
        <h2 className="text-xl font-semibold text-metal-text">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-sm text-metal-text-secondary">{subtitle}</p>
      )}
    </div>
  )
}

export default SectionTitle 