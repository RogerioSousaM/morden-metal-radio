import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, X, Eye, EyeOff, RotateCcw } from 'lucide-react'
import { useToast } from './ui/Toast'
import { useConfirmModal } from './ui/ConfirmModal'

interface AdminEditLayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  previewContent?: React.ReactNode
  onSave: () => Promise<void>
  onCancel?: () => void
  onReset?: () => void
  isSaving?: boolean
  hasChanges?: boolean
  showPreview?: boolean
  onTogglePreview?: (show: boolean) => void
}

export const AdminEditLayout: React.FC<AdminEditLayoutProps> = ({
  title,
  subtitle,
  children,
  previewContent,
  onSave,
  onCancel,
  onReset,
  isSaving = false,
  hasChanges = false,
  showPreview = false,
  onTogglePreview
}) => {
  const { showSuccess, showError } = useToast()
  const { showConfirm } = useConfirmModal()
  const [isPreviewVisible, setIsPreviewVisible] = useState(showPreview)

  const handleSave = async () => {
    try {
      await onSave()
      showSuccess('Salvo com sucesso!', 'As alterações foram aplicadas')
    } catch (error) {
      showError('Erro ao salvar', error instanceof Error ? error.message : 'Erro desconhecido')
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      showConfirm(
        'Descartar alterações?',
        'Tem certeza que deseja descartar todas as alterações não salvas?',
        () => onCancel?.()
      )
    } else {
      onCancel?.()
    }
  }

  const handleReset = () => {
    showConfirm(
      'Resetar formulário?',
      'Tem certeza que deseja resetar todos os campos para os valores originais?',
      () => onReset?.()
    )
  }

  const togglePreview = () => {
    const newValue = !isPreviewVisible
    setIsPreviewVisible(newValue)
    onTogglePreview?.(newValue)
  }

  return (
    <div className="min-h-screen bg-metal-dark">
      {/* Header */}
      <header className="bg-metal-card border-b border-metal-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 text-metal-text">{title}</h1>
            {subtitle && (
              <p className="text-body-small text-metal-text-secondary mt-1">
                {subtitle}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Preview Toggle */}
            {previewContent && (
              <button
                onClick={togglePreview}
                className="btn-ghost flex items-center space-x-2"
              >
                {isPreviewVisible ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>Ocultar Preview</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Mostrar Preview</span>
                  </>
                )}
              </button>
            )}
            
            {/* Reset Button */}
            {onReset && (
              <button
                onClick={handleReset}
                className="btn-secondary flex items-center space-x-2"
                disabled={!hasChanges}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Resetar</span>
              </button>
            )}
            
            {/* Cancel Button */}
            {onCancel && (
              <button
                onClick={handleCancel}
                className="btn-secondary"
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </button>
            )}
            
            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Salvando...' : 'Salvar'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Form Section */}
        <motion.div
          layout
          className={`flex-1 overflow-auto p-6 transition-all duration-300 ${
            isPreviewVisible ? 'w-1/2' : 'w-full'
          }`}
        >
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Form Fields */}
            <div className="space-y-6">
              {children}
            </div>
            
            {/* Save Status */}
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-metal-accent/10 border border-metal-accent/20 rounded-xl p-4"
              >
                <p className="text-sm text-metal-accent font-medium">
                  ⚠️ Você tem alterações não salvas
                </p>
                <p className="text-xs text-metal-accent/70 mt-1">
                  Clique em "Salvar" para aplicar as alterações
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Preview Section */}
        {previewContent && isPreviewVisible && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="w-1/2 bg-metal-black border-l border-metal-border overflow-auto"
          >
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-h3 text-metal-text mb-2">Preview</h3>
                <p className="text-body-small text-metal-text-secondary">
                  Visualização em tempo real das alterações
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {previewContent}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Componente de exemplo para campos de formulário
export const FormField: React.FC<{
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
  helpText?: string
}> = ({ label, required, error, children, helpText }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-metal-text">
        {label}
        {required && <span className="text-metal-red ml-1">*</span>}
      </label>
      
      {children}
      
      {helpText && (
        <p className="text-xs text-metal-text-secondary">
          {helpText}
        </p>
      )}
      
      {error && (
        <p className="text-sm text-metal-red">
          {error}
        </p>
      )}
    </div>
  )
}

// Componente de exemplo para seções de formulário
export const FormSection: React.FC<{
  title: string
  description?: string
  children: React.ReactNode
}> = ({ title, description, children }) => {
  return (
    <div className="card-base p-6 space-y-4">
      <div>
        <h3 className="text-h3 text-metal-text">{title}</h3>
        {description && (
          <p className="text-body-small text-metal-text-secondary mt-1">
            {description}
          </p>
        )}
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

// Componente de exemplo para grid de campos
export const FormGrid: React.FC<{
  columns?: 1 | 2 | 3
  children: React.ReactNode
  gap?: 'sm' | 'md' | 'lg'
}> = ({ columns = 2, children, gap = 'md' }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }
  
  const gridGap = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  }
  
  return (
    <div className={`grid ${gridCols[columns]} ${gridGap[gap]}`}>
      {children}
    </div>
  )
}
