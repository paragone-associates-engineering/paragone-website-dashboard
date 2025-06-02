import api from "@/lib/api"
import type { Listing, ListingsResponse, UpdateListingStatusDTO } from "@/types/listings"

export interface CreateListingDTO {
  amount: number
  propertyName: string
  area: number
  propertyCategory: string
  videoUrl: string
  propertyType: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  location:any
  listingType: string
  description: string
  landmarks?: {
    name: string
    category: string
    proximityToLocation: number
  }[]
  propertyDetails: {
    id: string
    name: string
    value: string | number | boolean
  }[]
  images?: string[] 
}

export interface RegionMetadata {
  total: number
  totalPages: number
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

export interface RegionsResponse {
  metadata: RegionMetadata[]
  results: Region[]
}

export interface CreateRegionDTO {
  country: string
  region: string
  city?: string
  postalCode?: string
  status?: string
}

export interface UpdateRegionDTO {
  country?: string
  region?: string
  city?: string
  postalCode?: string
   status?: string
  isActive?: boolean
}

export type UpdateListingDTO = Partial<CreateListingDTO>

export const listingService = {
  getListings: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get<ListingsResponse>("/listings/get-listings", { params })
    return response.data
  },

  getListing: async (listingId: string) => {
    const response = await api.get<Listing>(`/listings/get-listing/${listingId}`)
    return response.data
  },

  updateListingStatus: async (listingId: string, data: UpdateListingStatusDTO) => {
    const response = await api.patch<Listing>(`/listings/update-listing/${listingId}`, data)
    return response.data
  },

  deleteListing: async (listingId: string) => {
    const response = await api.delete<{ success: boolean }>(`/listings/delete-listing/${listingId}`)
    return response.data
  },

  createListing: async (data: CreateListingDTO) => {
    const response = await api.post<Listing>("/listings/create-listing", data)
    return response.data
  },

  updateListing: async (listingId: string, data: UpdateListingDTO) => {
    const response = await api.patch<Listing>(`/listings/update-listing/${listingId}`, data)
    return response.data
  },

  // Updated region methods
  getRegions: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get<RegionsResponse>("/listings/get-locations", { params })
    return response.data
  },

  createRegion: async (data: CreateRegionDTO) => {
    const response = await api.post<Region>("/listings/create-locations", { locations: [data] })
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
