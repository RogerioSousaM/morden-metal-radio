import { Search } from 'lucide-react'

interface SearchBarProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  className?: string
}

const SearchBar = ({ placeholder = "Buscar...", value, onChange, className = "" }: SearchBarProps) => {
  return (
    <div className={`relative flex-1 ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-metal-text-secondary" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input pl-10 w-full"
      />
    </div>
  )
}

export default SearchBar 