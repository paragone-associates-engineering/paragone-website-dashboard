export interface Job {
  id: string
  title: string
  department: string
  location: string
  description: string
  duties: string
  skills: string
  experience: string
  education: string
  url?:string,
    applicationStartDate?:string | number | undefined;
  applicationEndDate?: string | number | undefined;
   jobTags?: string[];
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface JobsResponse {
  metadata: { total: number; totalPages: number }[]
  results: Job[]
}

export interface CreateJobDTO {
   id?:string;
  title: string
  department: string
  location: string
  description: string
  duties: string
  skills: string
  experience: string
  education: string
   url?:string,
    applicationStartDate: string | number | undefined;
  applicationEndDate:string | number | undefined;
  jobTags?: string[];
  isActive?: boolean
}
