'use client'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

type ConfirmOptions = {
  title?: string
  text?: string
  icon?: 'warning' | 'info' | 'error' | 'success' | 'question'
  confirmButtonText?: string
  cancelButtonText?: string
  confirmButtonColor?: string
  cancelButtonColor?: string
  showCancelButton?: boolean
}

export default function useConfirmDialog() {
  const confirm = async (options: ConfirmOptions = {}) => {
    const {
      title = 'Bạn chắc chắn?',
      text = 'Thao tác này không thể hoàn tác!',
      icon = 'warning',
      confirmButtonText = 'Xác nhận',
      cancelButtonText = 'Hủy',
      confirmButtonColor = '#3085d6',
      cancelButtonColor = '#d33',
      showCancelButton = true
    } = options

    const result = await MySwal.fire({
      title,
      text,
      icon,
      showCancelButton,
      confirmButtonText,
      cancelButtonText,
      confirmButtonColor,
      cancelButtonColor
    })

    return result.isConfirmed
  }

  return { confirm }
}
