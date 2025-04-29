import fs from 'fs'
import path from 'path'
import { Location } from '@/types/location.types'
import { HttpError } from '@/lib/http'

const filePath = path.join(process.cwd(), 'src', 'data', 'location.json')

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const parentId = searchParams.get('parentId')
    if (!parentId) {
      return Response.json({ error: 'Thiếu parentId' }, { status: 400 })
    }
    const rawData = fs.readFileSync(filePath, 'utf-8')
    const locations: Location = JSON.parse(rawData) as Location
    const wards = locations.ward.filter((ward) => ward.idDistrict === parentId)

    return Response.json(wards)
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      })
    } else {
      return Response.json(
        {
          message: 'Có lỗi xảy ra'
        },
        {
          status: 500
        }
      )
    }
  }
}
