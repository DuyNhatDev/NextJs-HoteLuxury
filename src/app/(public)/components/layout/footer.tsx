import { Separator } from '@/components/ui/separator'
import { Youtube, Facebook, Instagram, Twitter } from 'lucide-react'
import Link from 'next/link'

const footerSections = [
  {
    title: 'Về HOTELUXURY',
    links: [
      {
        title: 'Về chúng tôi',
        href: '/about'
      },
      {
        title: 'Tuyển dụng',
        href: '#'
      },
      {
        title: 'Tin tức',
        href: '#'
      },
      {
        title: 'Báo chí',
        href: '#'
      }
    ]
  },
  {
    title: 'Hỗ trợ khách hàng',
    links: [
      {
        title: 'Câu hỏi thường gặp',
        href: '#'
      },
      {
        title: 'Hướng dẫn sử dụng',
        href: '#'
      },
      {
        title: 'Chăm sóc khách hàng',
        href: '#'
      }
    ]
  },
  {
    title: 'Chính sách',
    links: [
      {
        title: 'Điều khoản sử dụng',
        href: '#'
      },
      {
        title: 'Chính sách bảo mật',
        href: '#'
      },
      {
        title: 'Quyền riêng tư',
        href: '#'
      }
    ]
  },
  {
    title: 'Liên hệ',
    links: [
      {
        title: '0348094985',
        href: '#'
      },
      {
        title: 'hoteluxurybooking@gmail.com',
        href: '#'
      },
      {
        title: '1 Võ Văn Ngân, Phường Linh Chiểu, Thành phố Thủ Đức, Thành phố Hồ Chí Minh',
        href: '#'
      }
    ]
  }
]

export default function Footer() {
  return (
    <footer>
      <div className='mx-auto max-w-screen-xl'>
        <div className='grid grid-cols-2 gap-x-8 gap-y-10 px-6 py-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 xl:px-0'>
          <div className='col-span-full xl:col-span-2'>
            <img src='/logo/logo.png' alt='logo' width={50} height={50}></img>
            <p className='text-muted-foreground mt-4'>
              Hoteluxury mang đến trải nghiệm đặt phòng nhanh chóng, tiện lợi và đáng tin cậy cho mọi chuyến đi của bạn.
              Hãy để Hoteluxury đồng hành cùng bạn!
            </p>
          </div>
          {footerSections.map(({ title, links }) => (
            <div key={title}>
              <h6 className='font-semibold'>{title}</h6>
              <ul className='mt-6 space-y-4'>
                {links.map(({ title, href }) => (
                  <li key={title}>
                    <Link href={href} target='_blank' className='text-muted-foreground hover:text-foreground'>
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator />
        <div className='flex flex-col-reverse items-center justify-between gap-x-2 gap-y-5 px-6 py-8 sm:flex-row xl:px-0'>
          <span className='text-muted-foreground'>
            &copy; {new Date().getFullYear()}{' '}
            <Link href='/' target='_blank'>
              Công ty HoteLuxury
            </Link>
            . Mọi quyền được bảo lưu.
          </span>
          <div className='text-muted-foreground flex items-center gap-5'>
            <Link href='#' target='_blank'>
              <Youtube className='h-5 w-5' />
            </Link>
            <Link href='#' target='_blank'>
              <Facebook className='h-5 w-5' />
            </Link>
            <Link href='#' target='_blank'>
              <Instagram className='h-5 w-5' />
            </Link>
            <Link href='#' target='_blank'>
              <Twitter className='h-5 w-5' />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
