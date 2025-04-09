'use client'

import DateRangePicker from '@/components/customize/date-range-picker'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { Popover } from '@/components/ui/popover'
import { useRef, useState } from 'react'

export default function SearchForm() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSelect = (value: string) => {
    setSearch(value)
    setOpen(false)
  }

  const handleFocus = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const handleBlur = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false)
    }, 100)
  }

  const staticData = ['Calendar', 'Search Emoji', 'Calculator', 'Profile', 'Billing', 'Settings']

  const filtered = staticData.filter((item) => item.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-11/12 max-w-xl rounded-md bg-gray-200 p-3 shadow-lg">
        <DateRangePicker placeholder="Chọn khoảng thời gian" className="z-10 w-full" />
        <Popover open={open}>
          <div>
            <Command className="rounded-lg border shadow-md md:min-w-[450px]">
              <CommandInput
                value={search}
                onValueChange={(val) => setSearch(val)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Tìm kiếm..."
              />
              <CommandList>
                {filtered.length === 0 ? (
                  <CommandEmpty>No results found.</CommandEmpty>
                ) : (
                  <>
                    <CommandGroup heading="Suggestions">
                      {filtered.slice(0, 3).map((item) => (
                        <CommandItem key={item} onSelect={() => handleSelect(item)}>
                          <span>{item}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                      {filtered.slice(3).map((item) => (
                        <CommandItem key={item} onSelect={() => handleSelect(item)}>
                          <span>{item}</span>
                          <CommandShortcut>
                            {item === 'Profile' && '⌘P'}
                            {item === 'Billing' && '⌘B'}
                            {item === 'Settings' && '⌘S'}
                          </CommandShortcut>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </div>
        </Popover>
      </div>
    </div>
  )
}
