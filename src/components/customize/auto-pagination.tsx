import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  page: number
  pageSize: number
  totalItems?: number
  pathname?: string
  isLink?: boolean
  onClick?: (pageNumber: number) => void
}

const RANGE = 2

export default function AutoPagination({
  page,
  pageSize,
  totalItems = 1,
  pathname = '/',
  isLink = true,
  onClick = (pageNumber) => {}
}: Props) {
  const isPrevDisabled = page <= 1 || totalItems === 0
  const isNextDisabled = page >= pageSize || totalItems === 0

  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false

    const renderDotBefore = () => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
      return null
    }

    const renderDotAfter = () => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
      return null
    }

    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter()
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore()
          } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter()
          }
        } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
          return renderDotBefore()
        }

        return (
          <PaginationItem key={index}>
            {isLink ? (
              <PaginationLink
                href={{
                  pathname,
                  query: { page: pageNumber }
                }}
                isActive={pageNumber === page}
              >
                {pageNumber}
              </PaginationLink>
            ) : (
              <Button
                onClick={() => onClick(pageNumber)}
                variant={pageNumber === page ? 'outline' : 'ghost'}
                className='h-9 w-9 p-0'
              >
                {pageNumber}
              </Button>
            )}
          </PaginationItem>
        )
      })
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {isLink ? (
            <PaginationPrevious
              disabled={isPrevDisabled}
              href={{
                pathname,
                query: { page: page - 1 }
              }}
              className={cn({ 'cursor-not-allowed opacity-50': isPrevDisabled })}
              onClick={(e) => {
                if (isPrevDisabled) e.preventDefault()
              }}
            />
          ) : (
            <Button
              disabled={isPrevDisabled}
              className='h-9 p-0 px-2'
              variant='ghost'
              onClick={() => onClick(page - 1)}
            >
              <ChevronLeft className='h-5 w-5' /> Previous
            </Button>
          )}
        </PaginationItem>

        {renderPagination()}

        <PaginationItem>
          {isLink ? (
            <PaginationNext
              disabled={isNextDisabled}
              href={{
                pathname,
                query: { page: page + 1 }
              }}
              className={cn({ 'cursor-not-allowed opacity-50': isNextDisabled })}
              onClick={(e) => {
                if (isNextDisabled) e.preventDefault()
              }}
            />
          ) : (
            <Button
              disabled={isNextDisabled}
              className='h-9 p-0 px-2'
              variant='ghost'
              onClick={() => onClick(page + 1)}
            >
              Next <ChevronRight className='h-5 w-5' />
            </Button>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
