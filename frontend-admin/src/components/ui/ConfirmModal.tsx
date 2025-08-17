import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'text-metal-red',
          button: 'btn-destructive',
          border: 'border-metal-red/30'
        }
      case 'warning':
        return {
          icon: 'text-metal-yellow',
          button: 'btn-secondary',
          border: 'border-metal-yellow/30'
        }
      case 'info':
        return {
          icon: 'text-metal-blue',
          button: 'btn-primary',
          border: 'border-metal-blue/30'
        }
      default:
        return {
          icon: 'text-metal-red',
          button: 'btn-destructive',
          border: 'border-metal-red/30'
        }
    }
  }

  const styles = getVariantStyles()

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--z-modal-backdrop)]"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4"
          >
            <div className={`bg-metal-card border ${styles.border} rounded-2xl shadow-2xl max-w-md w-full mx-4`}>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-metal-border">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl bg-metal-dark/50`}>
                    <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
                  </div>
                  <h3 className="text-h3 text-metal-text">
                    {title}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="text-metal-text-secondary hover:text-metal-text transition-colors duration-200 p-1 rounded-lg hover:bg-metal-dark/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <p className="text-body text-metal-text-secondary">
                  {message}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-metal-border">
                <button
                  onClick={onClose}
                  className="btn-secondary"
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className={styles.button}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Hook para usar o modal de confirmação
export const useConfirmModal = () => {
  const [confirmModal, setConfirmModal] = React.useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    variant?: 'danger' | 'warning' | 'info'
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'danger'
  })

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    variant: 'danger' | 'warning' | 'info' = 'danger'
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      variant
    })
  }

  const hideConfirm = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }))
  }

  return {
    confirmModal,
    showConfirm,
    hideConfirm
  }
}
