import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { Plus, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

interface PageLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
  backTo?: string
  backLabel?: string
  actions?: ReactNode
  showAddButton?: boolean
  onAddClick?: () => void
  addButtonLabel?: string
  loading?: boolean
}

const PageLayout = ({
  title,
  subtitle,
  children,
  backTo,
  backLabel = 'Voltar',
  actions,
  showAddButton = false,
  onAddClick,
  addButtonLabel = 'Adicionar',
  loading = false
}: PageLayoutProps) => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start justify-between"
      >
        <div className="space-y-3">
          {/* Back button */}
          {backTo && (
            <Link
              to={backTo}
              className="inline-flex items-center gap-2 text-sm text-metal-text-secondary hover:text-metal-orange transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {backLabel}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-metal-text-secondary max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {actions}
          {showAddButton && onAddClick && (
            <motion.button
              onClick={onAddClick}
              className="btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              {addButtonLabel}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Loading state */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-12"
        >
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4" />
            <p className="text-metal-text-secondary">Carregando...</p>
          </div>
        </motion.div>
      )}

      {/* Content */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}

export default PageLayout 