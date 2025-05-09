'use client'

import { useState, useEffect } from 'react'
import { DayPicker, DateRange } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { format as formatDate, addDays, differenceInCalendarDays } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

type DateRangePickerProps = {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  format?: string
}

export default function CustomDateRangePicker({
  value,
  onChange,
  placeholder = 'Chọn khoảng ngày',
  className,
  disabled = false
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  const defaultRange: DateRange = {
    from: new Date(),
    to: addDays(new Date(), 1)
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

  const getNights = (range?: DateRange) => {
    if (range?.from && range?.to) {
      return differenceInCalendarDays(range.to, range.from)
    }
    return 0
  }

  const formatDay = (date?: Date) => {
    if (!date) return ''
    return formatDate(date, 'dd/MM/yyyy', { locale: vi })
  }

  const formatWeekday = (date?: Date) => {
    if (!date) return ''
    return formatDate(date, 'EEEE', { locale: vi })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          disabled={disabled}
          className={cn('flex !h-15 items-center justify-center gap-2 border px-2 py-0', className)}
        >
          {internalRange?.from ? (
            <>
              <div className='flex h-full items-center gap-2 px-2'>
                <CalendarIcon className='!h-6 !w-6 text-gray-500' />
                <div className='flex flex-col justify-center gap-1 text-left leading-tight'>
                  <span className='text-muted-foreground text-[16px]'>{formatWeekday(internalRange.from)}</span>
                  <span className='text-[15px] font-medium'>{formatDay(internalRange.from)}</span>
                </div>
              </div>
              <div className='relative flex h-full items-center justify-center px-4'>
                <div className='absolute inset-0 flex flex-col'>
                  <div className='flex flex-1 justify-center'>
                    <div className='h-full border-l border-gray-400'></div>
                  </div>
                  <div className='flex-1'></div>
                  <div className='flex flex-1 justify-center'>
                    <div className='h-full border-l border-gray-400'></div>
                  </div>
                </div>
                {getNights(internalRange) > 0 && (
                  <div className='text-muted-foreground absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center px-1 text-sm text-[18px]'>
                    {getNights(internalRange)}
                    <span>
                      <Moon className='!h-5 !w-5' />
                    </span>
                  </div>
                )}
              </div>

              {internalRange.to ? (
                <div className='flex h-full items-center gap-2 px-2'>
                  <CalendarIcon className='!h-6 !w-6 text-gray-500' />
                  <div className='flex flex-col justify-center gap-1 text-left leading-tight'>
                    <span className='text-muted-foreground text-[16px]'>{formatWeekday(internalRange.to)}</span>
                    <span className='text-[15px] font-medium'>{formatDay(internalRange.to)}</span>
                  </div>
                </div>
              ) : (
                <span className='text-sm text-gray-400'>Chọn ngày kết thúc</span>
              )}
            </>
          ) : (
            <span className='text-sm text-gray-400'>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-auto rounded-lg p-4 shadow-md' align='center'>
        <DayPicker
          mode='range'
          selected={internalRange}
          onSelect={handleSelect}
          locale={vi}
          captionLayout='dropdown'
          defaultMonth={internalRange?.from || new Date()}
          numberOfMonths={2}
          disabled={{ before: new Date() }}
        />
      </PopoverContent>
    </Popover>
  )
}
