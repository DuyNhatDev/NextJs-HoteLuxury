'use client'
import { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { DateRangePicker } from 'react-date-range'
import { format, isAfter, startOfDay } from 'date-fns'
import { vi } from 'date-fns/locale'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { State } from '@/types/react-date-range'
import { defaultStaticRangesDashboardFilterVi } from '@/constants/default-static-range-dashboard-filter'

type ReactDateRangeProps = {
  value?: State
  onChange?: (range: State | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  fromDate?: Date
  toDate?: Date
  formatString?: string
}

export default function DashboardFilterRange({
  value,
  onChange,
  placeholder = 'Chọn khoảng ngày',
  className,
  disabled = false,
  fromDate,
  toDate,
  formatString = 'dd/MM/yyyy'
}: ReactDateRangeProps) {
  const [open, setOpen] = useState(false)

  const defaultRange: State = {
    startDate: fromDate || undefined,
    endDate: toDate || undefined,
    key: 'selection'
  }

  const [internalRange, setInternalRange] = useState<State>(value || defaultRange)

  useEffect(() => {
    if (value) {
      setInternalRange(value)
    }
  }, [value])

  const handleSelect = (ranges: any) => {
    const range = ranges.selection
    setInternalRange(range)
    onChange?.(range)
  }

  const formatDay = (date?: Date) => {
    if (!date) return ''
    return format(date, formatString, { locale: vi })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          disabled={disabled}
          className={cn('flex items-center justify-center gap-1 border px-2 py-0', className)}
        >
          {internalRange?.startDate ? (
            <>
              <div className='flex h-full items-center gap-2 pl-2'>
                <CalendarIcon className='!h-4 !w-4 text-gray-500' />
                <span className='text-[15px] font-medium'>{formatDay(internalRange.startDate)}</span>
              </div>
              <div>-</div>
              {internalRange.endDate ? (
                <div className='flex h-full items-center gap-2 pr-2'>
                  <span className='text-[15px] font-medium'>{formatDay(internalRange.endDate)}</span>
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
        className='w-full max-w-5xl overflow-auto border-none p-0 shadow-md'
        align='center'
        sideOffset={5}
      >
        <DateRangePicker
          onChange={handleSelect}
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={
            internalRange?.startDate && internalRange?.endDate
              ? [internalRange]
              : [
                  {
                    startDate: new Date(),
                    endDate: new Date(),
                    key: 'selection'
                  }
                ]
          }
          direction='horizontal'
          locale={vi}
          preventSnapRefocus={true}
          calendarFocus='backwards'
          staticRanges={defaultStaticRangesDashboardFilterVi}
          inputRanges={[]}
          disabledDay={(date) => isAfter(startOfDay(date), startOfDay(new Date()))}
        />
      </PopoverContent>
    </Popover>
  )
}
