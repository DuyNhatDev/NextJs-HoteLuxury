import fs from 'fs'
import path from 'path'
import { Location } from '@/types/location.types'
import { HttpError } from '@/lib/http'

const filePath = path.join(process.cwd(), 'src', 'data', 'location.json')

export async function GET() {
  try {
    const rawData = fs.readFileSync(filePath, 'utf-8')
    const locations: Location = JSON.parse(rawData) as Location
    return Response.json(locations.province)
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
