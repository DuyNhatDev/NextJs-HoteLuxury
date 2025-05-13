// components/CustomAlert.tsx
'use client'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useEffect } from 'react'

const MySwal = withReactContent(Swal)

type CustomAlertProps = {
  show: boolean
  title?: string
  text?: string
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question'
  confirmText?: string
  cancelText?: string
  confirmButtonColor?: string
  cancelButtonColor?: string
  showCancelButton?: boolean
  onConfirm?: () => void
  onCancel?: () => void
  onClose?: () => void
}

export default function CustomAlert({
  show,
  title = 'Thông báo',
  text = '',
  icon = 'info',
  confirmText = 'OK',
  cancelText = 'Hủy',
  confirmButtonColor = '#3085d6',
  cancelButtonColor = '#d33',
  showCancelButton = false,
  onConfirm,
  onCancel,
  onClose
}: CustomAlertProps) {
  useEffect(() => {
    if (show) {
      MySwal.fire({
        title,
        text,
        icon,
        showCancelButton,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        confirmButtonColor,
        cancelButtonColor
      }).then((result) => {
        if (result.isConfirmed && onConfirm) {
          onConfirm()
        } else if (result.isDismissed && onCancel) {
          onCancel()
        }

        if (onClose) {
          onClose()
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  return null
}
