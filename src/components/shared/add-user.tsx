import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-container";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Check, User } from "lucide-react";

interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    phoneNumber: string
    designation: string
    status?: string
  }

// Props for the component
interface UserSearchFormProps {
  existingUsers: User[];
  onAddUser: (user: User) => void;
  onCancel: () => void;
}

const UserSearchForm: React.FC<UserSearchFormProps> = ({
  existingUsers,
  onAddUser,
  onCancel,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter users based on search query
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        return;
      }
  
      const query = searchQuery.toLowerCase();
      const filteredUsers = existingUsers.filter(
        (user) =>
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.phoneNumber.includes(query)
      );
  
      setSearchResults(filteredUsers);
    }, 200); 
  
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, existingUsers]);
  
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setSearchQuery(`${user.firstName} ${user.lastName}`);
    setIsSearchOpen(false);
  };

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      onAddUser(selectedUser);
      setSelectedUser(null);
      setSearchQuery("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6">
        <FormField label="Search for existing users">
          <div className="relative" ref={searchRef}>
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
                if (e.target.value === "") {
                  setSelectedUser(null);
                }
              }}
              placeholder="Search by name, email or phone number"
              onFocus={() => setIsSearchOpen(true)}
              className="w-full"
            />
            
            {isSearchOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                <Command className="rounded-lg border shadow-md">
                  {/* <CommandInput placeholder="Search users..." value={searchQuery} onValueChange={setSearchQuery} /> */}
                  <CommandList>
                    {searchResults.length === 0 && searchQuery !== "" ? (
                      <CommandEmpty>No users found.</CommandEmpty>
                    ) : (
                      <CommandGroup heading="Users">
                        {searchResults.map((user) => (
                          <CommandItem
                            key={user.id}
                            onSelect={() => handleSelectUser(user)}
                            className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-100"
                          >
                            <User className="w-4 h-4 text-gray-400" />
                            <div className="flex-1">
                              <p className="font-medium">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {user.email} • {user.role}
                              </p>
                              <p className="text-xs text-gray-400">
                                {user.designation} • {user.status}
                              </p>
                            </div>
                            {selectedUser?.id === user.id && (
                              <Check className="w-4 h-4 text-green-500" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </div>
            )}
          </div>
        </FormField>

        {selectedUser && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50">
            <h3 className="font-medium mb-2">Selected User:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p>{selectedUser.firstName} {selectedUser.lastName}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p>{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p>{selectedUser.phoneNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">Designation</p>
                <p>{selectedUser.designation}</p>
              </div>
              <div>
                <p className="text-gray-500">Role</p>
                <p>{selectedUser.role}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p>{selectedUser.status}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!selectedUser}>
            Add user
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UserSearchForm;
