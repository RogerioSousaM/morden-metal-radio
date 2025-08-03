import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface ActionButtonProps {
  label: string
  onClick: () => void
  icon?: LucideIcon
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  loading?: boolean
  className?: string
}

const ActionButton = ({
  label,
  onClick,
  icon: Icon,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = ""
}: ActionButtonProps) => {
  const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200"
  
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary", 
    danger: "bg-red-600 hover:bg-red-700 text-white disabled:bg-red-600/50"
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {loading ? 'Carregando...' : label}
    </motion.button>
  )
}

export default ActionButton 