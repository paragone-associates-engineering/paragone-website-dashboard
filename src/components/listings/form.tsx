import React, { useState } from 'react';
import { Listing, ListingType, PropertyDetail, Landmarks } from '@/types/listings';
import { CreateListingDTO, listingService } from '@/services/listings-service';
import { Button } from '../ui/button';
import { useNavigate } from "react-router-dom"
import { FormContainer } from '../shared/form-container';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner"

interface ListingFormProps {
  initialData?: Partial<Listing>;
  onSubmit: (data: CreateListingDTO) => Promise<void>;
  isSubmitting: boolean;
}

const generateId = () => {
  return 'PREF-' + Math.random().toString(36).substring(2, 15);
};

const ListingForm: React.FC<ListingFormProps> = ({ initialData }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<Partial<CreateListingDTO>>({
    amount: initialData?.amount || 0,
    propertyName: initialData?.propertyName || '',
    area: initialData?.area || 0,
    propertyCategory: initialData?.propertyCategory || 'Residential',
    videoUrl: initialData?.videoUrl || '',
    propertyType: initialData?.propertyType || '',
    location: initialData?.location || '',
    listingType: initialData?.listingType || ListingType.FOR_SALE,
    description: initialData?.description || '',
    landmarks: initialData?.landmarks || [],
    propertyDetails: initialData?.propertyDetails || []
  });

  const [newLandmark, setNewLandmark] = useState<Partial<Landmarks>>({
    name: '',
    category: '',
    proximityToLocation: 0
  });

  const [newPropertyDetail, setNewPropertyDetail] = useState<Partial<PropertyDetail>>({
    name: '',
    value: ''
  });
const [propertyImages, setPropertyImages] = useState<File[]>([]);
console.log(propertyImages)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

 const addLandmark = () => {
  if (newLandmark.name && newLandmark.category && newLandmark.proximityToLocation) {
    const updatedLandmarks = [
      ...(formData.landmarks || []),
      {
        name: newLandmark.name,
        category: newLandmark.category,
        proximityToLocation: Number(newLandmark.proximityToLocation)
      }
    ];
    setFormData((prev) => ({
      ...prev,
      landmarks: updatedLandmarks
    }));
    setNewLandmark({ name: '', category: '', proximityToLocation: 0 });
  }
};


  const removeLandmark = (index: number) => {
    const updatedLandmarks = [...(formData.landmarks || [])];
    updatedLandmarks.splice(index, 1);
    setFormData({
      ...formData,
      landmarks: updatedLandmarks
    });
  };

 const addPropertyDetail = () => {
  if (newPropertyDetail.name && newPropertyDetail.value !== undefined) {
    const updatedDetails = [
      ...(formData.propertyDetails || []),
      {
        id: generateId(),
        name: newPropertyDetail.name,
        value: newPropertyDetail.value
      }
    ];
    setFormData((prev) => ({
      ...prev,
      propertyDetails: updatedDetails
    }));
    setNewPropertyDetail({ name: '', value: '' });
  }
};


  const createListingMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (data: any) => {
      const listingData = {
        amount: data?.amount,
    propertyName: data?.propertyName,
    area: data?.area,
    propertyCategory: data?.propertyCategory,
    videoUrl: data?.videoUrl,
    propertyType: data?.propertyType,
    location: data?.location,
    listingType: data?.listingType,
    description: data?.description,
    landmarks: data?.landmarks,
   // propertyDetails: data?.propertyDetails,
   propertyDetails: [
          ...(data.propertyDetails || []),
          {
            id: generateId(),
            name: newPropertyDetail.name,
            value: newPropertyDetail.value
          }
        ],
        //images: propertyImages ? [URL.createObjectURL(propertyImages)] : [],
        // propertyDetails: [
        //   ...(data.propertyDetails || []),
        //   {
        //     id: generateId(),
        //     name: newPropertyDetail.name,
        //     value: newPropertyDetail.value
        //   }
        // ]
      }
      //const formDataObj = new FormData();
// propertyImages.forEach((img) => formDataObj.append('images', img));

// formDataObj.append('metdata', listingData || []);
// // ... and so on for other fields

//return listingService.createListing(formData);

      //console.log('listing', data)
      return listingService.createListing(listingData)
    },
    onSuccess: () => {
      toast.success("Listing post created successfully")
      queryClient.invalidateQueries({ queryKey: ["listings"] })
      navigate("/blog/list")
    },
    onError: (error) => {
      console.error("Error creating blog post:", error)
      toast.error("Failed to create blog post")
    },
  })

  
  const removePropertyDetail = (index: number) => {
    const updatedDetails = [...(formData.propertyDetails || [])];
    updatedDetails.splice(index, 1);
    setFormData({
      ...formData,
      propertyDetails: updatedDetails
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (createListingMutation.isPending) return; 
      createListingMutation.mutate(formData)
    }
  const handleCancel = () => {
    navigate("/blog/list")
  }


  return (
   <FormContainer
              title="Add New Property"
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              submitLabel="Create"
              isLoading={createListingMutation.isPending}
            >
              <h1 className='text-2xl font-bold mb-5'>Still in Major Progress</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Property Name</label>
          <input
            type="text"
            name="propertyName"
            value={formData.propertyName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Area (sq ft)</label>
          <input
            type="number"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Property Category</label>
          <select
            name="propertyCategory"
            value={formData.propertyCategory}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Property Type</label>
          <input
            type="text"
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            placeholder="e.g. Duplex, Apartment, etc."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Listing Type</label>
          <select
            name="listingType"
            value={formData.listingType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value={ListingType.FOR_SALE}>For Sale</option>
            <option value={ListingType.FOR_RENT}>For Rent</option>
            <option value={ListingType.SHORT_STAY}>Short Stay</option>
            <option value={ListingType.LAND}>Land</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Video URL</label>
          <input
            type="url"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="YouTube or Vimeo URL"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={4}
          required
        />
      </div>
      
      {/* Landmarks Section */}
      <div className="border p-4 rounded">
        <h3 className="font-medium mb-3">Landmarks</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={newLandmark.name}
              onChange={(e) => setNewLandmark({...newLandmark, name: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              value={newLandmark.category}
              onChange={(e) => setNewLandmark({...newLandmark, category: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="e.g. Estate, Shopping, etc."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Distance (km)</label>
            <input
              type="number"
              value={newLandmark.proximityToLocation}
              onChange={(e) => setNewLandmark({...newLandmark, proximityToLocation: parseFloat(e.target.value)})}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <Button 
          type="button" 
          variant='outline'
          onClick={addLandmark}
          className="px-4 py-2"
        >
          + Add Landmark
        </Button>
        
        {formData.landmarks && formData.landmarks.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Added Landmarks:</h4>
            <ul className="space-y-2">
              {formData.landmarks.map((landmark, index) => (
                <li key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                  <span>
                    {landmark.name} ({landmark.category}) - {landmark.proximityToLocation}km
                  </span>
                  <button 
                    type="button" 
                    onClick={() => removeLandmark(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Property Details Section */}
      <div className="border p-4 rounded">
        <h3 className="font-medium mb-3">Property Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={newPropertyDetail.name}
              onChange={(e) => setNewPropertyDetail({...newPropertyDetail, name: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="e.g. bedrooms, bathrooms, etc."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Value</label>
            <input
              type="text"
              value={typeof newPropertyDetail.value === "boolean" ? String(newPropertyDetail.value) : newPropertyDetail.value ?? ""}
              onChange={(e) => setNewPropertyDetail({...newPropertyDetail, value: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <Button 
          type="button" 
          variant='outline'
          onClick={addPropertyDetail}
          className="px-4 py-2 "
        >
          + Add Property Detail
        </Button>
        
        {formData.propertyDetails && formData.propertyDetails.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Added Property Details:</h4>
            <ul className="space-y-2">
              {formData.propertyDetails.map((detail, index) => (
                <li key={detail.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                  <span>
                    {detail.name}: {String(detail.value)}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => removePropertyDetail(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      
      </div>
      
      {/* <div className="mt-6">
        <Button 
          type="button" 
          disabled={isSubmitting}
          className="w-full md:w-auto px-6 py-2 "
        >
          {isSubmitting ? 'Submitting...' : initialData?.id ? 'Update Listing' : 'Create Listing'}
        </Button>
      </div> */}
        <div className="lg:col-span-1">
                 <input
  type="file"
  multiple
  accept="image/*"
  onChange={(e) => {
    const files = e.target.files;
    if (files) {
      setPropertyImages(Array.from(files));
    }
  }}
/>

                </div>
    </FormContainer>
  );
};

export default ListingForm;