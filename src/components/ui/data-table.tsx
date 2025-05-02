import React, { useState } from "react";
import { MoreIcon, NextIcon, PrevIcon, SearchIcon, SortAscIcon, SortDescIcon } from "./icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface TableColumn<T> {
  id: string;
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  pagination?: {
    pageSize: number;
    pageIndex: number;
    pageCount: number;
    onPageChange: (page: number) => void;
  };
  sorting?: {
    field: keyof T | null;
    direction: 'asc' | 'desc' | null;
    onSortChange: (field: keyof T, direction: 'asc' | 'desc') => void;
  };
  searchable?: boolean;
  onSearch?: (term: string) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
  actions?: {
    label: string;
    onClick: (item: T) => void;
  }[];
}

export function DataTable<T>({
  data,
  columns,
  pagination,
  sorting,
  searchable = false,
  onSearch,
  selectable = false,
  onSelectionChange,
  actions = [],
}: DataTableProps<T>) {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedItems(data);
      onSelectionChange?.(data);
    } else {
      setSelectedItems([]);
      onSelectionChange?.([]);
    }
  };
  
  const handleSelectItem = (item: T, event: React.ChangeEvent<HTMLInputElement>) => {
    let newSelectedItems: T[];
    
    if (event.target.checked) {
      newSelectedItems = [...selectedItems, item];
    } else {
      newSelectedItems = selectedItems.filter((selectedItem) => selectedItem !== item);
    }
    
    setSelectedItems(newSelectedItems);
    onSelectionChange?.(newSelectedItems);
  };
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    onSearch?.(term);
  };
  
  const handleSort = (field: keyof T) => {
    if (sorting) {
      const isCurrentField = field === sorting.field;
      const newDirection = isCurrentField && sorting.direction === 'asc' ? 'desc' : 'asc';
      sorting.onSortChange(field, newDirection);
    }
  };
  
  const isAllSelected = data.length > 0 && selectedItems.length === data.length;
  
  return (
    <div className="w-full">
      {/* Table header with search and actions */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex flex-1 items-center space-x-2">
          {searchable && (
            <div className="relative w-64">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full bg-white pl-8 text-sm"
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Table */}
      <div className="rounded-md border w-full overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th scope="col" className="relative w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.sortable && sorting ? (
                    <button
                      className="group inline-flex items-center space-x-1"
                      onClick={() => handleSort(column.accessorKey)}
                    >
                      <span>{column.header}</span>
                      <span className="ml-2 flex-none rounded">
                        {sorting.field === column.accessorKey ? (
                          sorting.direction === 'asc' ? (
                            <SortAscIcon className="h-4 w-4" />
                          ) : (
                            <SortDescIcon className="h-4 w-4" />
                          )
                        ) : (
                          <SortAscIcon className="h-4 w-4 opacity-0 group-hover:opacity-50" />
                        )}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
              
              {actions.length > 0 && (
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {selectable && (
                  <td className="relative w-12 px-6">
                    <input
                      type="checkbox"
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300"
                      checked={selectedItems.includes(item)}
                      onChange={(e) => handleSelectItem(item, e)}
                    />
                  </td>
                )}
                
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {column.cell ? column.cell(item) : String(item[column.accessorKey] || '')}
                  </td>
                ))}
                
                {actions.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <MoreIcon className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        {actions.map((action, actionIndex) => (
                          <DropdownMenuItem
                            key={actionIndex}
                            onClick={() => action.onClick(item)}
                          >
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-gray-500">
            Showing {(pagination.pageIndex * pagination.pageSize) + 1} to{' '}
            {Math.min((pagination.pageIndex + 1) * pagination.pageSize, data.length)} of{' '}
            {data.length} results
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => pagination.onPageChange(pagination.pageIndex - 1)}
              disabled={pagination.pageIndex === 0}
              className="h-8 w-8"
            >
              <PrevIcon className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            
            {/* Page numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(3, pagination.pageCount) }, (_, i) => {
                const pageNumber = pagination.pageIndex <= 1
                  ? i + 1
                  : pagination.pageIndex >= pagination.pageCount - 2
                    ? pagination.pageCount - 2 + i
                    : pagination.pageIndex + i;
                
                if (pageNumber <= pagination.pageCount) {
                  return (
                    <Button
                      key={i}
                      variant={pageNumber === pagination.pageIndex + 1 ? "default" : "outline"}
                      className={cn(
                        "h-8 w-8",
                        pageNumber === pagination.pageIndex + 1 ? "bg-amber-500 hover:bg-amber-600" : ""
                      )}
                      onClick={() => pagination.onPageChange(pageNumber - 1)}
                    >
                      {pageNumber}
                    </Button>
                  );
                }
                return null;
              })}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => pagination.onPageChange(pagination.pageIndex + 1)}
              disabled={pagination.pageIndex >= pagination.pageCount - 1}
              className="h-8 w-8"
            >
              <NextIcon className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ 
  status, 
  className 
}: { 
  status: string; 
  className?: string 
}) {
  const getStatusColor = (status: string) => {
    status = status.toLowerCase();
    
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-primary';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      getStatusColor(status),
      className
    )}>
      {status}
    </span>
  );
}
