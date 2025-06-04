'use client'

import { useIsMobile } from '@/hooks/ui/use-mobile'
import { useState, useEffect } from 'react'
import { DayPicker, DateRange } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { format as formatDate, addDays } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type DateRangePickerProps = {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  format?: string
  fromDate?: Date
  toDate?: Date
}

export default function DateRangePicker({
  value,
  onChange,
  placeholder = 'Chọn khoảng ngày',
  className,
  disabled = false,
  fromDate,
  toDate
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()

  const defaultRange: DateRange = {
    from: fromDate || new Date(),
    to: toDate || addDays(fromDate || new Date(), 1)
  }

  const [internalRange, setInternalRange] = useState<DateRange | undefined>(value || defaultRange)

  useEffect(() => {
    if (value) {
      setInternalRange(value)
    }
  }, [value])

  const handleSelect = (range: DateRange | undefined) => {
    setInternalRange(range)
    onChange?.(range)
  }

  const formatDay = (date?: Date) => {
    if (!date) return ''
    return formatDate(date, 'dd/MM/yyyy', { locale: vi })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          disabled={disabled}
          className={cn('flex items-center justify-center gap-1 border px-2 py-0', className)}
        >
          {internalRange?.from ? (
            <>
              <div className='flex h-full items-center gap-2 pl-2'>
                <CalendarIcon className='!h-4 !w-4 text-gray-500' />
                <span className='text-[15px] font-medium'>{formatDay(internalRange.from)}</span>
              </div>
              <div>-</div>
              {internalRange.to ? (
                <div className='flex h-full items-center gap-2 pr-2'>
                  <span className='text-[15px] font-medium'>{formatDay(internalRange.to)}</span>
                </div>
              ) : (
                <span className='text-sm text-gray-400'>Chọn ngày kết thúc</span>
              )}
            </>
          ) : (
            <>
              <CalendarIcon className='!h-4 !w-4 text-gray-500' />
              <span className='text-sm text-gray-400'>{placeholder}</span>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={`w-auto rounded-lg p-0 shadow-md ${isMobile ? 'max-h-[500px] overflow-y-auto' : ''}`}
        align='center'
      >
        <div className='scale-[0.95] text-sm'>
          <DayPicker
            mode='range'
            selected={internalRange}
            onSelect={handleSelect}
            locale={vi}
            captionLayout='dropdown'
            defaultMonth={internalRange?.from || new Date()}
            numberOfMonths={2}
            classNames={{
              months: isMobile ? 'flex flex-col gap-4' : 'flex'
            }}
            disabled={{ after: new Date() }}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
