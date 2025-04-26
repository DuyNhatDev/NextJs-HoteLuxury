'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
export default function BookingForm() {
  return (
    <Card className="w-full rounded p-2">
      <CardHeader className="px-0">
        <CardTitle className="text-blue-900">Thông tin người đặt</CardTitle>
        <CardDescription className="italic">Vui lòng điền đầy đủ thông tin</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  )
}
