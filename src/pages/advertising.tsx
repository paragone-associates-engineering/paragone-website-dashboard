/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react"

import { useState } from "react"
import { DataTable } from "@/components/shared/data-table"
import { FormContainer, FormField } from "@/components/shared/form-container"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Advertising {
  id: string
  type: "Image" | "Video"
  name: string
  launchDate: string
  duration: string
  status: "Active" | "Inactive"
  responses: number
}

const initialAdvertisings: Advertising[] = [
  {
    id: "1",
    type: "Image",
    name: "Property sale",
    launchDate: "13 Sep 23 17:02:24",
    duration: "7 days",
    status: "Active",
    responses: 342,
  },
  {
    id: "2",
    type: "Video",
    name: "Property promotion",
    launchDate: "20 Sep 23 17:02:24",
    duration: "3 days",
    status: "Inactive",
    responses: 350,
  },
  {
    id: "3",
    type: "Image",
    name: "Property rent",
    launchDate: "13 Sep 23 17:02:24",
    duration: "7 days",
    status: "Active",
    responses: 542,
  },
  {
    id: "4",
    type: "Video",
    name: "Short stay",
    launchDate: "13 Sep 23 17:02:24",
    duration: "7 days",
    status: "Active",
    responses: 124,
  },
]

const AdvertisingPage = () => {
  const [advertisings, setAdvertisings] = useState<Advertising[]>(initialAdvertisings)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
  })
  const [objectives, setObjectives] = useState<string[]>([])
  const [state, setState] = useState<string>("California")
  const [cities, setCities] = useState<string[]>(["Los Angeles", "Oakland", "San Diego", "Dublin"])
  const [advertisingImages, setAdvertisingImages] = useState<(string | null)[]>([null, null, null])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (index: number, file: File | null) => {
    const newImages = [...advertisingImages]
    newImages[index] = file ? URL.createObjectURL(file) : null
    setAdvertisingImages(newImages)
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...advertisingImages]
    newImages[index] = null
    setAdvertisingImages(newImages)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newAdvertising: Advertising = {
        id: (advertisings.length + 1).toString(),
        type: formData.type as "Image" | "Video",
        name: formData.name,
        launchDate: new Date().toLocaleString(),
        duration: "7 days",
        status: "Active",
        responses: 0,
      }
      setAdvertisings([...advertisings, newAdvertising])
      setFormData({
        name: "",
        type: "",
        description: "",
      })
      setObjectives([])
      setAdvertisingImages([null, null, null])
      setIsSubmitting(false)
    }, 1500)
  }

  const handleDelete = (advertising: Advertising) => {
    setAdvertisings(advertisings.filter((ad) => ad.id !== advertising.id))
  }

  const handleEdit = (advertising: Advertising) => {
    console.log("Edit advertising:", advertising)
    // Implement edit functionality
  }

  const columns = [
    {
      id: "checkbox",
      header: "",
      accessorKey: "checkbox",
      cell: () => null,
    },
    {
      id: "image",
      header: "",
      accessorKey: "image",
      cell: () => (
        <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
          <img src="https://res.cloudinary.com/dv0mdoa6b/image/upload/v1741265788/image_203_fo6jz2.png" alt="Advertising" className="size-full object-cover rounded-md" />
        </div>
      ),
    },
    {
      id: "type",
      header: "Advertising type",
      accessorKey: "type",
    },
    {
      id: "name",
      header: "Advertising name",
      accessorKey: "name",
    },
    {
      id: "launchDate",
      header: "Launching date and time",
      accessorKey: "launchDate",
    },
    {
      id: "duration",
      header: "Duration",
      accessorKey: "duration",
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => (
        <Badge
          className={
            info?.status === "Active"
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }
        >
          {info?.status}
        </Badge>
      ),
    },
    {
      id: "responses",
      header: "User response",
      accessorKey: "responses",
    },
  ]

  const actionMenu = {
    items: [
      {
        label: "Edit advertising",
        icon: <Pencil className="h-4 w-4" />,
        onClick: handleEdit,
      },
      {
        label: "Delete",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: handleDelete,
        className: "text-red-600",
      },
    ],
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Advertising</h1>
      </div>

      <div className="mb-6">
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">All advertising</h2>
          </div>

          <DataTable
            columns={columns}
            data={advertisings}
            actionMenu={actionMenu}
            pagination={{ pageSize: 10, totalItems: advertisings.length }}
            searchable={true}
            selectable={true}
          />
        </div>
      </div>

      <FormContainer
        title="Create Advertising"
        onSubmit={handleSubmit}
        onCancel={() => console.log("Cancelled")}
        submitLabel="Create advertising"
        isLoading={isSubmitting}
      >
        <FormField label="Advertising objective">
          <div className="relative">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select objective" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="promotion">Product and brand promotion</SelectItem>
                <SelectItem value="awareness">Brand awareness</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {objectives.map((objective, index) => (
                <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-sm">
                  <span>{objective}</span>
                  <button
                    type="button"
                    onClick={() => setObjectives(objectives.filter((_, i) => i !== index))}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </FormField>

        <FormField label="Advertising type" className="mt-4">
          <Select onValueChange={(value) => handleSelectChange("type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="affiliate">Affiliate or discount codes</SelectItem>
              <SelectItem value="social">Social media advertising</SelectItem>
              <SelectItem value="display">Display advertising</SelectItem>
              <SelectItem value="video">Video advertising</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <FormField label="State">
            <Select value={state} onValueChange={setState}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="California">California</SelectItem>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="Texas">Texas</SelectItem>
                <SelectItem value="Florida">Florida</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="City">
            <div className="relative">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="los-angeles">Los Angeles</SelectItem>
                  <SelectItem value="oakland">Oakland</SelectItem>
                  <SelectItem value="san-diego">San Diego</SelectItem>
                  <SelectItem value="dublin">Dublin</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {cities.map((city, index) => (
                  <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-sm">
                    <span>{city}</span>
                    <button
                      type="button"
                      onClick={() => setCities(cities.filter((_, i) => i !== index))}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </FormField>
        </div>

        <FormField label="Description" className="mt-4">
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Write description..."
            className="min-h-[100px]"
          />
        </FormField>

        <div className="mt-6">
          <h3 className="text-base font-medium mb-4">Upload with image/video preview</h3>
          <div className="grid grid-cols-4 gap-4">
            {advertisingImages.map((image, index) => (
              <div key={index} className="relative h-32 bg-gray-100 rounded-md flex items-center justify-center">
                {image ? (
                  <>
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="h-full w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                    onClick={() => {
                      const input = document.createElement("input")
                      input.type = "file"
                      input.accept = "image/*,video/*"
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0]
                        if (file) {
                          handleImageChange(index, file)
                        }
                      }
                      input.click()
                    }}
                  >
                    {index === 3 ? (
                      <>
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
                          className="h-6 w-6 text-gray-400"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" x2="12" y1="3" y2="15" />
                        </svg>
                        <span className="text-xs text-gray-500 mt-1">Upload</span>
                      </>
                    ) : (
                      <X className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                )}
              </div>
            ))}
            <div className="h-32 bg-gray-100 rounded-md flex flex-col items-center justify-center cursor-pointer">
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
                className="h-6 w-6 text-gray-400"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
              <span className="text-xs text-gray-500 mt-1">Upload</span>
            </div>
          </div>
        </div>
      </FormContainer>
    </div>
  )
}

export default AdvertisingPage
