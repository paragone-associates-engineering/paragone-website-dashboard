export interface AuditingDto {
    createdAt: Date
    updatedAt: Date
    createdBy?: string
    lastUpdatedBy?: string
  }
  
  export type OmitDTO<T> = Omit<T, keyof AuditingDto | "_id" | "__v">
  
  export interface Resource extends AuditingDto {
    id: string
    title: string
    summary: string
    link: string
    image: string
    isPaid: boolean
    price?: {
      amount: number
      currency: string
    }
    isActive: boolean
  }
  
  export interface CreateResourceRequestDTO extends Omit<OmitDTO<Resource>, "image"> {
    image: File[]
  }
  
  export interface CreateResourceDTO extends OmitDTO<Resource> {
    id: string
  }
  
  export interface ResourceApplication extends AuditingDto {
    id: string
    resourceId: string
    resourceTitle: string
    applicantName: {first: string; lastName: string}
    email: string
    phoneNumber: string
    message?: string
    isActive: boolean
  }
  
  export interface ResourcesResponse {
    metadata: { total: number; totalPages: number }[]
    results: Resource[]
  }
  
  export interface ResourceApplicationsResponse {
    metadata: { total: number; totalPages: number }[]
    results: ResourceApplication[]
  }
  