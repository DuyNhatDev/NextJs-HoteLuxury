'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { useGetCoordinates } from '@/queries/useLocation'
import { Spinner } from '@/components/ui/spinner'
import FullscreenControl from '@/components/customize/map-control'
import { Coordinates } from '@/types/location.types'
delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow
})

type MapProps = {
  address: string
}

export default function Map({ address }: MapProps) {
  const { data, isPending } = useGetCoordinates(address)
  const coordinate = data?.payload
  if (isPending)
    return (
      <div className='flex items-center justify-center py-8'>
        <Spinner>Đang tải bản đồ</Spinner>
      </div>
    )
  if (!coordinate || coordinate.length === 0) return <p className='text-red-500'>Lỗi khi tải bản đồ</p>
  const position: Coordinates = {
    lat: parseFloat(coordinate[0].lat),
    lng: parseFloat(coordinate[0].lon)
  }

  return (
    <MapContainer
      center={[position.lat, position.lng]}
      zoom={13}
      style={{ height: '320px', width: '100%', zIndex: 10 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <FullscreenControl />
      <Marker position={position}>
        <Popup>{address}</Popup>
      </Marker>
    </MapContainer>
  )
}
