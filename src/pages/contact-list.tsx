
import { useState } from "react"
import { DataTable, StatusBadge } from "@/components/shared/data-table"
import { Eye, Phone, Trash2 } from "lucide-react"

interface Contact {
  id: string
  contactId: string
  date: string
  customerName: string
  emailAddress: string
  phoneNumber: string
  reason: string
  message: string
  status: "Completed" | "In Progress" | "Pending"
}

const initialContacts: Contact[] = [
  {
    id: "1",
    contactId: "#0001234",
    date: "26/04/2020, 12:42 AM",
    customerName: "Stephani",
    emailAddress: "jessica@example.com",
    phoneNumber: "(201) 555-0124",
    reason: "Buy",
    message: "Various versions have evolved over the years...",
    status: "Completed",
  },
  {
    id: "2",
    contactId: "#0001234",
    date: "26/04/2020, 12:42 AM",
    customerName: "Sanji Fujiwara",
    emailAddress: "curtisr@example.com",
    phoneNumber: "(319) 555-0115",
    reason: "Sale",
    message: "Various versions have evolved over the years...",
    status: "In Progress",
  },
  {
    id: "3",
    contactId: "#0001234",
    date: "26/04/2020, 12:42 AM",
    customerName: "Hawkins",
    emailAddress: "tanya.hill@example.com",
    phoneNumber: "(603) 555-0123",
    reason: "Rent",
    message: "Various versions have evolved over the years...",
    status: "Completed",
  },
  {
    id: "4",
    contactId: "#0001234",
    date: "26/04/2020, 12:42 AM",
    customerName: "Ilham Supriadi",
    emailAddress: "simmons@example.com",
    phoneNumber: "(307) 555-0133",
    reason: "Question",
    message: "Various versions have evolved over the years...",
    status: "In Progress",
  },
  {
    id: "5",
    contactId: "#0001234",
    date: "26/04/2020, 12:42 AM",
    customerName: "Smantha Jr.",
    emailAddress: "debbie.baker@example.com",
    phoneNumber: "(671) 555-0110",
    reason: "Rent",
    message: "Various versions have evolved over the years...",
    status: "In Progress",
  },
  {
    id: "6",
    contactId: "#0001234",
    date: "26/04/2020, 12:42 AM",
    customerName: "Yun-Yun",
    emailAddress: "willie.jennings@example.com",
    phoneNumber: "(907) 555-0101",
    reason: "Land",
    message: "Various versions have evolved over the years...",
    status: "Completed",
  },
  {
    id: "7",
    contactId: "#0001234",
    date: "26/04/2020, 12:42 AM",
    customerName: "James Witcwicky",
    emailAddress: "felicia.reid@example.com",
    phoneNumber: "(207) 555-0119",
    reason: "Price",
    message: "Various versions have evolved over the years...",
    status: "Pending",
  },
]

const ContactUsListPage = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)

  const handleDelete = (contact: Contact) => {
    setContacts(contacts.filter((c) => c.id !== contact.id))
  }

  const handleViewDetails = (contact: Contact) => {
    console.log("View details:", contact)
    // Implement view details functionality
  }

  const handleContact = (contact: Contact) => {
    console.log("Contact:", contact)
    // Implement contact functionality
  }

  const columns = [
    {
      id: "contactId",
      header: "Contact ID",
      accessorKey: "contactId",
    },
    {
      id: "date",
      header: "Date",
      accessorKey: "date",
    },
    {
      id: "customerName",
      header: "Customer name",
      accessorKey: "customerName",
    },
    {
      id: "emailAddress",
      header: "Email address",
      accessorKey: "emailAddress",
    },
    {
      id: "phoneNumber",
      header: "Phone number",
      accessorKey: "phoneNumber",
    },
    {
      id: "reason",
      header: "Choose a reason",
      accessorKey: "reason",
    },
    {
      id: "message",
      header: "Message",
      accessorKey: "message",
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
        label: "Contact",
        icon: <Phone className="h-4 w-4" />,
        onClick: handleContact,
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Contact Us List</h1>
      </div>

      <DataTable
        columns={columns}
        data={contacts}
        actionMenu={actionMenu}
        pagination={{ pageSize: 10, totalItems: contacts.length }}
        searchable={true}
        selectable={true}
      />
    </div>
  )
}

export default ContactUsListPage
