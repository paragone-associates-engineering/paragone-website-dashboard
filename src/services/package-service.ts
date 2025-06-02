import api  from "@/lib/api"
import type { Package, CreatePackageDTO  } from "@/types/package"

export const packageService = {
  getPackages: async () => {
    const response = await api.get<Package[]>("/form/get-partner-packages")
    return response.data
  },

  createPackage: async (packageData: CreatePackageDTO) => {
    const response = await api.post<Package>("/form/create-partner-package", packageData)
    return response.data
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updatePackage: async (packageId: string, packageData: any) => {
    const response = await api.post<Package>(`/form/update-partner-package/${packageId}`, packageData)
    return response.data
  },

  togglePackageStatus: async (packageId: string, isActive: boolean) => {
    return packageService.updatePackage(packageId, { isActive })
  },
}
