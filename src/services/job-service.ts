import  api  from "@/lib/api"
import type { Job, JobsResponse, CreateJobDTO } from "@/types/job"

export const jobService = {
  getJobs: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get<JobsResponse>("/jobs/get-jobs", { params })
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
    try {
      const formData = new FormData()
       formData.append("metadata", JSON.stringify({isActive:false}))
      const response = await api.post(`/jobs/update-job/${jobId}`,formData)
      return response.data
    } catch (error) {
      console.error(`Error deleting blog post ${jobId}:`, error)
      throw error
    }
  },

  // deleteJob: async (jobId: string) => {
  //   const response = await api.delete<{ success: boolean }>(`/jobs/delete-job/${jobId}`)
  //   return response.data
  // },
}
