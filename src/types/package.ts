export interface PackageDetail {
  title: string
  amount?: number
  _id?: string
}

export interface Package {
  _id?: string
  id: string
  name: string
  level: string
  price: number
  duration: string
  details: PackageDetail[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  __v?: number
}

export interface CreatePackageDTO {
  id?:string
  name: string
  level: string
  price: number
  duration: string
  details: PackageDetail[]
  isActive?: boolean
}

