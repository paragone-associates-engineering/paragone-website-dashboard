export enum EventType {
    IN_PERSON = "inPerson",
    VIRTUAL = "virtual",
    HYBRID = "hybrid",
  }
  
  export enum EventStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    DEACTIVATED = "deactivated",
  }
  
  export enum ApplicationStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
  }
  
  export interface EventPrice {
    inPerson?: {
      amount: number
      currency: string
    }
    virtual?: {
      amount: number
      currency: string
    }
  }
  
  export interface Event {
    id: string
    title: string
    summary: string
    link: string
    image: string
    expirationDate: string
    isPaid: boolean
    eventType: EventType
    price?: EventPrice
    status: EventStatus
    location?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    createdBy: string
    lastUpdatedBy: string
  }
  
  export interface EventApplication {
    id: string
    eventId: string
    eventTitle: string
    applicantName: {first: string; lastName: string}
    email: string
    phoneNumber: string
    eventType: EventType
    status: ApplicationStatus
   createdAt: string
    updatedAt: string
  }
  
  export interface CreateEventDTO {
    title: string
    summary: string
    link: string
    image?: File[]
    expirationDate: string
    isPaid: boolean
    eventType: EventType
    price?: EventPrice
    location?: string
  }
  
  export interface UpdateEventDTO extends Partial<CreateEventDTO> {
    status?: EventStatus
  }
  
  export interface EventsResponse {
    metadata: { total: number; totalPages: number }[]
    results: Event[]
  }
  
  export interface EventApplicationsResponse {
    metadata: { total: number; totalPages: number }[]
    results: EventApplication[]
  }
  