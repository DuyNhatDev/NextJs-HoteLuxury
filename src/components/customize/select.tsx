'use client'

import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Option = {
  label: string
  value: string | number | boolean
}

type CustomSelectProps = {
  options: Option[]
  value?: string | number | boolean
  onChange?: (value: string | number | boolean) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className,
  disabled = false
}: CustomSelectProps) => {
  const handleChange = (val: string) => {
    const selectedOption = options.find((option) => String(option.value) === val)

    if (selectedOption) {
      if (typeof selectedOption.value === 'boolean') {
        onChange?.(selectedOption.value)
      } else if (typeof selectedOption.value === 'number') {
        onChange?.(Number(selectedOption.value))
      } else {
        onChange?.(selectedOption.value)
      }
    }
  }

  return (
    <Select value={value !== undefined ? String(value) : undefined} onValueChange={handleChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={String(option.value)} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default CustomSelect
