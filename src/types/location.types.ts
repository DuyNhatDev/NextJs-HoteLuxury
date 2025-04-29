export type Province = {
  idProvince: string
  name: string
}

export type District = {
  idProvince: string
  idDistrict: string
  name: string
}

export type Ward = {
  idDistrict: string
  idWard: string
  name: string
}

export type Location = {
  province: Province[]
  district: District[]
  ward: Ward[]
}

export type SelectLocation = {
  id: string
  name: string
}

export type Coordinates = {
  lat: number
  lng: number
}
