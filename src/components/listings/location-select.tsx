"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, MapPin } from "lucide-react"
import { listingsService, type LocationDTO } from "@/services/listings-service"

interface LocationSelectProps {
  value: LocationDTO | null
  onChange: (location: LocationDTO) => void
  label?: string
  required?: boolean
}

export function LocationSelect({ value, onChange, label = "Location", required = false }: LocationSelectProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
// const [currentPage, setCurrentPage] = useState(1)
//   const pageSize, setPageSize] = useState(10)
  const {
    data: regionsData,
    isLoading,
    isError,
  } = useQuery({
     queryKey: ["regions",searchTerm],
        queryFn: () => listingsService.getRegions({
          searchString: searchTerm || undefined
        }),
        staleTime: 1000 * 60 * 5,
   
  })

  const regions = regionsData?.results || []

  const handleLocationSelect = (regionId: string) => {
    const selectedRegion = regions.find((region) => region.id === regionId)
    if (selectedRegion) {
      const locationDTO: LocationDTO = {
        id: selectedRegion.id,
        country: selectedRegion.country,
        region: selectedRegion.region,
        city: selectedRegion.city,
        postalCode: selectedRegion.postalCode,
      }
      onChange(locationDTO)
      setIsOpen(false)
    }
  }

  const getDisplayValue = () => {
    if (!value) return ""
    return `${value.region}, ${value.city}, ${value.country}`
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Select open={isOpen} onOpenChange={setIsOpen} value={value?.id || ""} onValueChange={handleLocationSelect}>
        <SelectTrigger className="w-full">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Search and select location">
              {value ? getDisplayValue() : "Search and select location"}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent>
          <div className="p-2">
            <Input
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm">Loading locations...</span>
            </div>
          ) : isError ? (
            <div className="p-4 text-center text-red-500 text-sm">Error loading locations</div>
          ) : regions.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              {searchTerm ? "No locations found" : "No locations available"}
            </div>
          ) : (
            regions.map((region) => (
              <SelectItem key={region.id} value={region.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{region.region}</span>
                  <span className="text-sm text-gray-500">
                    {region.city}, {region.country}
                    {region.postalCode && ` - ${region.postalCode}`}
                  </span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
