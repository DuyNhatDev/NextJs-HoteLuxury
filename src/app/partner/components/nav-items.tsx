import { Hotel, Settings, ReceiptText, MessageCircleMore } from 'lucide-react'

export const data = {
  navManage: [
    {
      title: 'Khách sạn của tôi',
      url: '#',
      icon: Hotel,
      items: [
        {
          title: 'Thông tin khách sạn',
          url: '/partner/manage/hotel/information'
        },
        {
          title: 'Danh sách loại phòng',
          url: '/partner/manage/hotel/room-type'
        }
      ]
    },
    {
      title: 'Đơn đặt phòng',
      url: '#',
      icon: ReceiptText,
      items: [
        {
          title: 'Danh sách đơn',
          url: '/partner/manage/order/confirmed'
        },
        {
          title: 'Chờ xác nhận',
          url: '/partner/manage/order/pending'
        },
        {
          title: 'Đã hủy',
          url: '/partner/manage/order/canceled'
        }
      ]
    },
    {
      title: 'Đánh giá phản hồi',
      url: '#',
      icon: MessageCircleMore,
      items: [
        {
          title: 'Danh sách phản hồi',
          url: '/partner/manage/feedback'
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
          url: '/partner/manage/setting/account'
        },
        {
          title: 'Đổi mật khẩu',
          url: '/partner/manage/setting/change-password'
        }
      ]
    }
  ]
  // projects: [
  //   {
  //     name: 'Design Engineering',
  //     url: '#',
  //     icon: Frame,
  //   },
  //   {
  //     name: 'Sales & Marketing',
  //     url: '#',
  //     icon: PieChart,
  //   },
  // ],
}
