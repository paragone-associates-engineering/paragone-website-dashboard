
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface PropertyOwner {
  id: string
  name: string
  role: "OWNER" | "AGENT"
  address: string
  phone: string
  period?: string
  rating?: number
}

interface PropertyFeature {
  name: string
  available: boolean
}

const PropertyDetailPage = () => {
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [propertyImages] = useState([
    "https://res.cloudinary.com/dv0mdoa6b/image/upload/v1741899910/Copy_of_SPH_4945_1_ww61nd.png",
    "https://res.cloudinary.com/dv0mdoa6b/image/upload/v1741899893/Copy_of_Copy_of_SPH_4798_1_vwbn1u.png",
    "https://res.cloudinary.com/dv0mdoa6b/image/upload/v1741899944/Copy_of_SPH_5767_1_mabgwv.png",
    "https://res.cloudinary.com/dv0mdoa6b/image/upload/v1741899900/SPH_1010_1_nasenh.png",
  ])

  const propertyOwners: PropertyOwner[] = [
    {
      id: "1",
      name: "Levi Kusnandar",
      role: "OWNER",
      address: "Midnight Corner St, Suite 600 San Francisco, CA06 94107",
      phone: "+234 123 456 7890",
      rating: 5,
    },
    {
      id: "2",
      name: "Kevin Jean",
      role: "OWNER",
      address: "",
      phone: "",
      period: "2 June 2018 - 4 June 2019",
      rating: 5,
    },
    {
      id: "3",
      name: "Nabilla Henderson",
      role: "OWNER",
      address: "",
      phone: "",
      period: "2 June 2018 - 4 June 2019",
      rating: 4,
    },
    {
      id: "4",
      name: "William Smith",
      role: "OWNER",
      address: "",
      phone: "",
      period: "2 June 2018 - 4 June 2019",
      rating: 3,
    },
  ]

  const agent: PropertyOwner = {
    id: "5",
    name: "Robinson Geoff",
    role: "AGENT",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
    phone: "+234 123 456 7890",
  }

  const propertyFeatures: PropertyFeature[] = [
    { name: "Swimming pool", available: true },
    { name: "Air conditioning", available: true },
    { name: "Internet", available: true },
    { name: "Terrace", available: true },
    { name: "Coffee pot", available: true },
    { name: "Towelwes", available: true },
    { name: "Radio", available: true },
    { name: "Balcony", available: true },
    { name: "Roof terrace", available: true },
    { name: "Grill", available: true },
    { name: "Computer", available: true },
    { name: "Oven", available: true },
    { name: "Cable TV", available: true },
    { name: "Parquet", available: true },
  ]

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? propertyImages.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === propertyImages.length - 1 ? 0 : prev + 1))
  }

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? "text-primary fill-current" : "text-gray-300 fill-current"}`}
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
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
        <Button variant="outline" onClick={() => navigate("/property/edit/1")} className="absolute top-4 left-4 z-10">
          Edit Property
        </Button>
        <Badge className="absolute top-4 right-4 z-10 bg-green-500 hover:bg-green-600">Available</Badge>

        <div className="relative h-[500px] w-full overflow-hidden rounded-lg">
          <img
            src={propertyImages[currentImageIndex] || "/placeholder.svg"}
            alt="Property"
            className="h-full w-full object-cover"
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {propertyImages.map((_, index) => (
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
              <path d="m15 18-6-6 6-6" />
            </svg>
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
              className="h-4 w-4"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <span className="text-sm">
              {currentImageIndex + 1} of {propertyImages.length}
            </span>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="flex items-center gap-1">
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
              className="h-5 w-5 text-white"
            >
              <path d="M2 22h20" />
              <path d="M2 11h20" />
              <path d="M15 22v-4.3a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1V22" />
              <path d="M11 1h2a1 1 0 0 1 1 1v4h-4V2a1 1 0 0 1 1-1Z" />
              <path d="M6 12v-2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2" />
              <path d="M5 11v11" />
              <path d="M19 11v11" />
            </svg>
            <span className="text-white font-medium">4 Bedroom</span>
          </div>

          <div className="flex items-center gap-1">
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
              className="h-5 w-5 text-white"
            >
              <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
              <line x1="10" x2="8" y1="5" y2="7" />
              <line x1="2" x2="22" y1="12" y2="12" />
              <line x1="7" x2="7" y1="19" y2="21" />
              <line x1="17" x2="17" y1="19" y2="21" />
            </svg>
            <span className="text-white font-medium">2 Bathroom</span>
          </div>

          <div className="flex items-center gap-1">
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
              className="h-5 w-5 text-white"
            >
              <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
              <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
              <path d="M18 12a2 2 0 0 0 0 4h2v-4Z" />
            </svg>
            <span className="text-white font-medium">Wifi Available</span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Luxury Dream House T-001234</h2>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-gray-600">
              Laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
              esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
              qui officia deserunt mollit anim id est laborum.
            </p>
            <p className="text-gray-600 mt-2">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam
              rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
              explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
              dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora
              incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
              exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem
              vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui
              dolorem eum fugiat quo voluptas nulla pariatur?
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Gallery</h3>
            <div className="grid grid-cols-4 gap-4">
              {propertyImages.map((image, index) => (
                <div
                  key={index}
                  className="relative h-24 cursor-pointer overflow-hidden rounded-md"
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Property ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Location</h3>
            <div className="h-[300px] w-full rounded-md bg-gray-200">
              {/* Map placeholder */}
              <div className="h-full w-full flex items-center justify-center">
                <span className="text-gray-500">Map goes here</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {propertyFeatures.map((feature) => (
                <div key={feature.name} className="flex items-center gap-2">
                  <span className='bg-green-600 size-4 px-0.5 rounded-full flex items-center justify-center'><Check color='white'/></span>
                 
                  <span>{feature.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Owner History</h3>
            <div className="space-y-4">
              {propertyOwners.slice(1).map((owner) => (
                <div key={owner.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                      <div>
                        <h4 className="font-medium">{owner.name}</h4>
                        <p className="text-sm text-gray-500">{owner.period}</p>
                      </div>
                    </div>
                    {owner.rating && renderRatingStars(owner.rating)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Agent Information</h3>
            <div className="border rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-200"></div>
                <div>
                  <h4 className="font-medium">{agent.name}</h4>
                  <p className="text-sm text-primary">{agent.role}</p>
                  <p className="text-sm text-gray-500 mt-1">{agent.address}</p>
                  <p className="text-sm font-medium mt-1">{agent.phone}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button className="flex-1">Message</Button>
                <Button variant="outline" className="flex-1">
                  Call Agent
                </Button>
              </div>
            </div>
          </div>

          {/* <div>
            <h3 className="text-lg font-medium mb-4">Send Inquiry</h3>
            <div className="border rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter subject"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  rows={4}
                  placeholder="Enter your message"
                ></textarea>
              </div>
              <Button className="w-full">Send Inquiry</Button>
            </div>
          </div> */}
        </div>

        <div>
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gray-200 mb-4"></div>
              <h3 className="text-xl font-bold">{propertyOwners[0].name}</h3>
              <p className="text-primary font-medium">{propertyOwners[0].role}</p>
              <p className="text-sm text-gray-500 text-center mt-2">{propertyOwners[0].address}</p>
              <p className="text-sm font-medium mt-2">{propertyOwners[0].phone}</p>

              <div className="flex gap-2 mt-4">
                <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
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
                    className="h-4 w-4"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </button>
                <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
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
                    className="h-4 w-4"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </button>
                <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
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
                    className="h-4 w-4"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Price</h3>
            <div className="bg-blue-600 text-white p-6 rounded-md text-center">
              <p className="text-sm mb-1">Start from</p>
              <p className="text-3xl font-bold mb-1">₦ 500,000</p>
              <p className="text-xs">until $1,000k</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Property Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Property ID</span>
                <span className="font-medium">T-001234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Property Type</span>
                <span className="font-medium">House</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Property Status</span>
                <span className="font-medium">For Sale</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Property Size</span>
                <span className="font-medium">2,500 sqft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Year Built</span>
                <span className="font-medium">2020</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Bedrooms</span>
                <span className="font-medium">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Bathrooms</span>
                <span className="font-medium">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Garage</span>
                <span className="font-medium">2 cars</span>
              </div>
            </div>
          </div>

          {/* <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium mb-4">Schedule a Tour</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Date</label>
                <input
                  type="date"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Select Time</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none">
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>12:00 PM</option>
                  <option>1:00 PM</option>
                  <option>2:00 PM</option>
                  <option>3:00 PM</option>
                  <option>4:00 PM</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tour Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center border rounded-md p-3">
                    <input type="radio" name="tourType" id="inPerson" className="mr-2" />
                    <label htmlFor="inPerson">In Person</label>
                  </div>
                  <div className="flex items-center border rounded-md p-3">
                    <input type="radio" name="tourType" id="virtual" className="mr-2" />
                    <label htmlFor="virtual">Virtual</label>
                  </div>
                </div>
              </div>
              <Button className="w-full">Schedule Tour</Button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default PropertyDetailPage
