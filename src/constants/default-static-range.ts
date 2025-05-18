import {
  addDays,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfWeek,
  endOfWeek,
  isSameDay,
  startOfYear,
  endOfYear,
  subYears
} from 'date-fns'

type DateRange = {
  startDate?: Date
  endDate?: Date
}

type CustomRange = {
  label: string
  range: () => { startDate?: Date; endDate?: Date }
}

const defineds = {
  startOfWeek: startOfWeek(new Date()),
  endOfWeek: endOfWeek(new Date()),
  startOfLastWeek: startOfWeek(addDays(new Date(), -7)),
  endOfLastWeek: endOfWeek(addDays(new Date(), -7)),
  startOfNextWeek: startOfWeek(addDays(new Date(), 7)),
  endOfNextWeek: endOfWeek(addDays(new Date(), 7)),
  startOfToday: startOfDay(new Date()),
  endOfToday: endOfDay(new Date()),
  startOfYesterday: startOfDay(addDays(new Date(), -1)),
  endOfYesterday: endOfDay(addDays(new Date(), -1)),
  startOfTomorrow: startOfDay(addDays(new Date(), 1)),
  endOfTomorrow: endOfDay(addDays(new Date(), 1)),
  startOfMonth: startOfMonth(new Date()),
  endOfMonth: endOfMonth(new Date()),
  startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
  endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
  startOfNextMonth: startOfMonth(addMonths(new Date(), 1)),
  endOfNextMonth: endOfMonth(addMonths(new Date(), 1)),
  startOfLast3Days: startOfDay(addDays(new Date(), -3)),
  endOfLast3Days: endOfDay(addDays(new Date(), -1)),
  startOfNext3Days: startOfDay(addDays(new Date(), 1)),
  endOfNext3Days: endOfDay(addDays(new Date(), 3)),
  startOfLastYear: startOfYear(subYears(new Date(), 1)),
  endOfLastYear: endOfYear(subYears(new Date(), 1)),
  startOfThisYear: startOfDay(new Date(new Date().getFullYear(), 0, 1)),
  endOfThisYear: endOfDay(new Date(new Date().getFullYear(), 11, 31)),
  startOfNextYear: startOfDay(new Date(new Date().getFullYear() + 1, 0, 1)),
  endOfNextYear: endOfDay(new Date(new Date().getFullYear() + 1, 11, 31)),
  startOfQuarter1: startOfMonth(new Date(new Date().getFullYear(), 0)),
  endOfQuarter1: endOfMonth(new Date(new Date().getFullYear(), 2)),
  startOfQuarter2: startOfMonth(new Date(new Date().getFullYear(), 3)),
  endOfQuarter2: endOfMonth(new Date(new Date().getFullYear(), 5)),
  startOfQuarter3: startOfMonth(new Date(new Date().getFullYear(), 6)),
  endOfQuarter3: endOfMonth(new Date(new Date().getFullYear(), 8)),
  startOfQuarter4: startOfMonth(new Date(new Date().getFullYear(), 9)),
  endOfQuarter4: endOfMonth(new Date(new Date().getFullYear(), 11))
}

const definedsByMonth = Array.from({ length: 12 }, (_, i) => {
  const monthIndex = i
  return {
    label: `Tháng ${i + 1}`,
    range: () => ({
      startDate: startOfMonth(new Date(new Date().getFullYear(), monthIndex)),
      endDate: endOfMonth(new Date(new Date().getFullYear(), monthIndex))
    })
  }
})

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
  // {
  //   label: 'Tất cả',
  //   range: () => ({
  //     startDate: undefined,
  //     endDate: undefined
  //   })
  // },
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
  //   {
  //     label: '3 ngày trước',
  //     range: () => ({
  //       startDate: defineds.startOfLast3Days,
  //       endDate: defineds.endOfLast3Days
  //     })
  //   },
  //   {
  //     label: '3 ngày sau',
  //     range: () => ({
  //       startDate: defineds.startOfNext3Days,
  //       endDate: defineds.endOfNext3Days
  //     })
  //   },
  {
    label: 'Ngày mai',
    range: () => ({
      startDate: defineds.startOfTomorrow,
      endDate: defineds.endOfTomorrow
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
    label: 'Tuần sau',
    range: () => ({
      startDate: defineds.startOfNextWeek,
      endDate: defineds.endOfNextWeek
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
    label: 'Tháng sau',
    range: () => ({
      startDate: defineds.startOfNextMonth,
      endDate: defineds.endOfNextMonth
    })
  },
  {
    label: 'Năm nay',
    range: () => ({
      startDate: defineds.startOfThisYear,
      endDate: defineds.endOfThisYear
    })
  },
  {
    label: 'Năm trước',
    range: () => ({
      startDate: defineds.startOfLastYear,
      endDate: defineds.endOfLastYear
    })
  },
  {
    label: 'Năm sau',
    range: () => ({
      startDate: defineds.startOfNextYear,
      endDate: defineds.endOfNextYear
    })
  },
  ...definedsByMonth,
  {
    label: 'Quý 1',
    range: () => ({
      startDate: defineds.startOfQuarter1,
      endDate: defineds.endOfQuarter1
    })
  },
  {
    label: 'Quý 2',
    range: () => ({
      startDate: defineds.startOfQuarter2,
      endDate: defineds.endOfQuarter2
    })
  },
  {
    label: 'Quý 3',
    range: () => ({
      startDate: defineds.startOfQuarter3,
      endDate: defineds.endOfQuarter3
    })
  },
  {
    label: 'Quý 4',
    range: () => ({
      startDate: defineds.startOfQuarter4,
      endDate: defineds.endOfQuarter4
    })
  }
])
