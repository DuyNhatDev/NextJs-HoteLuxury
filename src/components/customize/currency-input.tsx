import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import clsx from 'clsx'

interface CurrencyInputProps {
  value?: number
  onChange?: (value: number) => void
  placeholder?: string
  currency?: string
  className?: string
}

export default function CurrencyInput({
  value = 0,
  onChange,
  placeholder = 'Nhập số tiền',
  currency = '₫',
  className = '',
}: CurrencyInputProps) {
  const [internalValue, setInternalValue] = useState(value)

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '')
    const numericValue = rawValue ? Number(rawValue) : 0
    setInternalValue(numericValue)
    onChange?.(numericValue)
  }

  return (
    <div className={clsx('grid w-full max-w-sm items-center gap-1.5', className)}>
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          className={clsx('pr-10 text-left', className)}
          value={formatCurrency(internalValue)}
          onChange={handleChange}
        />
        <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
          {currency}
        </span>
      </div>
    </div>
  )
}
