'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

interface AutoCompleteProps {
  value?: string
  onChange?: (value: string) => void
  suggestionsList: string[]
}

const fetchSuggestions = async (query: string, list: string[]): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return list.filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase()))
}

export default function Autocomplete({ value = '', onChange, suggestionsList }: AutoCompleteProps) {
  const [query, setQuery] = useState(value)
  const [debouncedQuery] = useDebounce(query, 300)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const fetchSuggestionsCallback = useCallback(
    async (q: string) => {
      if (q.trim() === '') {
        setSuggestions([])
        return
      }
      setIsLoading(true)
      const results = await fetchSuggestions(q, suggestionsList)
      setSuggestions(results)
      setIsLoading(false)
    },
    [suggestionsList]
  )

  useEffect(() => {
    if (debouncedQuery && isFocused) {
      fetchSuggestionsCallback(debouncedQuery)
    } else {
      setSuggestions([])
    }
  }, [debouncedQuery, fetchSuggestionsCallback, isFocused])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setQuery(newValue)
    onChange?.(newValue)
    setSelectedIndex(-1)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    onChange?.(suggestion)
    setSuggestions([])
    setSelectedIndex(-1)
  }

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pr-10"
        />
        <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      {isLoading && isFocused && (
        <div className="mt-2 p-2 bg-background border rounded-md">Loading...</div>
      )}
      {suggestions.length > 0 && isFocused && (
        <ul className="mt-2 bg-background border rounded-md shadow-sm absolute z-10">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              className={`px-4 py-2 cursor-pointer hover:bg-muted ${
                index === selectedIndex ? 'bg-muted' : ''
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
