'use client'
import CalendarFilterRange from '@/components/custom/dashboard-filter-range'
import { State } from '@/types/react-date-range'
import { startOfMonth, endOfDay } from 'date-fns'
import { useState } from 'react'

export default function FilterRange() {
  const [createdRange, setCreatedRange] = useState<State | undefined>({
    startDate: startOfMonth(new Date()),
    endDate: endOfDay(new Date()),
    key: 'selection' as const
  })
  return (
    <div>
      <CalendarFilterRange
        value={createdRange}
        onChange={(newRange) => setCreatedRange(newRange!)}
        className='bg-transparent'
        placeholder='Chọn khoảng thời gian'
      />
    </div>
  )
}
