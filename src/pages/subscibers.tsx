
import { useState } from "react"
import { DataTable } from "@/components/shared/data-table"
import { Eye, Trash2 } from "lucide-react"

interface Property {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string
  emailAddress: string
  propertyType: string
  location: string
  status: "Active" | "Pending" | "In Progress"
}

const initialProperties: Property[] = [
  {
    id: "1",
    firstName:"john",
    lastName: "Stephani",
    phoneNumber: "(308) 555-0121",
    emailAddress: "alma@example.com",
    propertyType: "Bungalow",
    location: "Straight 22th London 51256",
    status: "Active",
  },
  {
    id: "2",
    firstName:"Sanji",
    lastName: "Fujiwara",
    phoneNumber: "(225) 555-0118",
    emailAddress: "jessica@example.com",
    propertyType: "Apartment",
    location: "Flat 2551 Center London 287223",
    status: "Active",
  },
  {
    id: "3",
    firstName:"Ronald",
    lastName: "Hawkins",
    phoneNumber: "(405) 555-0128",
    emailAddress: "debbie@example.com",
    propertyType: "Duplex",
    location: "Waves Street 1st London 2441",
    status: "Pending",
  },
  {
    id: "4",
    firstName:"Ilham",
    lastName: "Supriadi",
    phoneNumber: "(252) 555-0126",
    emailAddress: "georgia@example.com",
    propertyType: "Apartment",
    location: "Waves Street 1st London 2441",
    status: "In Progress",
  },
  {
    id: "5",
    firstName:"Shane",
    lastName: "Jr.",
    phoneNumber: "(316) 555-0116",
    emailAddress: "michelle@example.com",
    propertyType: "Duplex",
    location: "Corner Street 5th London 126623",
    status: "In Progress",
  },
  {
    id: "6",
    firstName:"Philip",
    lastName: "Yun-Yun",
    phoneNumber: "(907) 555-0101",
    emailAddress: "tanya@example.com",
    propertyType: "Bungalow",
    location: "Corner Street 5th London 126623",
    status: "Pending",
  },
  {
    id: "7",
    firstName:"James",
    lastName: " Witcwicky",
    phoneNumber: "(684) 555-0102",
    emailAddress: "michael@example.com",
    propertyType: "Apartment",
    location: "Flat 2551 Center London 287223",
    status: "In Progress",
  },
]

const Subscribers = () => {
  const [properties, setProperties] = useState<Property[]>(initialProperties)

  const handleDelete = (property: Property) => {
    setProperties(properties.filter((p) => p.id !== property.id))
  }


  const handleViewDetails = (property: Property) => {
    console.log("View details:", property)
    // Implement view details functionality
  }

  
  const columns = [
    {
      id: "firstName",
      header: "First Name",
      accessorKey: "firstName",
    },
    {
      id: "lastName",
      header: "Last Name",
      accessorKey: "lastName",
    },
    {
      id: "emailAddress",
      header: "Email address",
      accessorKey: "emailAddress",
    }
    
  ]

  const actionMenu = {
    items: [
      {
        label: "View details",
        icon: <Eye className="h-4 w-4" />,
        onClick: handleViewDetails,
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
        <h1 className="text-2xl font-bold">Subscriber list</h1>
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

export default Subscribers;
