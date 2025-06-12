import { Hotel, Settings, ReceiptText, MessageCircleMore, CalendarDays } from 'lucide-react'

export const data = {
  navManage: [
    {
      title: 'Khách sạn của tôi',
      url: '#',
      icon: Hotel,
      items: [
        {
          title: 'Thông tin khách sạn',
          url: '/partner/hotel/information'
        },
        {
          title: 'Danh sách loại phòng',
          url: '/partner/hotel/room-type'
        }
      ]
    },
    {
      title: 'Đơn đặt phòng',
      url: '#',
      icon: ReceiptText,
      items: [
        {
          title: 'Đơn đặt phòng',
          url: '/partner/order'
        }
      ]
    },
    {
      title: 'Lịch hẹn',
      url: '#',
      icon: CalendarDays,
      items: [
        {
          title: 'Lịch hẹn',
          url: '/partner/schedule'
        }
      ]
    },
    {
      title: 'Nhận xét',
      url: '#',
      icon: MessageCircleMore,
      items: [
        {
          title: 'Đánh giá phản hồi',
          url: '/partner/feedback'
        }
      ]
    },
    // {
    //   title: 'Đánh giá phản hồi',
    //   url: '#',
    //   icon: MessageCircleMore,
    //   items: [
    //     {
    //       title: 'Danh sách phản hồi',
    //       url: '/partner/feedback'
    //     }
    //   ]
    // },
    {
      title: 'Cài đặt',
      url: '#',
      icon: Settings,
      items: [
        {
          title: 'Tài khoản',
          url: '/partner/setting/account'
        },
        {
          title: 'Đổi mật khẩu',
          url: '/partner/setting/change-password'
        }
      ]
    }
  ]
}
