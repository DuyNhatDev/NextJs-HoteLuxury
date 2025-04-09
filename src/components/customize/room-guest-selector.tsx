import React, { useState } from 'react'
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
  const isDisabled = value <= minValue!
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4 py-2">
      <div>
        <div className="text-base font-medium">{label}</div>
        <div className="text-sm text-gray-500">{subtitle}</div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onDecrease}
          className="rounded-full border-gray-300"
          disabled={isDisabled}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <div className="w-6 text-center">{value}</div>
        <Button
          variant="outline"
          size="icon"
          onClick={onIncrease}
          className="rounded-full border-gray-300"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

interface RoomGuestSelectorProps {
  className?: string
  value?: {
    rooms: number
    adults: number
    children: number
  }
  onChange?: (value: { rooms: number; adults: number; children: number }) => void
}

const RoomGuestSelector = ({ className, value, onChange }: RoomGuestSelectorProps) => {
  const [rooms, setRooms] = useState(value?.rooms ?? 1)
  const [adults, setAdults] = useState(value?.adults ?? 2)
  const [children, setChildren] = useState(value?.children ?? 0)
  const [open, setOpen] = useState(false)
  const handleChange = (newValues: { rooms: number; adults: number; children: number }) => {
    setRooms(newValues.rooms)
    setAdults(newValues.adults)
    setChildren(newValues.children)
    onChange?.(newValues)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'flex !h-14 items-center justify-center gap-2 rounded-md border px-2 py-1',
            className
          )}
        >
          <div className="flex h-full items-center gap-2 px-2">
            <UserRound className="!h-6 !w-6 text-gray-500" />
            <div className="flex flex-col justify-center text-left leading-tight">
              <span className="text-[15px] font-medium">
                {adults} người lớn, {children} trẻ em
              </span>
              <span className="text-muted-foreground text-sm">{rooms} Phòng</span>
            </div>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto rounded-lg p-0 shadow-md" align="center">
        <Card className="rounded-lg p-0 shadow-md">
          <CardContent className="p-4">
            <Counter
              label="Phòng"
              subtitle=""
              value={rooms}
              minValue={1}
              onDecrease={() => handleChange({ rooms: Math.max(1, rooms - 1), adults, children })}
              onIncrease={() => handleChange({ rooms: rooms + 1, adults, children })}
            />
            <Counter
              label="Người Lớn"
              subtitle="Từ 17 tuổi"
              value={adults}
              minValue={1}
              onDecrease={() => handleChange({ rooms, adults: Math.max(1, adults - 1), children })}
              onIncrease={() => handleChange({ rooms, adults: adults + 1, children })}
            />
            <Counter
              label="Trẻ em"
              subtitle="Từ 0 - 16 tuổi"
              value={children}
              minValue={0}
              onDecrease={() =>
                handleChange({ rooms, adults, children: Math.max(0, children - 1) })
              }
              onIncrease={() => handleChange({ rooms, adults, children: children + 1 })}
            />
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

export default RoomGuestSelector
