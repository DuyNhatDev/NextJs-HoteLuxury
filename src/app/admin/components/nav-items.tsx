import { Users, Hotel, Handshake, MapPinned, Settings, BadgeDollarSign } from 'lucide-react'

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
          title: 'Danh sách khách sạn',
          url: '/admin/hotel/list'
        }
      ]
    },
    {
      title: 'Người dùng',
      url: '#',
      icon: Users,
      items: [
        {
          title: 'Danh sách người dùng',
          url: '/admin/user/list'
        }
      ]
    },
    {
      title: 'Địa điểm',
      url: '#',
      icon: MapPinned,
      items: [
        {
          title: 'Danh sách địa điểm',
          url: '/admin/destination'
        }
      ]
    },
    {
      title: 'Doanh thu',
      url: '#',
      icon: BadgeDollarSign,
      items: [
        {
          title: 'Doanh thu theo khách sạn',
          url: '#'
        },
        {
          title: 'Thống kê hoa hồng',
          url: '#'
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
