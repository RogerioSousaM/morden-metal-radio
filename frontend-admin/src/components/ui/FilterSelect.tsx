import { Filter } from 'lucide-react'

interface FilterOption {
  value: string
  label: string
}

interface FilterSelectProps {
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const FilterSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Filtrar por...", 
  className = "" 
}: FilterSelectProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Filter className="w-4 h-4 text-metal-text-secondary" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-select"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FilterSelect 