import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ListingForm from '@/components/listings/form';
import { listingService } from '@/services/listings-service';
import { CreateListingDTO, Listing } from '@/types/listings';

const EditListing = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        if (!id) return;
        
        setIsLoading(true);
        const data = await listingService.getListing(id);
        setListing(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Failed to load listing. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleSubmit = async (data: CreateListingDTO) => {
    try {
      if (!id) return;
      
      setIsSubmitting(true);
      await listingService.updateListing(id, data);
      // Show success message
      alert('Listing updated successfully!');
      // Redirect to listings page
      navigate('/listings');
    } catch (error) {
      console.error('Error updating listing:', error);
      alert('Failed to update listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-8 px-4">Loading listing data...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button 
          onClick={() => navigate('/listings')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back to Listings
        </button>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Listing not found
        </div>
        <button 
          onClick={() => navigate('/listings')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back to Listings
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Listing: {listing.propertyName}</h1>
      <ListingForm 
        initialData={listing} 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
};

export default EditListing;