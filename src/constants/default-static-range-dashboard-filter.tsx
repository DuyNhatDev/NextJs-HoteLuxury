import {
  addMonths,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subYears,
  isSameDay,
  isAfter
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
  startOfMonth: startOfMonth(new Date()),
  endOfMonth: endOfMonth(new Date()),
  startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
  endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
  startOfThisYear: startOfDay(new Date(new Date().getFullYear(), 0, 1)),
  endOfThisYear: endOfDay(new Date(new Date().getFullYear(), 11, 31)),
  startOfLastYear: startOfYear(subYears(new Date(), 1)),
  endOfLastYear: endOfYear(subYears(new Date(), 1)),
  startOfQuarter1: startOfMonth(new Date(new Date().getFullYear(), 0)),
  endOfQuarter1: endOfMonth(new Date(new Date().getFullYear(), 2)),
  startOfQuarter2: startOfMonth(new Date(new Date().getFullYear(), 3)),
  endOfQuarter2: endOfMonth(new Date(new Date().getFullYear(), 5)),
  startOfQuarter3: startOfMonth(new Date(new Date().getFullYear(), 6)),
  endOfQuarter3: endOfMonth(new Date(new Date().getFullYear(), 8)),
  startOfQuarter4: startOfMonth(new Date(new Date().getFullYear(), 9)),
  endOfQuarter4: endOfMonth(new Date(new Date().getFullYear(), 11)),
  endOfDate: endOfDay(new Date())
}

const definedsByMonth = Array.from({ length: 12 }, (_, i) => {
  return {
    label: `Tháng ${i + 1}`,
    range: () => ({
      startDate: startOfMonth(new Date(new Date().getFullYear(), i)),
      endDate: endOfMonth(new Date(new Date().getFullYear(), i))
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

function filterFutureRanges(ranges: CustomRange[]): CustomRange[] {
  const today = startOfDay(new Date())
  return ranges.filter((range) => {
    const { startDate, endDate } = range.range()
    if (!startDate || !endDate) return false
    return !isAfter(startOfDay(startDate), today) && !isAfter(startOfDay(endDate), today)
  })
}

export const defaultStaticRangesDashboardFilterVi = createStaticRanges(
  filterFutureRanges([
    {
      label: 'Tháng này',
      range: () => ({
        startDate: defineds.startOfMonth,
        endDate: defineds.endOfDate
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
    },
    {
      label: 'Năm trước',
      range: () => ({
        startDate: defineds.startOfLastYear,
        endDate: defineds.endOfLastYear
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
)
