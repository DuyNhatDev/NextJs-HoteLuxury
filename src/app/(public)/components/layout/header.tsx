import DropdownAvatar from '@/app/(public)/components/dropdown-avatar'
import DarkModeToggle from '@/components/dark-mode-toggle'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header className='sticky top-0 z-20 flex h-14 items-center gap-4 bg-blue-900 px-4 md:pr-6 md:pl-52'>
      <nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
        <Link href='/' className='flex items-center gap-2 text-lg font-semibold md:text-base'>
          <Image src='/logo/hoteluxury-logo.png' alt='HoteLuxury' width={140} height={140} />
          <span className='sr-only'>HoteLuxury</span>
        </Link>
      </nav>
      <div className='ml-auto flex gap-28'>
        <DropdownAvatar />
        <DarkModeToggle />
      </div>
    </header>
  )
}
