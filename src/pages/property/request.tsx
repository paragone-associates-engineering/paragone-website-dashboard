

import { useState } from "react"
import { DataTable, StatusBadge } from "@/components/shared/data-table"
import { Eye, Pencil, Trash2 } from "lucide-react"

interface Property {
  id: string
  customerName: string
  phoneNumber: string
  emailAddress: string
  propertyType: string
  location: string
  status: "Active" | "Pending" | "In Progress"
}

const initialProperties: Property[] = [
  {
    id: "1",
    customerName: "Stephani",
    phoneNumber: "(308) 555-0121",
    emailAddress: "alma@example.com",
    propertyType: "Bungalow",
    location: "Straight 22th London 51256",
    status: "Active",
  },
  {
    id: "2",
    customerName: "Sanji Fujiwara",
    phoneNumber: "(225) 555-0118",
    emailAddress: "jessica@example.com",
    propertyType: "Apartment",
    location: "Flat 2551 Center London 287223",
    status: "Active",
  },
  {
    id: "3",
    customerName: "Hawkins",
    phoneNumber: "(405) 555-0128",
    emailAddress: "debbie@example.com",
    propertyType: "Duplex",
    location: "Waves Street 1st London 2441",
    status: "Pending",
  },
  {
    id: "4",
    customerName: "Ilham Supriadi",
    phoneNumber: "(252) 555-0126",
    emailAddress: "georgia@example.com",
    propertyType: "Apartment",
    location: "Waves Street 1st London 2441",
    status: "In Progress",
  },
  {
    id: "5",
    customerName: "Smantha Jr.",
    phoneNumber: "(316) 555-0116",
    emailAddress: "michelle@example.com",
    propertyType: "Duplex",
    location: "Corner Street 5th London 126623",
    status: "In Progress",
  },
  {
    id: "6",
    customerName: "Yun-Yun",
    phoneNumber: "(907) 555-0101",
    emailAddress: "tanya@example.com",
    propertyType: "Bungalow",
    location: "Corner Street 5th London 126623",
    status: "Pending",
  },
  {
    id: "7",
    customerName: "James Witcwicky",
    phoneNumber: "(684) 555-0102",
    emailAddress: "michael@example.com",
    propertyType: "Apartment",
    location: "Flat 2551 Center London 287223",
    status: "In Progress",
  },
]

const PropertyRequestPage = () => {
  const [properties, setProperties] = useState<Property[]>(initialProperties)

  const handleDelete = (property: Property) => {
    setProperties(properties.filter((p) => p.id !== property.id))
  }

  const handleEdit = (property: Property) => {
    console.log("Edit property:", property)
    // Implement edit functionality
  }

  const handleViewDetails = (property: Property) => {
    console.log("View details:", property)
    // Implement view details functionality
  }

  const handleChangeStatus = (property: Property) => {
    console.log("Change status:", property)
    // Implement change status functionality
  }

  const columns = [
    {
      id: "customerName",
      header: "Customer name",
      accessorKey: "customerName",
    },
    {
      id: "phoneNumber",
      header: "Phone number",
      accessorKey: "phoneNumber",
    },
    {
      id: "emailAddress",
      header: "Email address",
      accessorKey: "emailAddress",
    },
    {
      id: "propertyType",
      header: "Property type",
      accessorKey: "propertyType",
    },
    {
      id: "location",
      header: "Location",
      accessorKey: "location",
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: (info: any) => <StatusBadge status={info.status} />,
    },
  ]

  const actionMenu = {
    items: [
      {
        label: "View details",
        icon: <Eye className="h-4 w-4" />,
        onClick: handleViewDetails,
      },
      {
        label: "Edit property",
        icon: <Pencil className="h-4 w-4" />,
        onClick: handleEdit,
      },
      {
        label: "Change status",
        icon: <Pencil className="h-4 w-4" />,
        onClick: handleChangeStatus,
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Property Request</h1>
      </div>

      <DataTable
        columns={columns}
        data={properties}
        actionMenu={actionMenu}
        pagination={{ pageSize: 10, totalItems: properties.length }}
        searchable={true}
        selectable={true}
      />
    </div>
  )
}

export default PropertyRequestPage
