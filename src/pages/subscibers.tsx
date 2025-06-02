
import { DataTable } from "@/components/shared/data-table"
import {  Trash2, Loader2 } from "lucide-react"
import  api  from "@/lib/api"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const Subscribers = () => {
 // const [properties, setProperties] = useState<Property[]>(initialProperties)
 const queryClient = useQueryClient()
   const {data:subscribers, isLoading, isError} = useQuery({
    queryKey: ["subscribers"],
    queryFn: async () => {
       const response = await api.get<{id:string,email:string}[]>("/emails/get-subscribption-emails")
    return response.data || []
    },
   
  })
  const handleDelete = async(data:{email:string, id:string,isActive:boolean}) => {
    if (!window.confirm("Are you sure you want to delete this subscriber?")) {
      return
    }
     try{
      const response = await api.post<{email:string,isActive:boolean}[]>(`/emails/update-subscription-email/${data?.id}`, {email:data.email, isActive:false})
     toast('Email deleted Successfully')
     queryClient.invalidateQueries({ queryKey: ["subscribers"] })
    return response.data || []
  }catch{
    toast('Error deleting list. Please check your network or try again')
  }
    //setProperties(properties.filter((p) => p.id !== property.id))
  }

  
  const columns = [
    // {
    //   id: "firstName",
    //   header: "First Name",
    //   accessorKey: "firstName",
    // },
    // {
    //   id: "lastName",
    //   header: "Last Name",
    //   accessorKey: "lastName",
    // },
    {
      id: "email",
      header: "Email address",
      accessorKey: "email",
    }
    
  ]

  const actionMenu = {
    items: [
    
      {
        label: "Delete",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: handleDelete,
        className: "text-red-600",
      },
    ],
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Subscriber list</h1>
      </div>

{isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading all subscribers...</span>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">Error loading emails. Please try again.</div>
        ) : (
             <DataTable
        columns={columns}
        data={!isLoading && subscribers ? subscribers : []}
        actionMenu={ actionMenu}
        pagination={{ pageSize: 10, totalItems: subscribers?.length }}
        searchable={true}
        selectable={true}
      />
               )}
     
    </div>
  )
}

export default Subscribers;
