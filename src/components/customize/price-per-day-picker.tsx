// 'use client'

// import { useState } from 'react'
// import { format, parseISO } from 'date-fns'
// import { CalendarIcon } from 'lucide-react'
// import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
// import { Button } from '@/components/ui/button'
// import { Calendar } from '@/components/ui/calendar'
// import { Input } from '@/components/ui/input'
// import { DateTimePicker } from '@/components/customize/date-time-picker'

// type DatePrice = {
//   date: Date
//   price: number
//   isFixedHoliday?: boolean // ngày lễ cố định (chỉ dùng ngày + tháng)
// }

// // Ví dụ ngày lễ cố định (isFixedHoliday: true) áp dụng cho mọi năm,
// // giá có thể để 0 hoặc tùy chỉnh theo bạn.
// const initialDates: DatePrice[] = [
//   { date: parseISO('2025-01-01'), price: 0, isFixedHoliday: true }, // Tết Dương lịch
//   { date: parseISO('2025-04-30'), price: 0, isFixedHoliday: true }, // Ngày 30/4
//   { date: parseISO('2025-05-01'), price: 0, isFixedHoliday: true }, // Ngày 1/5
//   { date: parseISO('2025-09-02'), price: 0, isFixedHoliday: true } // Ngày 2/9
// ]

// export default function PricePerDayPicker() {
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null)
//   const [price, setPrice] = useState<string>('')
//   const [data, setData] = useState<DatePrice[]>(initialDates)
//   const [editingIndex, setEditingIndex] = useState<number | null>(null)

//   // Hàm so sánh ngày, tháng, năm hoặc chỉ ngày+tháng với ngày lễ cố định
//   function isSameDate(d1: Date, d2: Date, fixedHoliday = false) {
//     if (fixedHoliday) {
//       // So sánh chỉ ngày và tháng
//       return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth()
//     }
//     // So sánh đầy đủ ngày, tháng, năm
//     return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
//   }

//   // Tìm index của ngày đã chọn, ưu tiên check ngày lễ cố định trước
//   const findDateIndex = (date: Date): number => {
//     // Tìm ngày lễ cố định (so sánh ngày + tháng)
//     const fixedIndex = data.findIndex((d) => d.isFixedHoliday && isSameDate(d.date, date, true))
//     if (fixedIndex !== -1) return fixedIndex

//     // Tìm ngày bình thường (so sánh đầy đủ)
//     return data.findIndex((d) => !d.isFixedHoliday && isSameDate(d.date, date))
//   }

//   const onSelectDate = (date: Date | undefined) => {
//     if (!date) {
//       setSelectedDate(null)
//       setPrice('')
//       setEditingIndex(null)
//       return
//     }
//     setSelectedDate(date)

//     const index = findDateIndex(date)
//     if (index !== -1) {
//       setPrice(data[index].price === 0 ? '' : data[index].price.toString())
//       setEditingIndex(index)
//     } else {
//       setPrice('')
//       setEditingIndex(null)
//     }
//   }

//   const handleAddOrUpdate = () => {
//     if (!selectedDate) return
//     if (!price) return alert('Bạn phải nhập giá')

//     const index = findDateIndex(selectedDate)

//     if (index !== -1) {
//       setData((prev) =>
//         prev.map((item, i) => (i === index ? { ...item, price: Number(price), date: selectedDate } : item))
//       )
//     } else {
//       // Khi thêm mới, mặc định isFixedHoliday = false
//       setData((prev) => [...prev, { date: selectedDate, price: Number(price), isFixedHoliday: false }])
//     }

//     setEditingIndex(null)
//     setSelectedDate(null)
//     setPrice('')
//   }

//   const handleEdit = (index: number) => {
//     const item = data[index]
//     setSelectedDate(item.date)
//     setPrice(item.price === 0 ? '' : item.price.toString())
//     setEditingIndex(index)
//   }

//   const handleDelete = (index: number) => {
//     if (data[index].isFixedHoliday) {
//       alert('Ngày lễ cố định không thể xóa')
//       return
//     }
//     const dateToDelete = data[index].date
//     setData((prev) => prev.filter((_, i) => i !== index))

//     if (
//       editingIndex !== null &&
//       isSameDate(data[editingIndex].date, dateToDelete, data[editingIndex].isFixedHoliday ?? false)
//     ) {
//       setEditingIndex(null)
//       setSelectedDate(null)
//       setPrice('')
//     }
//   }

//   return (
//     <div className='space-y-4'>
//       <div className='flex items-center gap-4'>
//         <DateTimePicker
//           value={selectedDate}
//           onChange={(date) => {
//             onSelectDate(date ?? undefined)
//           }}
//           placeholder='Chọn ngày'
//           granularity='day'
//           className='w-[200px]'
//         />

//         <Input
//           type='number'
//           placeholder='Nhập giá'
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           className='w-[120px]'
//         />

//         <Button onClick={handleAddOrUpdate}>{editingIndex !== null ? 'Cập nhật' : 'Thêm'}</Button>
//         {editingIndex !== null && (
//           <Button
//             variant='ghost'
//             onClick={() => {
//               setEditingIndex(null)
//               setSelectedDate(null)
//               setPrice('')
//             }}
//           >
//             Hủy
//           </Button>
//         )}
//       </div>

//       <div className='space-y-2'>
//         {data.map((item, index) => (
//           <div key={index} className='flex items-center justify-between rounded border p-2'>
//             <span>{item.isFixedHoliday ? format(item.date, 'dd/MM') : format(item.date, 'dd/MM/yyyy')}</span>
//             <span>{item.price === 0 ? 'Chưa có giá' : item.price.toLocaleString() + ' đ'}</span>
//             <div>
//               <Button variant='ghost' size='sm' onClick={() => handleEdit(index)}>
//                 Sửa
//               </Button>
//               <Button
//                 variant='ghost'
//                 size='sm'
//                 onClick={() => handleDelete(index)}
//                 className={`text-red-500 ${item.isFixedHoliday ? 'cursor-not-allowed opacity-50' : ''}`}
//                 disabled={item.isFixedHoliday}
//                 title={item.isFixedHoliday ? 'Ngày lễ cố định không thể xóa' : undefined}
//               >
//                 Xóa
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }
