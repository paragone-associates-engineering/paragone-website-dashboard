// Existing types
export enum ListingType {
  FOR_SALE = 'For Sale',
  FOR_RENT = 'For Rent',
  SHORT_STAY = 'Short Stay',
  LAND = 'Land',
}

export enum PropertyCategory {
  RESIDENTIAL = 'Residential',
  COMMERCIAL = 'Commercial',
  INDUSTRIAL = 'Industrial',
}

export interface Landmarks {
  name: string;
  category: string;
  proximityToLocation: number;
}

export interface PropertyDetail {
  id: string;
  name: string;
  value: string | number | boolean;
}

export interface Listing {
  id: string;
  amount: number;
  area: number;
  propertyCategory: PropertyCategory;
  propertyType: string;
  propertyName: string;
  location:{region:string};
  listingType: ListingType;
  images: string[];
  description: string;
  landmarks?: Landmarks[];
  propertyDetails: PropertyDetail[];
  videoUrl: string;
  featured?: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListingsResponse {
  metadata: { total: number; totalPages: number }[]
  results: Listing[]
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// DTO types for API operations
export interface UpdateListingStatusDTO {
  isActive: boolean;
}

export interface CreateListingDTO {
  id?:string;
  amount: number;
  propertyName: string;
  area: number;
  propertyCategory: string;
  videoUrl: string;
  propertyType: string;
  location: string;
  listingType: string;
  description: string;
  landmarks?: Landmarks[];
  propertyDetails: PropertyDetail[];
  images?: string[]; // Optional for creation
}

// UpdateListingDTO extends CreateListingDTO but makes all fields optional
export type UpdateListingDTO = Partial<CreateListingDTO>;


