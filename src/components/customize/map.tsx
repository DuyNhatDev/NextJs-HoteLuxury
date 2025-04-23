import React from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import envConfig from '@/config'
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete'

const containerStyle = {
  width: '100%',
  height: '350px',
}

const center = {
  lat: 10.762622,
  lng: 106.660172,
}

export default async function Map() {
  return (
    <LoadScript googleMapsApiKey={envConfig.NEXT_PUBLIC_GG_MAP_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  )
}
