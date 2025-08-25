import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

const ToastItem = ({ toast, onRemove }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onRemove(toast.id), 300) // Remove after animation
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-error" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warning" />
      case 'info':
        return <Info className="w-5 h-5 text-info" />
      default:
        return <Info className="w-5 h-5 text-info" />
    }
  }

  const getToastStyle = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-success/10 border-success/20 text-success'
      case 'error':
        return 'bg-error/10 border-error/20 text-error'
      case 'warning':
        return 'bg-warning/10 border-warning/20 text-warning'
      case 'info':
        return 'bg-info/10 border-info/20 text-info'
      default:
        return 'bg-info/10 border-info/20 text-info'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg border shadow-lg bg-surface border-surface-lighter ${getToastStyle()}`}
        >
          <div className="flex items-start gap-3">
            {getIcon()}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-sm mt-1 opacity-90">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => onRemove(toast.id), 300)
              }}
              className="text-muted hover:text-primary transition-colors"
              aria-label="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

// Hook para usar o sistema de toast
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (type: ToastType, title: string, message?: string, duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = { id, type, title, message, duration }
    setToasts(prev => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const showSuccess = (title: string, message?: string) => {
    addToast('success', title, message)
  }

  const showError = (title: string, message?: string) => {
    addToast('error', title, message)
  }

  const showWarning = (title: string, message?: string) => {
    addToast('warning', title, message)
  }

  const showInfo = (title: string, message?: string) => {
    addToast('info', title, message)
  }

  return {
    toasts,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

export default ToastContainer
