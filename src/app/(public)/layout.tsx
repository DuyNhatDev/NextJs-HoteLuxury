import Link from 'next/link'
import { Menu, Package2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import DarkModeToggle from '@/components/dark-mode-toggle'
import Image from 'next/image'
import DropdownAvatar from '@/app/(public)/components/dropdown-avatar'

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-20 flex h-14 items-center gap-4 bg-blue-900 px-4 md:pr-6 md:pl-52">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Image src="/logo/hoteluxury-logo.png" alt="HoteLuxury" width={140} height={140} />
            <span className="sr-only">HoteLuxury</span>
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader className="sr-only">
              <SheetTitle />
              <SheetDescription />
            </SheetHeader>
            <nav className="grid gap-6 text-lg font-medium">
              <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                <Package2 className="h-6 w-6" />
                <span className="sr-only">HoteLuxury</span>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="ml-auto flex gap-28">
          <DropdownAvatar />
          <DarkModeToggle />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 md:gap-8">{children}</main>
    </div>
  )
}
