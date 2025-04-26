import React from "react";
import { DataTable, StatusBadge } from "@/components/ui/data-table"

export type ExampleUser = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  status: 'active' | 'inactive' | 'pending';
  joined: string;
};

// Sample data for the table
const users: ExampleUser[] = [
  {
    id: "#001",
    fullName: "Savannah Nguyen",
    email: "bill.sanders@example.com",
    phoneNumber: "(229) 555-0109",
    status: "active",
    joined: "26 Mar 2022",
  },
  {
    id: "#002",
    fullName: "Bessie Cooper",
    email: "deanna.curtis@example.com",
    phoneNumber: "(209) 555-0104",
    status: "active",
    joined: "26 Mar 2022",
  },
  {
    id: "#003",
    fullName: "Brooklyn Simmons",
    email: "nathan.roberts@example.com",
    phoneNumber: "(405) 555-0128",
    status: "active",
    joined: "26 Mar 2022",
  },
  {
    id: "#004",
    fullName: "Jenny Wilson",
    email: "jessica.hanson@example.com",
    phoneNumber: "(907) 555-0101",
    status: "active",
    joined: "26 Mar 2022",
  },
  {
    id: "#005",
    fullName: "Devon Lane",
    email: "curtis.weaver@example.com",
    phoneNumber: "(808) 555-0111",
    status: "active",
    joined: "26 Mar 2022",
  },
  {
    id: "#006",
    fullName: "Dianne Russell",
    email: "debra.holt@example.com",
    phoneNumber: "(201) 555-0124",
    status: "active",
    joined: "26 Mar 2022",
  },
  {
    id: "#007",
    fullName: "Esther Howard",
    email: "georgia.young@example.com",
    phoneNumber: "(217) 555-0113",
    status: "active",
    joined: "26 Mar 2022",
  },
  {
    id: "#008",
    fullName: "Marvin McKinney",
    email: "michelle.rivera@example.com",
    phoneNumber: "(702) 555-0122",
    status: "active",
    joined: "26 Mar 2022",
  },
  {
    id: "#009",
    fullName: "Jane Cooper",
    email: "tanya.hill@example.com",
    phoneNumber: "(208) 555-0112",
    status: "active",
    joined: "26 Mar 2022",
  },
  {
    id: "#010",
    fullName: "Ralph Edwards",
    email: "willie.jennings@example.com",
    phoneNumber: "(302) 555-0107",
    status: "active",
    joined: "26 Mar 2022",
  },
];

export default function ReferAndEarn() {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize] = React.useState(5);
  const [sortField, setSortField] = React.useState<keyof ExampleUser | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  
  const handleSortChange = (field: keyof ExampleUser, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
  };
  
  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };
  
  // Example columns configuration
  const columns = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id" as keyof ExampleUser,
      sortable: true,
    },
    {
      id: "fullName",
      header: "Full name",
      accessorKey: "fullName" as keyof ExampleUser,
      sortable: true,
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email" as keyof ExampleUser,
      sortable: true,
    },
    {
      id: "phoneNumber",
      header: "Phone number",
      accessorKey: "phoneNumber" as keyof ExampleUser,
      sortable: false,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status" as keyof ExampleUser,
      cell: (row: ExampleUser) => <StatusBadge status={row.status} />,
      sortable: true,
    },
    {
      id: "joined",
      header: "Joined",
      accessorKey: "joined" as keyof ExampleUser,
      sortable: true,
    },
  ];
  
  // Sort and paginate data
  const processedData = React.useMemo(() => {
    const data = [...users];
    
    // Apply sorting
    if (sortField && sortDirection) {
      data.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (aValue < bValue) {
          return sortDirection === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    // Return paginated data
    return data.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  }, [users, pageIndex, pageSize, sortField, sortDirection]);
  
  
  const actions = [
    {
      label: "View Details",
      onClick: (user: ExampleUser) => {
        alert(`View details for ${user.fullName}`);
      },
    },
    {
      label: "Edit",
      onClick: (user: ExampleUser) => {
        alert(`Edit ${user.fullName}`);
      },
    },
    {
      label: "Delete",
      onClick: (user: ExampleUser) => {
        alert(`Delete ${user.fullName}`);
      },
    },
  ];
  
  return (
    <div className="w-full p-3 md:p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Refer and Earn</h2>
      <DataTable
        data={processedData}
        columns={columns}
        pagination={{
          pageSize,
          pageIndex,
          pageCount: Math.ceil(users.length / pageSize),
          onPageChange: handlePageChange,
        }}
        sorting={{
          field: sortField,
          direction: sortDirection,
          onSortChange: handleSortChange,
        }}
        searchable
        selectable
        actions={actions}
      />
    </div>
  );
}