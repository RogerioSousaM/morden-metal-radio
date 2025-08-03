import SearchBar from './SearchBar'
import FilterSelect from './FilterSelect'

interface FilterOption {
  value: string
  label: string
}

interface SearchFiltersProps {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  filterOptions?: FilterOption[]
  filterValue?: string
  onFilterChange?: (value: string) => void
  filterPlaceholder?: string
  className?: string
}

const SearchFilters = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filterOptions = [],
  filterValue = "",
  onFilterChange,
  filterPlaceholder = "Filtrar por...",
  className = ""
}: SearchFiltersProps) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 mb-6 search-filters-container search-filters ${className}`}>
      <SearchBar
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={onSearchChange}
      />
      {filterOptions.length > 0 && onFilterChange && (
        <FilterSelect
          options={filterOptions}
          value={filterValue}
          onChange={onFilterChange}
          placeholder={filterPlaceholder}
        />
      )}
    </div>
  )
}

export default SearchFilters 