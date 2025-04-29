'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.fullscreen/Control.FullScreen.css'
import 'leaflet.fullscreen'

export default function FullscreenControl() {
  const map = useMap()

  useEffect(() => {
    L.control
      .fullscreen({
        position: 'topleft'
      })
      .addTo(map)
  }, [map])

  return null
}
