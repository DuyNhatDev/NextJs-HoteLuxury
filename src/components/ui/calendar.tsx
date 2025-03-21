'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker, ChevronProps } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

// Custom Chevron cho điều hướng
function CustomChevron(props: ChevronProps) {
  const Icon = props.orientation === 'left' ? ChevronLeft : ChevronRight
  return <Icon {...props} className={cn('size-4', props.className)} />
}

type CalendarProps = React.ComponentProps<typeof DayPicker>

export function Calendar({ className, ...props }: CalendarProps) {
  return (
    <DayPicker
      className={cn('p-3', className)}
      showOutsideDays
      captionLayout="dropdown" // ✅ Thêm dropdown tháng/năm
      modifiersClassNames={{
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
        today: 'bg-accent text-accent-foreground',
        disabled: 'text-muted-foreground opacity-50',
        outside: 'text-muted-foreground',
      }}
      components={{
        Chevron: CustomChevron, // ✅ Custom icon điều hướng
      }}
      {...props}
    />
  )
}
