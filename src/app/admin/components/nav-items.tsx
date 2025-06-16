import { Users, Hotel, Handshake, MapPinned, Settings, BadgeDollarSign, Ticket, MessageCircleMore } from 'lucide-react'

export const data = {
  navManage: [
    {
      title: 'Đối tác',
      url: '#',
      icon: Handshake,
      items: [
        {
          title: 'Danh sách đối tác',
          url: '/admin/partner/list'
        },
        {
          title: 'Chờ duyệt',
          url: '/admin/partner/pending'
        }
      ]
    },
    {
      title: 'Khách sạn',
      url: '#',
      icon: Hotel,
      items: [
        {
          title: 'Khách sạn',
          url: '/admin/hotel'
        }
      ]
    },
    {
      title: 'Khách hàng',
      url: '#',
      icon: Users,
      items: [
        {
          title: 'Khách hàng',
          url: '/admin/user'
        }
      ]
    },
    {
      title: 'Địa điểm',
      url: '#',
      icon: MapPinned,
      items: [
        {
          title: 'Địa điểm',
          url: '/admin/location'
        }
      ]
    },
    {
      title: 'Voucher',
      url: '#',
      icon: Ticket,
      items: [
        {
          title: 'Voucher',
          url: '/admin/voucher'
        }
      ]
    },
    {
      title: 'Đánh giá nhận xét',
      url: '#',
      icon: MessageCircleMore,
      items: [
        {
          title: 'Đánh giá nhận xét',
          url: '/admin/rating'
        }
      ]
    },

    {
      title: 'Cài đặt',
      url: '#',
      icon: Settings,
      items: [
        {
          title: 'Tài khoản',
          url: '/admin/setting/account'
        },
        {
          title: 'Đổi mật khẩu',
          url: '/admin/setting/change-password'
        }
      ]
    }
  ]
}
