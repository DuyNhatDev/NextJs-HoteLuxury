'use client'

import DateRangePicker from '@/components/customize/date-range-picker'
import RoomGuestSelector from '@/components/customize/room-guest-selector'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Popover } from '@/components/ui/popover'
import { SearchSuggestSchema, SearchSuggestType } from '@/schemaValidations/search.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { addDays } from 'date-fns'
import { useRef, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { useForm } from 'react-hook-form'

export default function SearchForm() {
  const form = useForm<SearchSuggestType>({
    resolver: zodResolver(SearchSuggestSchema),
    defaultValues: {
      dayStart: new Date(),
      dayEnd: addDays(new Date(), 2),
      keyword: '',
    },
  })
  const onSubmit = async (data: SearchSuggestType) => {
    console.log('From', data.dayStart)
    console.log('To', data.dayEnd)
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-full max-w-3xl rounded-sm bg-gray-800/20 p-4 shadow-lg">
        <Form {...form}>
          <form
            className="flex w-full flex-col gap-4"
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (err) => {
              console.log(err)
            })}
          >
            {/* <div className="relative w-full"></div> */}
            <div className="grid grid-cols-8 items-stretch gap-4">
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="dayStart"
                  render={() => (
                    <FormItem className="w-full">
                      <DateRangePicker
                        className="w-full"
                        value={{
                          from: form.watch('dayStart'),
                          to: form.watch('dayEnd'),
                        }}
                        onChange={(range: DateRange | undefined) => {
                          if (range?.from) form.setValue('dayStart', range.from)
                          if (range?.to) form.setValue('dayEnd', range.to)
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-3">
                <RoomGuestSelector className="w-full" />
              </div>

              <div className="col-span-1 h-full">
                <Button type="submit" className="h-full w-full bg-orange-500 hover:bg-orange-600">
                  Tìm
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
