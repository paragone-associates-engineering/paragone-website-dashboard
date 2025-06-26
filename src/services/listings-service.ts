import api from "@/lib/api"

export interface Landmarks {
  name: string
  category: string
  proximityToLocation: number
}

export enum ListingType {
  FOR_SALE = "For Sale",
  FOR_RENT = "For Rent",
  SHORT_STAY = "Short Stay",
  LAND = "Land",
}

export enum PropertyCategory {
  RESIDENTIAL = "Residential",
  COMMERCIAL = "Commercial",
  INDUSTRIAL = "Industrial",
  LAND = "Land",
}

export interface PropertyDetail {
  id: string
  name: string
  value: string | number | boolean
}

export interface LocationDTO {
  id?: string
  country?: string
  region?: string
  city?: string
  postalCode?: string
}

export interface Listing {
  _id: string
  id: string
  amount: number
  area: number
  propertyCategory: PropertyCategory
  propertyType: string
  propertyName: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  location:any
  listingType: ListingType
  images: string[]
  description: string
  propertyAgent?:PropertyOwnerAgent
    propertyOwner?:PropertyOwnerAgent
  landmarks?: Landmarks[]
  status?:string;
  propertyDetails: PropertyDetail[]
  videoUrl: string
  featured?: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ListingsMetadata {
  total: number
  totalPages: number
}

export interface ListingsResponse {
  metadata: ListingsMetadata[]
  results: Listing[]
}

export interface CreateListingDTO {
  amount: number
  propertyName: string
  area: number
  propertyCategory: PropertyCategory
  videoUrl: string
  propertyType: string
  location: LocationDTO
  listingType: ListingType
  description: string
   propertyAgent?:PropertyOwnerAgent
    propertyOwner?:PropertyOwnerAgent
  landmarks?: Landmarks[]
  propertyDetails: PropertyDetail[]
}

export interface ListingFormData {
  amount: number
  propertyName: string
  area: number
  propertyCategory: PropertyCategory
  videoUrl: string
  propertyType: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  location:any
  listingType: ListingType
   featured?:boolean;
  status?:string;
  description: string
   propertyAgent?:PropertyOwnerAgent
    propertyOwner?:PropertyOwnerAgent
  landmarks?: Landmarks[]
  propertyDetails?: PropertyDetail[]
   propertyDetail?: PropertyDetail[]
  images?: File[]
}

export interface UpdateListingStatusDTO {
  status?: string
  featured?:boolean
  isActive?: boolean
}

export interface UpdateListingDTO {
  amount?: number
  propertyName?: string
  area?: number
  propertyCategory?: PropertyCategory
  videoUrl?: string
  propertyType?: string
  status?:string;
  featured?:boolean;
  location?: LocationDTO;
  listingType?: ListingType
  description?: string
   propertyAgent?:PropertyOwnerAgent
    propertyOwner?:PropertyOwnerAgent
  landmarks?: Landmarks[]
  propertyDetails?: PropertyDetail[]
  isActive?: boolean
}
export interface Region {
  _id: string
  id: string
  country: string
  region: string
  city: string
  postalCode: string
  status: string
  isActive: boolean
  createdBy: string
  lastUpdatedBy: string
  createdAt: string
  updatedAt: string
  __v: number
}
export interface PropertyOwnerAgent {
   name?: string;
    address?: string;
    phone?: string;
    link?: string;
}

export interface CreateRegionDTO { 
  country: string; 
  region: string; 
  city?: string; 
  postalCode?: string; 
  status?: string }

export interface UpdateRegionDTO { 
  country?: string;
  region?: string; 
  city?: string; 
  postalCode?: string; 
  status?: string; 
  isActive?: boolean }

export interface RegionMetadata {
  total: number
  totalPages: number
}

export interface RegionsResponse {
  metadata: RegionMetadata[]
  results: Region[]
}

export enum STATUS {
  PENDING = "Pending",
  NEGOTIATION = "Negotiation",
  INSPECTION = "Inspection",
  CLOSED= "Closed",
  OFFMARKET = "Off Market",
  PAID = "Paid",
}

export const propertyTypesByCategory: Record<PropertyCategory.RESIDENTIAL | PropertyCategory.COMMERCIAL | PropertyCategory.LAND, string[]> = {
  [PropertyCategory.RESIDENTIAL]: [
    "Bungalow", 
    "Apartment", 
    "Townhouse", 
    "Duplex", 
    "Semi Detached", 
    "Detached", 
    "Terrace", 
    "Penthouse", 
    "Maisonette", 
    "Triplex", 
    "Mixed Used"
  ],
  [PropertyCategory.COMMERCIAL]: [
    "Co-working", 
    "Retail", 
    "Office Building", 
    "Special Purpose", 
    "Mix Used Development"
  ],
  [PropertyCategory.LAND]: [
    "Residential", 
    "Commercial", 
    "Agriculture"
  ]
}
export const listingsService = {
  getListings: async (params?: { page?: number; limit?: number; searchString?: string }) => {
    const response = await api.get<ListingsResponse>("/listings/get-listings", { params })
    return response.data
  },

  getListing: async (listingId: string) => {
    const response = await api.get<Listing>(`/listings/get-listing/${listingId}`)
    return response.data
  },

  createListing: async (listingData: ListingFormData) => {
    try {
      const formData = new FormData()

      const listingDTO: CreateListingDTO = {
        amount: listingData.amount,
        propertyName: listingData.propertyName,
        area: listingData.area,
        propertyCategory: listingData.propertyCategory,
        videoUrl: listingData.videoUrl,
        propertyType: listingData.propertyType,
        location: listingData.location,
        propertyAgent:{name: listingData?.propertyAgent?.name, address:listingData?.propertyAgent?.address, phone:listingData?.propertyAgent?.phone, link:listingData?.propertyAgent?.link},
        propertyOwner:{name: listingData?.propertyOwner?.name, address:listingData?.propertyOwner?.address, phone:listingData?.propertyOwner?.phone, link:listingData?.propertyOwner?.link},
        listingType: listingData.listingType,
        description: listingData.description,
        landmarks: listingData.landmarks,
        propertyDetails: listingData?.propertyDetails || [],
      }

      formData.append("metadata", JSON.stringify(listingDTO))

      if (listingData.images && listingData.images.length > 0) {
        listingData.images.forEach((image) => {
          formData.append("images", image)
        })
      }

      const response = await api.post("/listings/create-listing", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error) {
      console.error("Error creating listing:", error)
      throw error
    }
  },
  updateListing: async (listingId: string, listingData: ListingFormData) => {
    try {
      const formData = new FormData()

      const listingDTO: UpdateListingDTO = {
        amount: listingData.amount,
        propertyName: listingData.propertyName,
        area: listingData.area,
        status:listingData.status,
        propertyCategory: listingData.propertyCategory,
        videoUrl: listingData.videoUrl,
        propertyType: listingData.propertyType,
        location: {id:listingData.location.id, country:listingData.location.country, region:listingData.location.region, city:listingData.location.city, postalCode:listingData.location.postalCode},
        propertyAgent:{name: listingData?.propertyAgent?.name, address:listingData?.propertyAgent?.address, phone:listingData?.propertyAgent?.phone, link:listingData?.propertyAgent?.link},
        propertyOwner:{name: listingData?.propertyOwner?.name, address:listingData?.propertyOwner?.address, phone:listingData?.propertyOwner?.phone, link:listingData?.propertyOwner?.link},
        listingType: listingData.listingType,
        description: listingData.description,
        landmarks: listingData.landmarks,
        propertyDetails: listingData.propertyDetails,
      }

      formData.append("metadata", JSON.stringify(listingDTO))

      if (listingData.images && listingData.images.length > 0) {
        listingData.images.forEach((image) => {
          formData.append("images", image)
        })
      }

      const response = await api.post(`/listings/update/${listingId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error) {
      console.error("Error creating listing:", error)
      throw error
    }
  },
// updateListing: async (listingId: string, data: UpdateListingDTO) => {
//     const response = await api.post<Listing>(`/listings/update/${listingId}`, data)
//     return response.data
//   },
  updateListingStatus: async (listingId: string, data: UpdateListingStatusDTO) => {
    const formData = new FormData()
       formData.append("metadata", JSON.stringify(data))
    const response = await api.post<Listing>(`/listings/update/${listingId}`, formData)
    return response.data
  },

  deleteListing: async (listingId: string) => {
    const response = await api.delete<{ success: boolean }>(`/listings/update/${listingId}`)
    return response.data
  },

  
  getRegions: async (params?: { page?: number; limit?: number; searchString?: string }) => {
    const response = await api.get<RegionsResponse>("/listings/get-locations", { params })
    return response.data
  },
 createRegion: async (data: CreateRegionDTO) => { 
  const response = await api.post<Region>("/listings/create-location", data) 
 return response.data 
},

updateRegion: async (id: string, data: UpdateRegionDTO) => { 
  const response = await api.post<Region>(`/listings/update-location/${id}`, data) 
return response.data 
},

getLocations: async () => { 
  const response = await api.get<RegionsResponse>("/listings/get-locations") 
  return response.data 
},

createLocation: async (data: { locations: string[] }) => { 
  const response = await api.post<string[]>("/listings/create-locations", data) 
  return response.data 
},
 }
