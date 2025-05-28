'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { DateTimePicker } from '@/components/custom/date-time-picker'
import CurrencyInput from '@/components/custom/currency-input'

type DatePrice = {
  date: Date
  price: number
}

type PricePerDayPickerProps = {
  value: DatePrice[]
  onChange: (newValue: DatePrice[]) => void
}

export default function PricePerDayPicker({ value, onChange }: PricePerDayPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [price, setPrice] = useState<number>(0)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [originalDate, setOriginalDate] = useState<Date | null>(null)

  const isSameDate = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()

  const findDateIndex = (date: Date): number => {
    return value.findIndex((d) => isSameDate(d.date, date))
  }

  const onSelectDate = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(null)
      setPrice(0)
      setEditingIndex(null)
      setOriginalDate(null)
      return
    }

    setSelectedDate(date)

    // Nếu không trong chế độ sửa thì mới set giá từ dữ liệu
    if (editingIndex === null) {
      const index = findDateIndex(date)
      if (index !== -1) {
        setPrice(value[index].price)
        setEditingIndex(index)
        setOriginalDate(value[index].date)
      } else {
        setPrice(0)
        setEditingIndex(null)
        setOriginalDate(null)
      }
    }
  }

  const handleAddOrUpdate = () => {
    if (!selectedDate) return
    if (price === 0) return alert('Bạn phải nhập giá')

    const isDuplicateDate = value.some((item, i) => isSameDate(item.date, selectedDate) && i !== editingIndex)

    if (isDuplicateDate) {
      alert('Ngày này đã tồn tại trong danh sách. Vui lòng chọn ngày khác.')
      return
    }

    if (editingIndex !== null) {
      // Đang chỉnh sửa
      const newData = [...value]
      newData[editingIndex] = {
        date: selectedDate,
        price: Number(price)
      }
      onChange(newData)
    } else {
      // Thêm mới
      const newData = [...value, { date: selectedDate, price: Number(price) }]
      onChange(newData)
    }

    // Reset
    setEditingIndex(null)
    setSelectedDate(null)
    setOriginalDate(null)
    setPrice(0)
  }

  const handleEdit = (index: number) => {
    const item = value[index]
    setSelectedDate(item.date)
    setOriginalDate(item.date)
    setPrice(item.price)
    setEditingIndex(index)
  }

  const handleDelete = (index: number) => {
    const dateToDelete = value[index].date
    const newData = value.filter((_, i) => i !== index)
    onChange(newData)

    if (editingIndex !== null && isSameDate(value[editingIndex].date, dateToDelete)) {
      setEditingIndex(null)
      setSelectedDate(null)
      setOriginalDate(null)
      setPrice(0)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <DateTimePicker
          value={selectedDate ?? undefined}
          onChange={(date) => onSelectDate(date ?? undefined)}
          placeholder='Chọn ngày'
          granularity='day'
          className='w-[200px]'
        />

        <CurrencyInput value={price} onChange={setPrice} placeholder='Nhập giá' className='w-full' />

        <Button onClick={handleAddOrUpdate}>{editingIndex !== null ? 'Cập nhật' : 'Thêm'}</Button>
        {editingIndex !== null && (
          <Button
            variant='ghost'
            onClick={() => {
              setEditingIndex(null)
              setSelectedDate(null)
              setOriginalDate(null)
              setPrice(0)
            }}
          >
            Hủy
          </Button>
        )}
      </div>

      <div className='space-y-2'>
        {value.map((item, index) => (
          <div key={index} className='flex items-center justify-between rounded border p-2'>
            <span>{format(item.date, 'dd/MM/yyyy')}</span>
            <span>{item.price === 0 ? 'Chưa có giá' : item.price.toLocaleString() + ' đ'}</span>
            <div>
              <Button variant='ghost' size='sm' onClick={() => handleEdit(index)}>
                Sửa
              </Button>
              <Button variant='ghost' size='sm' onClick={() => handleDelete(index)} className='text-red-500'>
                Xóa
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
