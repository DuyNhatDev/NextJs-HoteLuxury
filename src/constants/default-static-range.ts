import {
  addDays,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfWeek,
  endOfWeek,
  isSameDay
} from 'date-fns'

type DateRange = {
  startDate?: Date
  endDate?: Date
}

type CustomRange = {
  label: string
  range: () => { startDate: Date; endDate: Date }
}

const defineds = {
  startOfWeek: startOfWeek(new Date()),
  endOfWeek: endOfWeek(new Date()),
  startOfLastWeek: startOfWeek(addDays(new Date(), -7)),
  endOfLastWeek: endOfWeek(addDays(new Date(), -7)),
  startOfToday: startOfDay(new Date()),
  endOfToday: endOfDay(new Date()),
  startOfYesterday: startOfDay(addDays(new Date(), -1)),
  endOfYesterday: endOfDay(addDays(new Date(), -1)),
  startOfMonth: startOfMonth(new Date()),
  endOfMonth: endOfMonth(new Date()),
  startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
  endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
  startOfLast3Days: startOfDay(addDays(new Date(), -3)),
  endOfLast3Days: endOfDay(addDays(new Date(), -1)),
  startOfThisYear: startOfDay(new Date(new Date().getFullYear(), 0, 1)),
  endOfThisYear: endOfDay(new Date(new Date().getFullYear(), 11, 31))
}

// const definedsByMonth = Array.from({ length: 12 }, (_, i) => {
//   const monthIndex = i
//   return {
//     label: `Tháng ${i + 1}`,
//     range: () => ({
//       startDate: startOfMonth(new Date(new Date().getFullYear(), monthIndex)),
//       endDate: endOfMonth(new Date(new Date().getFullYear(), monthIndex))
//     })
//   }
// })

const staticRangeHandler = {
  isSelected(this: any, range: DateRange): boolean {
    const definedRange = this.range()
    return (
      (range.startDate &&
        range.endDate &&
        isSameDay(range.startDate, definedRange.startDate) &&
        isSameDay(range.endDate, definedRange.endDate)) ||
      false
    )
  }
}

export function createStaticRanges(ranges: CustomRange[]) {
  return ranges.map((range) => ({
    ...staticRangeHandler,
    ...range
  }))
}

export const defaultStaticRangesVi = createStaticRanges([
  {
    label: 'Hôm nay',
    range: () => ({
      startDate: defineds.startOfToday,
      endDate: defineds.endOfToday
    })
  },
  {
    label: 'Hôm qua',
    range: () => ({
      startDate: defineds.startOfYesterday,
      endDate: defineds.endOfYesterday
    })
  },
  {
    label: '3 ngày trước',
    range: () => ({
      startDate: defineds.startOfLast3Days,
      endDate: defineds.endOfLast3Days
    })
  },
  {
    label: 'Tuần này',
    range: () => ({
      startDate: defineds.startOfWeek,
      endDate: defineds.endOfWeek
    })
  },
  {
    label: 'Tuần trước',
    range: () => ({
      startDate: defineds.startOfLastWeek,
      endDate: defineds.endOfLastWeek
    })
  },
  {
    label: 'Tháng này',
    range: () => ({
      startDate: defineds.startOfMonth,
      endDate: defineds.endOfMonth
    })
  },
  {
    label: 'Tháng trước',
    range: () => ({
      startDate: defineds.startOfLastMonth,
      endDate: defineds.endOfLastMonth
    })
  },
  {
    label: 'Năm nay',
    range: () => ({
      startDate: defineds.startOfThisYear,
      endDate: defineds.endOfThisYear
    })
  }
  //   ...definedsByMonth
])
