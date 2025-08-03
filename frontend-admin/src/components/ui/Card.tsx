import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
  delay?: number
}

const Card = ({ children, className = '', onClick, hover = false, delay = 0 }: CardProps) => {
  const baseClasses = 'card'
  const combinedClasses = `${baseClasses} ${className}`

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3, 
        delay,
        ease: "easeOut"
      }
    }
  }

  const hoverVariants = hover ? {
    hover: { 
      y: -4,
      transition: { duration: 0.2 }
    }
  } : {}

  return (
    <motion.div
      variants={{ ...cardVariants, ...hoverVariants }}
      initial="hidden"
      animate="visible"
      whileHover={hover ? "hover" : undefined}
      onClick={onClick}
      className={`${combinedClasses} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {children}
    </motion.div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export const CardHeader = ({ children, className = '' }: CardHeaderProps) => (
  <div className={`card-header ${className}`}>
    {children}
  </div>
)

interface CardTitleProps {
  children: ReactNode
  className?: string
}

export const CardTitle = ({ children, className = '' }: CardTitleProps) => (
  <h3 className={`card-title ${className}`}>
    {children}
  </h3>
)

interface CardSubtitleProps {
  children: ReactNode
  className?: string
}

export const CardSubtitle = ({ children, className = '' }: CardSubtitleProps) => (
  <p className={`card-subtitle ${className}`}>
    {children}
  </p>
)

interface CardContentProps {
  children: ReactNode
  className?: string
}

export const CardContent = ({ children, className = '' }: CardContentProps) => (
  <div className={className}>
    {children}
  </div>
)

interface CardActionsProps {
  children: ReactNode
  className?: string
}

export const CardActions = ({ children, className = '' }: CardActionsProps) => (
  <div className={`flex items-center justify-end gap-3 pt-4 border-t border-metal-border ${className}`}>
    {children}
  </div>
)

export default Card 