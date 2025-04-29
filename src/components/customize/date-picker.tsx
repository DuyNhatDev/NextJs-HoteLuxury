'use client'

import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { format as formatDate } from 'date-fns'
import { vi } from 'date-fns/locale'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DatePickerButtonProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  format?: string
}

export default function DatePickerButton({
  value,
  onChange,
  placeholder = 'Chọn ngày',
  className,
  disabled = false,
  format = 'dd/MM/yyyy'
}: DatePickerButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' disabled={disabled} className={cn('w-[200px] justify-between', className)}>
          <span className={cn(!value && 'text-gray-400')}>{value ? formatDate(value, format) : placeholder}</span>
          <CalendarIcon className='ml-2 h-4 w-4 text-gray-500' />
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-auto rounded-lg p-4 shadow-md' align='center'>
        <DayPicker
          mode='single'
          selected={value}
          onSelect={(date) => {
            onChange?.(date)
            setOpen(false)
          }}
          locale={vi}
          captionLayout='dropdown'
          defaultMonth={value || new Date()}
        />
      </PopoverContent>
    </Popover>
  )
}
