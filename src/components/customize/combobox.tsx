'use client'
import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown, Undo2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface ComboboxProps {
  items: { value: string | number; label: string }[]
  value?: string | number
  placeholder?: string
  onChange?: (value: string | number) => void
  disabled?: boolean
  className?: string
  showReset?: boolean
}

export default function Combobox({
  items,
  value = '',
  placeholder = 'Select an option...',
  onChange,
  disabled = false,
  className = '',
  showReset = true,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value)

  useEffect(() => {
    setSelectedValue(value)
  }, [value])

  const handleSelect = (currentValue: string | number) => {
    if (disabled) return
    const newValue = currentValue === selectedValue ? '' : currentValue
    setSelectedValue(newValue)
    setOpen(false)
    onChange?.(newValue)
  }

  const handleReset = () => {
    setSelectedValue('')
    setOpen(false)
    onChange?.('')
  }

  return (
    <Popover open={open} onOpenChange={(state) => !disabled && setOpen(state)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-[200px] justify-between', className)}
          disabled={disabled}
        >
          {selectedValue ? items.find((item) => item.value === selectedValue)?.label : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-[200px] p-0', className)}>
        <Command>
          <CommandInput placeholder="Search..." className="h-9" disabled={disabled} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {showReset && (
                <CommandItem onSelect={handleReset}>
                  <Undo2 className="mr-2 h-4 w-4" /> Đặt lại lựa chọn
                </CommandItem>
              )}
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => handleSelect(item.value)}
                  data-value={item.value}
                  className={cn(disabled && 'pointer-events-none opacity-50')}
                >
                  {item.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      selectedValue === item.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
