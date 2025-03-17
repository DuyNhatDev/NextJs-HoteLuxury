'use client'

import Combobox from '@/components/customize/combobox'
import { useGetDistricts, useGetProvinces, useGetWards } from '@/queries/useLocation'
import { LocationInit } from '@/types/location.types'
import { useEffect, useState } from 'react'

export default function LocationSelector() {
  const [selectedProvince, setSelectedProvince] = useState<LocationInit>({ id: '', name: '' })
  const [selectedDistrict, setSelectedDistrict] = useState<LocationInit>({ id: '', name: '' })
  const [selectedWard, setSelectedWard] = useState<LocationInit>({ id: '', name: '' })

  const provincesQueries = useGetProvinces()
  const districtsQueries = useGetDistricts(selectedProvince.id)
  const wardsQueries = useGetWards(selectedDistrict.id)

  const provinces = provincesQueries.data?.payload || []
  const districts = districtsQueries.data?.payload || []
  const wards = wardsQueries.data?.payload || []

  return (
    <div className="space-y-4">
      <Combobox
        items={provinces.map((p) => ({ value: p.idProvince, label: p.name }))}
        placeholder="Chọn tỉnh/thành phố"
        onChange={(id) => {
          const selected = provinces.find((p) => p.idProvince === id)
          setSelectedProvince({ id, name: selected?.name || '' })
          setSelectedDistrict({ id: '', name: '' })
          setSelectedWard({ id: '', name: '' })
        }}
        value={selectedProvince.id}
      />
      <Combobox
        items={districts.map((d) => ({ value: d.idDistrict, label: d.name }))}
        placeholder="Chọn quận/huyện"
        onChange={(id) => {
          const selected = districts.find((d) => d.idDistrict === id)
          setSelectedDistrict({ id, name: selected?.name || '' })
          setSelectedWard({ id: '', name: '' })
        }}
        disabled={!selectedProvince.id}
        value={selectedDistrict.id}
      />
      <Combobox
        items={wards.map((w) => ({ value: w.idWard, label: w.name }))}
        placeholder="Chọn phường/xã"
        onChange={(id) => {
          const selected = wards.find((w) => w.idWard === id)
          setSelectedWard({ id, name: selected?.name || '' })
        }}
        disabled={!selectedDistrict.id}
        value={selectedWard.id}
      />
    </div>
  )
}
