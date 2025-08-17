import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

const ToastItem: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onRemove(toast.id), 300)
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-metal-green" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-metal-red" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-metal-yellow" />
      case 'info':
        return <Info className="w-5 h-5 text-metal-blue" />
      default:
        return <Info className="w-5 h-5 text-metal-blue" />
    }
  }

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-metal-green/30'
      case 'error':
        return 'border-metal-red/30'
      case 'warning':
        return 'border-metal-yellow/30'
      case 'info':
        return 'border-metal-blue/30'
      default:
        return 'border-metal-border'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`bg-metal-card border ${getBorderColor()} rounded-2xl shadow-2xl p-4 min-w-[320px] max-w-[400px]`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-metal-text">
            {toast.title}
          </p>
          {toast.message && (
            <p className="mt-1 text-sm text-metal-text-secondary">
              {toast.message}
            </p>
          )}
        </div>
        
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onRemove(toast.id), 300)
          }}
          className="flex-shrink-0 text-metal-text-secondary hover:text-metal-text transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-3 w-full bg-metal-border rounded-full h-1 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-metal-orange to-metal-accent"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: (toast.duration || 5000) / 1000, ease: "linear" }}
        />
      </div>
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-[var(--z-toast)] space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook para usar toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    setToasts(prev => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const showSuccess = (title: string, message?: string, duration?: number) => {
    addToast({ type: 'success', title, message, duration })
  }

  const showError = (title: string, message?: string, duration?: number) => {
    addToast({ type: 'error', title, message, duration })
  }

  const showWarning = (title: string, message?: string, duration?: number) => {
    addToast({ type: 'warning', title, message, duration })
  }

  const showInfo = (title: string, message?: string, duration?: number) => {
    addToast({ type: 'info', title, message, duration })
  }

  return {
    toasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast
  }
}
