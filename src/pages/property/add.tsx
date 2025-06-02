import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingForm from '@/components/listings/form';
import { listingService, CreateListingDTO } from '@/services/listings-service';

const CreateListing = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateListingDTO) => {
    try {
      setIsSubmitting(true);
      await listingService.createListing(data);
      // Show success message
      alert('Listing created successfully!');
      // Redirect to listings page
      navigate('/listings');
    } catch (error) {
      console.error('Error creating listing:', error);
      //alert('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Create New Listing</h1>
      <ListingForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};

export default CreateListing;