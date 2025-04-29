'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

type AutoCompleteProps = {
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
    <div className='mx-auto w-full max-w-xs'>
      <div className='relative'>
        <Input
          type='text'
          placeholder='Search...'
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className='pr-10'
        />
        <Button size='icon' variant='ghost' className='absolute top-0 right-0 h-full'>
          <Search className='h-4 w-4' />
        </Button>
      </div>
      {isLoading && isFocused && <div className='bg-background mt-2 rounded-md border p-2'>Loading...</div>}
      {suggestions.length > 0 && isFocused && (
        <ul className='bg-background absolute z-10 mt-2 rounded-md border shadow-sm'>
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              className={`hover:bg-muted cursor-pointer px-4 py-2 ${index === selectedIndex ? 'bg-muted' : ''}`}
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
