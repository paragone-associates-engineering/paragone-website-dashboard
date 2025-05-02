
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/shared/data-table"
import { Eye, Pencil, Trash2, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface Job {
  id: string
  title: string
  description: string
  applicationDeadline: string
  publishedBy: string
}

const initialJobs: Job[] = [
  {
    id: "1",
    title: "Ex qui dolor commodo occaecat",
    description: "Ex qui dolor commodo occaecat est voluptate conse ctetur irure",
    applicationDeadline: "13 Sep 23 17:02:24",
    publishedBy: "Admin",
  },
  {
    id: "2",
    title: "Ex qui dolor commodo occaecat",
    description: "Ex qui dolor commodo occaecat est voluptate conse ctetur irure",
    applicationDeadline: "13 Sep 23 17:02:24",
    publishedBy: "Admin",
  },
  {
    id: "3",
    title: "Ex qui dolor commodo occaecat",
    description: "Ex qui dolor commodo occaecat est voluptate conse ctetur irure",
    applicationDeadline: "13 Sep 23 17:02:24",
    publishedBy: "Admin",
  },
  {
    id: "4",
    title: "Ex qui dolor commodo occaecat",
    description: "Ex qui dolor commodo occaecat est voluptate conse ctetur irure",
    applicationDeadline: "13 Sep 23 17:02:24",
    publishedBy: "Admin",
  },
]

const CareerPage = () => {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const navigate = useNavigate()

  const handleDelete = (job: Job) => {
    setJobs(jobs.filter((j) => j.id !== job.id))
  }

  const handleEdit = (job: Job) => {
    navigate(`/career/edit/${job.id}`)
  }

  const handleView = (job: Job) => {
    navigate(`/career/view/${job.id}`)
  }

  const columns = [
    {
      id: "image",
      header: "",
      accessorKey: "image",
      cell: () => (
        <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
          <img src="https://res.cloudinary.com/dv0mdoa6b/image/upload/v1741867698/microsoft-edge-_eCnLJWQXMg-unsplash_1_dmpqrj.png" alt="Job" className="w-6 h-6" />
        </div>
      ),
    },
    {
      id: "title",
      header: "Job title",
      accessorKey: "title",
      enableSorting: true,
    },
    {
      id: "description",
      header: "Descriptions",
      accessorKey: "description",
    },
    {
      id: "applicationDeadline",
      header: "Application Dateline",
      accessorKey: "applicationDeadline",
    },
    {
      id: "publishedBy",
      header: "Published by",
      accessorKey: "publishedBy",
    },
  ]

  const actionMenu = {
    items: [
      {
        label: "View jobs",
        icon: <Eye className="h-4 w-4" />,
        onClick: handleView,
      },
      {
        label: "Edit jobs",
        icon: <Pencil className="h-4 w-4" />,
        onClick: handleEdit,
      },
      {
        label: "Delete",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: handleDelete,
        className: "text-red-600",
      },
    ],
  }

  return (
    <div className="p-3 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Careers</h1>
        <Button className="bg-primary hover:bg-primary/80" onClick={() => navigate("/career/add")}>
          Create job
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Careers</h2>
        </div>

        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Sort by <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Input type="search" placeholder="Search..." className="w-[300px]" />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={jobs}
          actionMenu={actionMenu}
          pagination={{ pageSize: 10, totalItems: jobs.length }}
          searchable={false}
          selectable={true}
        />
      </div>
    </div>
  )
}

export default CareerPage
