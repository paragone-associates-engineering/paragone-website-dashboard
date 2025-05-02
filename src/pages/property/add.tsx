
import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FormContainer,
  FormSection,
  FormRow,
  FormField,
  FormImageUpload,
  FormTagsInput,
} from "@/components/shared/form-container"

const propertyTypes = ["Bungalow", "Apartment", "Duplex", "Villa", "Penthouse", "Mansion", "Studio", "Townhouse"]

const AddPropertyPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    address: "",
    city: "",
    region: "",
    zipCode: "",
    country: "",
    size: "",
    bedrooms: "",
    bathrooms: "",
    purpose: "Sale",
    salePrice: "",
    rentPrice: "",
    shortStayPrice: "",
    landPrice: "",
    videoLink: "",
    ownerName: "",
    ownerAddress: "",
    ownerContact: "",
    ownerSocialLink: "",
    agentName: "",
    agentAddress: "",
    agentContact: "",
    agentSocialLink: "",
  })
  const [propertyImage, setPropertyImage] = useState<string | null>(null)
  const [propertyTags] = useState<string[]>([])
  const [generalAmenities, setGeneralAmenities] = useState<string[]>([])
  const [bedroomAmenities] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", {
        ...formData,
        propertyImage,
        propertyTags,
        generalAmenities,
        bedroomAmenities,
      })
      setIsSubmitting(false)
      // Reset form or redirect
    }, 1500)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add property</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
      <FormContainer
        title="Add property"
        onSubmit={handleSubmit}
        onCancel={() => console.log("Cancelled")}
        submitLabel="Add property"
        isLoading={isSubmitting}
       
      >
        <FormSection title="Property Information">
          <FormRow>
            <FormField label="Property name" required>
              <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter property name" />
            </FormField>

            <FormField label="Property type" required>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </FormRow>

          <FormField label="Description" className="mt-4">
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Product descriptions..."
              className="min-h-[100px]"
            />
          </FormField>

          {/* <FormImageUpload
            label="Property Image"
            onChange={(file) => setPropertyImage(file ? URL.createObjectURL(file) : null)}
            value={propertyImage}
            className="mt-4"
          /> */}
        </FormSection>

        <FormSection title="Property location" collapsible>
          <FormField label="Property address" required>
            <Input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter property address"
            />
          </FormField>

          <FormRow className="mt-4">
            <FormField label="Property city">
              <Input name="city" value={formData.city} onChange={handleInputChange} placeholder="Enter property city" />
            </FormField>

            <FormField label="Property region">
              <Select value={formData.region} onValueChange={(value) => handleSelectChange("region", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lagos">Lagos</SelectItem>
                  <SelectItem value="abuja">Abuja</SelectItem>
                  <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Property ZIP code">
              <Input
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="Enter property ZIP code"
              />
            </FormField>
          </FormRow>

          <FormField label="Property country" className="mt-4">
            <Select value={formData.country} onValueChange={(value) => handleSelectChange("country", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Enter property country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nigeria">Nigeria</SelectItem>
                <SelectItem value="ghana">Ghana</SelectItem>
                <SelectItem value="kenya">Kenya</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

            <div className=" mt-4 h-[200px] bg-gray-100 rounded-md">
                <img src='https://res.cloudinary.com/dv0mdoa6b/image/upload/v1745510784/Img_2_e2wn6k.png' alt='property map' className='h-full w-full'/>
            </div>
          
        </FormSection>

        <FormSection title="Property specification" collapsible className='w-full'>
          <FormRow className='lg:!grid-cols-2'>
            <FormField label="Property purpose">
              <Select value={formData.purpose} onValueChange={(value) => handleSelectChange("purpose", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sale">Sale</SelectItem>
                  <SelectItem value="Rent">Rent</SelectItem>
                  <SelectItem value="Short Stay">Short Stay</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Property size">
              <Input name="size" value={formData.size} onChange={handleInputChange} placeholder="Enter size" />
            </FormField>
          </FormRow>

          <FormRow className="mt-4 w-full lg:!grid-cols-2">
            <FormField label="Property bed rooms">
              <Input
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                placeholder="Enter rooms"
                type="number"
              />
            </FormField>

            <FormField label="Property bathrooms">
              <Input
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                placeholder="Enter bathrooms"
                type="number"
              />
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Property owner" collapsible>
          <FormRow  className='lg:!grid-cols-2'>
            <FormField label="Owner name">
              <Input
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                placeholder="Owner name here..."
              />
            </FormField>

            <FormField label="Owner address">
              <Input
                name="ownerAddress"
                value={formData.ownerAddress}
                onChange={handleInputChange}
                placeholder="Enter address"
              />
            </FormField>
          </FormRow>

          <FormRow className="mt-4 lg:!grid-cols-2">
            <FormField label="Owner contact number">
              <Input
                name="ownerContact"
                value={formData.ownerContact}
                onChange={handleInputChange}
                placeholder="Enter contact number"
              />
            </FormField>

            <FormField label="Owner social link">
              <Input
                name="ownerSocialLink"
                value={formData.ownerSocialLink}
                onChange={handleInputChange}
                placeholder="Enter link"
              />
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Property pricing" collapsible>
          <FormRow  className='lg:!grid-cols-2'>
            <FormField label="Property sale price">
              <Input
                name="salePrice"
                value={formData.salePrice}
                onChange={handleInputChange}
                placeholder="Enter amount"
                type="number"
              />
            </FormField>

            <FormField label="Property rent price">
              <Input
                name="rentPrice"
                value={formData.rentPrice}
                onChange={handleInputChange}
                placeholder="Enter amount"
                type="number"
              />
            </FormField>
          </FormRow>

          <FormRow className="mt-4 lg:!grid-cols-2">
            <FormField label="Property short stay price">
              <Input
                name="shortStayPrice"
                value={formData.shortStayPrice}
                onChange={handleInputChange}
                placeholder="Enter amount"
                type="number"
              />
            </FormField>

            <FormField label="Land price">
              <Input
                name="landPrice"
                value={formData.landPrice}
                onChange={handleInputChange}
                placeholder="Enter amount"
                type="number"
              />
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Property video" collapsible>
          <FormField label="Property video link">
            <Input
              name="videoLink"
              value={formData.videoLink}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/"
            />
          </FormField>
        </FormSection>

        <FormSection title="Property agent" collapsible>
          <FormRow  className='lg:!grid-cols-2'>
            <FormField label="Property agent name">
              <Input
                name="agentName"
                value={formData.agentName}
                onChange={handleInputChange}
                placeholder="Agent name here..."
              />
            </FormField>

            <FormField label="Agent address">
              <Input
                name="agentAddress"
                value={formData.agentAddress}
                onChange={handleInputChange}
                placeholder="Enter agent address"
              />
            </FormField>
          </FormRow>

          <FormRow className="mt-4 lg:!grid-cols-2">
            <FormField label="Agent contact number">
              <Input
                name="agentContact"
                value={formData.agentContact}
                onChange={handleInputChange}
                placeholder="Enter contact number"
              />
            </FormField>

            <FormField label="Agent social link">
              <Input
                name="agentSocialLink"
                value={formData.agentSocialLink}
                onChange={handleInputChange}
                placeholder="Enter link here"
              />
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="General amenities" collapsible>
          <FormTagsInput
            label="Enter amenities"
            value={generalAmenities}
            onChange={setGeneralAmenities}
            suggestions={["Parking", "Wi-Fi", "Security system", "Elevator"]}
          />
        </FormSection>
      </FormContainer>
      </div>

       <div className="lg:col-span-1">
       <FormImageUpload
            label="Property Image"
            onChange={(file) => setPropertyImage(file ? URL.createObjectURL(file) : null)}
            value={propertyImage}
            className="mt-4"
          />
              </div>
              </div>
    </div>
  )
}

export default AddPropertyPage
