import api from "@/lib/api"

export interface ListingTypeStats {
  listingType: string
  count: number
  percentage: number
}

export interface CityStats {
  city: string
  count: number
  percentage: number
}

export interface RegionStats {
  region: string
  count: number
  percentage: number
}

export interface CategoryStats {
  propertyCategory: string
  count: number
  percentage: number
}

export interface CountryStats {
  country: string
  count: number
  percentage: number
}

export interface AnalyticsResponse {
  totalListings: number
  listingTypeStats: ListingTypeStats[]
  cityStats: CityStats[]
  regionStats: RegionStats[]
  countryStats: CountryStats[]
  propertyCategoryStats: CategoryStats[]
}

export const analyticsService = {
  getListingsAnalytics: async () => {
    const response = await api.get<AnalyticsResponse>("/listings/get-analytics")
    return response.data
  },
}
