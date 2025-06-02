import  api  from "@/lib/api"
import type { Job,  CreateJobDTO } from "@/types/job"

export const RegionService = {
  getJobs: async () => {
    const response = await api.get<string[]>("/listings/get-available-locations")
    return response.data
  },

  getJob: async (jobId: string) => {
    const response = await api.get<Job>(`/jobs/get-job/${jobId}`)
    return response.data
  },

  createJob: async (jobData: CreateJobDTO) => {
    const response = await api.post<Job>("/jobs/create-job", jobData)
    return response.data
  },

  updateJob: async (jobId: string, jobData: Partial<CreateJobDTO>) => {
    const response = await api.post<Job>(`/jobs/update-job/${jobId}`, jobData)
    return response.data
  },

  deleteJob: async (jobId: string) => {
    const response = await api.delete<{ success: boolean }>(`/jobs/delete-job/${jobId}`)
    return response.data
  },
}
