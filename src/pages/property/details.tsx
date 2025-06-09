
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, Loader2, MapPin, Home, DollarSign, Calendar, Video } from "lucide-react"
import { listingsService } from "@/services/listings-service"

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const {
    data: listing,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => listingsService.getListing(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })

  const handlePrevImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1))
    }
  }

  const handleNextImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1))
    }
  }

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const handleEdit = () => {
    navigate(`/property/edit/${id}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading property details...</span>
      </div>
    )
  }

  if (isError || !listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/property-listing")}>Back to Listings</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Property Detail</h1>
      </div>

      <div className="relative">
        <Button variant="outline" onClick={handleEdit} className="absolute top-4 left-4 z-10">
          Edit Property
        </Button>
        <Badge
          className={`absolute top-4 right-4 z-10 ${
            listing.isActive ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
          }`}
        >
          {listing.isActive ? "Active" : "Inactive"}
        </Badge>
        { listing.featured && (
          <Badge
          className={`absolute top-12 right-4 z-10 ${
            listing.featured ? "bg-yellow-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
          }`}
        >
          {listing.featured ? "Featured" : ""}
        </Badge>
        )}
        

        {listing.images && listing.images.length > 0 ? (
          <div className="relative h-[500px] w-full overflow-hidden rounded-lg">
            <img
              src={listing.images[currentImageIndex] || "/placeholder.svg"}
              alt={listing.propertyName}
              className="h-full w-full object-cover"
            />

            {listing.images.length > 1 && (
              <>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  {listing.images.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 w-8 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>

                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white"
                  onClick={handlePrevImage}
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white"
                  onClick={handleNextImage}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>

                <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-md bg-black/50 px-3 py-1 text-white">
                  <span className="text-sm">
                    {currentImageIndex + 1} of {listing.images.length}
                  </span>
                </div>
              </>
            )}

            {/* Property details overlay */}
            <div className="absolute bottom-4 left-4 flex items-center gap-4">
              {listing.propertyDetails?.find((detail) => detail.name === "bedrooms") && (
                <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded">
                  <Home className="h-4 w-4 text-white" />
                  <span className="text-white font-medium">
                    {listing.propertyDetails.find((detail) => detail.name === "bedrooms")?.value} Bedroom
                    {Number(listing.propertyDetails.find((detail) => detail.name === "bedrooms")?.value) !== 1
                      ? "s"
                      : ""}
                  </span>
                </div>
              )}

              {listing.propertyDetails?.find((detail) => detail.name === "bathrooms") && (
                <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded">
                  <span className="text-white font-medium">
                    {listing.propertyDetails.find((detail) => detail.name === "bathrooms")?.value} Bathroom
                    {Number(listing.propertyDetails.find((detail) => detail.name === "bathrooms")?.value) !== 1
                      ? "s"
                      : ""}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded">
                <span className="text-white font-medium">{listing.area} sqft</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative h-[500px] w-full overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No images available</span>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">{listing.propertyName}</h2>

          {listing.description && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{listing.description}</p>
            </div>
          )}

          {listing.images && listing.images.length > 1 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Gallery</h3>
              <div className="grid grid-cols-4 gap-4">
                {listing.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative h-24 cursor-pointer overflow-hidden rounded-md"
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${listing.propertyName} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Location
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">
                {listing.location.region}, {listing.location.city}
              </p>
              <p className="text-sm text-gray-600">{listing.location.country}</p>
              {listing.location.postalCode && (
                <p className="text-sm text-gray-600">Postal Code: {listing.location.postalCode}</p>
              )}
            </div>
          </div>

          {listing.propertyDetails && listing.propertyDetails.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listing.propertyDetails.map((detail) => (
                  <div key={detail.id} className="flex items-center gap-2">
                    <span className="bg-green-600 size-4 px-0.5 rounded-full flex items-center justify-center">
                      <Check color="white" className="h-3 w-3" />
                    </span>
                    <span className="capitalize">
                      {detail.name.replace("_", " ")}:{" "}
                      {typeof detail.value === "boolean" ? (detail.value ? "Yes" : "No") : detail.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {listing.landmarks && listing.landmarks.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Nearby Landmarks</h3>
              <div className="space-y-3">
                {listing.landmarks.map((landmark, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div>
                      <p className="font-medium">{landmark.name}</p>
                      <p className="text-sm text-gray-500">{landmark.category}</p>
                    </div>
                    <Badge variant="outline">{landmark.proximityToLocation}km</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {listing.videoUrl && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Video className="h-5 w-5 mr-2" />
                Property Video
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <a
                  href={listing.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2"
                >
                  <Video className="h-4 w-4" />
                  View Property Video
                </a>
              </div>
            </div>
          )}
        <div className="grid md:grid-cols-2 gap-3">
{listing?.propertyOwner?.name && (
          <div className="bg-[#EFF3F5] max-w-sm rounded-2xl p-5 space-y-2"> 
         <h3 className="font-semibold text-lg capitalize">{listing?.propertyOwner?.name}</h3>
         <h4 className="text-green-500 font-semibold uppercase">Owner</h4>
         <p>{listing?.propertyOwner?.address}</p>
         <p>{listing?.propertyOwner?.phone}</p>
          <a className="text-blue-600 hover:text-blue-800 underline" href={listing?.propertyOwner?.link}>Social link</a>
          </div>
          )}

          {listing?.propertyAgent?.name && (
          <div className="bg-[#EFF3F5] max-w-sm rounded-2xl p-5 space-y-2"> 
         <h3 className="font-semibold text-lg capitalize">{listing?.propertyAgent?.name}</h3>
         <h4 className="text-green-500 font-semibold">AGENT</h4>
         <p>{listing?.propertyAgent?.address}</p>
         <p>{listing?.propertyAgent?.phone}</p>
          <a className="text-blue-600 hover:text-blue-800 underline" href={listing?.propertyAgent?.link}>Social link</a>
          </div>
          )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Price
            </h3>
            <div className="bg-blue-600 text-white p-6 rounded-md text-center">
              <p className="text-sm mb-1">{listing.listingType}</p>
              <p className="text-3xl font-bold mb-1">₦{formatNumber(listing.amount)}</p>
              <p className="text-xs">{listing.propertyCategory}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Property Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Property ID</span>
                <span className="font-medium">{listing.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Property Type</span>
                <span className="font-medium">{listing.propertyType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Property Category</span>
                <span className="font-medium">{listing.propertyCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Listing Type</span>
                <span className="font-medium">{listing.listingType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Property Size</span>
                <span className="font-medium">{listing.area.toLocaleString()} sqft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <Badge variant={listing.isActive ? "default" : "secondary"}>
                  {listing.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              {listing.featured && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Featured</span>
                  <Badge variant="default">Yes</Badge>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Property Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-500 text-sm">Created</span>
                <p className="font-medium">{new Date(listing.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Last Updated</span>
                <p className="font-medium">{new Date(listing.updatedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Location</span>
                <p className="font-medium">
                  {listing.location.region}, {listing.location.city}
                </p>
                <p className="text-sm text-gray-600">{listing.location.country}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
