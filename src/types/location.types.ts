export interface Province {
  idProvince: string
  name: string
}

export interface District {
  idProvince: string
  idDistrict: string
  name: string
}

export interface Ward {
  idDistrict: string
  idWard: string
  name: string
}

export interface Location {
  province: Province[]
  district: District[]
  ward: Ward[]
}

export interface SelectLocation {
  id: string
  name: string
}

export interface Coordinates {
  lat: number
  lng: number
}
