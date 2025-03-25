'use client'

import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Option {
  label: string
  value: string | number
}

interface CustomSelectProps {
  options: Option[]
  value?: string | number
  onChange?: (value: string | number) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className,
  disabled = false,
}) => {
  const handleChange = (val: string) => {
    const selectedOption = options.find((option) => String(option.value) === val)
    onChange?.(selectedOption?.value ?? val)
  }

  return (
    <Select
      value={value !== undefined ? String(value) : undefined}
      onValueChange={handleChange}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default CustomSelect
