import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Minus, Plus, UserRound } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface CounterProps {
  label: string
  subtitle?: string
  value: number
  minValue?: number
  onDecrease: () => void
  onIncrease: () => void
}

const Counter = ({ label, subtitle, value, minValue, onDecrease, onIncrease }: CounterProps) => {
  const isDisabled = value <= (minValue ?? 0)
  return (
    <div className='grid grid-cols-[1fr_auto] items-center gap-4 py-2'>
      <div>
        <div className='text-base font-medium'>{label}</div>
        <div className='text-sm text-gray-500'>{subtitle}</div>
      </div>
      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='icon'
          onClick={onDecrease}
          className='h-7 w-7 rounded-full border-gray-500'
          disabled={isDisabled}
        >
          <Minus className='h-4 w-4 text-blue-500' />
        </Button>
        <div className='w-6 text-center text-xl font-bold'>{value}</div>
        <Button variant='outline' size='icon' onClick={onIncrease} className='h-7 w-7 rounded-full border-gray-500'>
          <Plus className='h-4 w-4 text-blue-500' />
        </Button>
      </div>
    </div>
  )
}

interface RoomGuestSelectorProps {
  className?: string
  rooms: number
  adults: number
  child: number
  onRoomsChange: (value: number) => void
  onAdultsChange: (value: number) => void
  onChildrenChange: (value: number) => void
}

const RoomGuestSelector = ({
  className,
  rooms,
  adults,
  child,
  onRoomsChange,
  onAdultsChange,
  onChildrenChange
}: RoomGuestSelectorProps) => {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn('flex !h-15 w-full items-center justify-center gap-2 border px-2 py-1', className)}
        >
          <div className='flex h-full items-center gap-2 px-2'>
            <UserRound className='!h-6 !w-6 text-gray-500' />
            <div className='flex flex-col justify-center gap-1 text-left leading-tight'>
              <span className='text-muted-foreground text-[16px]'>{rooms} Phòng</span>
              <span className='text-[15px] font-medium'>
                {adults} người lớn, {child} trẻ em
              </span>
            </div>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-full rounded-sm p-0 shadow-none' align='center'>
        <Card className='rounded-sm p-0 shadow-none'>
          <CardContent className='w-full px-4.5'>
            <div className='divide-y'>
              <div className='py-1'>
                <Counter
                  label='Phòng'
                  subtitle=''
                  value={rooms}
                  minValue={1}
                  onDecrease={() => onRoomsChange(Math.max(1, rooms - 1))}
                  onIncrease={() => onRoomsChange(rooms + 1)}
                />
              </div>
              <div className='py-0'>
                <Counter
                  label='Người Lớn'
                  subtitle='Từ 17 tuổi'
                  value={adults}
                  minValue={1}
                  onDecrease={() => onAdultsChange(Math.max(1, adults - 1))}
                  onIncrease={() => onAdultsChange(adults + 1)}
                />
              </div>
              <div className='py-0'>
                <Counter
                  label='Trẻ em'
                  subtitle='Từ 0 - 16 tuổi'
                  value={child}
                  minValue={0}
                  onDecrease={() => onChildrenChange(Math.max(0, child - 1))}
                  onIncrease={() => onChildrenChange(child + 1)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

export default RoomGuestSelector
