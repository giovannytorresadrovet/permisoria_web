// /app/business-owners/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import DesktopBusinessOwnerList from "@/components/desktop/owners/BusinessOwnerList";
import MobileBusinessOwnerList from "@/components/mobile/owners/BusinessOwnerList";
import AddBusinessOwnerModal from "@/components/shared/owners/AddBusinessOwnerModal";
import { Spinner } from "keep-react";

// Shared types for business owners
export type BusinessOwnerStatus = "ACTIVE" | "INACTIVE";
export type VerificationStatus = "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";

export interface BusinessOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  city: string | null;
  status: BusinessOwnerStatus;
  verificationStatus: VerificationStatus;
  businessesCount: number;
  activePermitsCount: number;
  expiringPermitsCount: number;
  assignedManagerId: string | null;
  assignedManagerName: string | null;
  createdAt: string;
}

export interface FilterOptions {
  status: BusinessOwnerStatus | null;
  verificationStatus: VerificationStatus | null;
  municipality: string | null;
  assignedManager: string | null;
}

const BusinessOwnersPage = () => {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const [loading, setLoading] = useState(true);
  const [showAddOwnerModal, setShowAddOwnerModal] = useState(false);
  const [businessOwners, setBusinessOwners] = useState<BusinessOwner[]>([]);
  const [filteredOwners, setFilteredOwners] = useState<BusinessOwner[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    status: null,
    verificationStatus: null,
    municipality: null,
    assignedManager: null,
  });
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortField, setSortField] = useState<string>("lastName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch business owners (mock data for now)
  useEffect(() => {
    const fetchBusinessOwners = async () => {
      try {
        // This would be an API call in a real implementation
        // const response = await fetch("/api/business-owners");
        // const data = await response.json();
        
        // Mock data for development
        const mockData: BusinessOwner[] = Array.from({ length: 25 }, (_, i) => ({
          id: `bo-${i + 1}`,
          firstName: ["James", "Maria", "John", "Sarah", "Robert", "Linda", "Michael", "Emma"][i % 8],
          lastName: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"][i % 8],
          email: `owner${i + 1}@example.com`,
          phone: i % 3 === 0 ? null : `+1 (555) ${100 + i}-${1000 + i}`,
          city: i % 4 === 0 ? null : ["San Juan", "Ponce", "Bayamón", "Carolina", "Mayagüez"][i % 5],
          status: i % 5 === 0 ? "INACTIVE" : "ACTIVE",
          verificationStatus: ["UNVERIFIED", "PENDING", "VERIFIED", "REJECTED"][i % 4] as VerificationStatus,
          businessesCount: i % 7,
          activePermitsCount: i % 10,
          expiringPermitsCount: i % 3,
          assignedManagerId: i % 4 === 0 ? `pm-${i % 3 + 1}` : null,
          assignedManagerName: i % 4 === 0 ? ["Alex Rodriguez", "Sofia Mendez", "Carlos Vega"][i % 3] : null,
          createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        }));
        
        setBusinessOwners(mockData);
        setTotalItems(mockData.length);
        setTotalPages(Math.ceil(mockData.length / itemsPerPage));
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch business owners:", error);
        setLoading(false);
      }
    };

    fetchBusinessOwners();
  }, [itemsPerPage]);

  // Apply search and filters
  useEffect(() => {
    const applySearchAndFilters = () => {
      let result = [...businessOwners];
      
      // Apply search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(
          (owner) =>
            `${owner.firstName} ${owner.lastName}`.toLowerCase().includes(term) ||
            owner.email.toLowerCase().includes(term) ||
            owner.id.toLowerCase().includes(term) ||
            (owner.city && owner.city.toLowerCase().includes(term))
        );
      }
      
      // Apply filters
      if (filterOptions.status) {
        result = result.filter((owner) => owner.status === filterOptions.status);
      }
      
      if (filterOptions.verificationStatus) {
        result = result.filter(
          (owner) => owner.verificationStatus === filterOptions.verificationStatus
        );
      }
      
      if (filterOptions.municipality) {
        result = result.filter(
          (owner) => owner.city === filterOptions.municipality
        );
      }
      
      if (filterOptions.assignedManager) {
        result = result.filter(
          (owner) => owner.assignedManagerId === filterOptions.assignedManager
        );
      }
      
      // Apply sorting
      result.sort((a, b) => {
        let fieldA: any = a[sortField as keyof BusinessOwner];
        let fieldB: any = b[sortField as keyof BusinessOwner];
        
        // Handle nested properties or null values
        if (fieldA === null) fieldA = '';
        if (fieldB === null) fieldB = '';
        
        if (typeof fieldA === 'string') fieldA = fieldA.toLowerCase();
        if (typeof fieldB === 'string') fieldB = fieldB.toLowerCase();
        
        if (sortDirection === 'asc') {
          return fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0;
        } else {
          return fieldA > fieldB ? -1 : fieldA < fieldB ? 1 : 0;
        }
      });
      
      setFilteredOwners(result);
      setTotalItems(result.length);
      setTotalPages(Math.ceil(result.length / itemsPerPage));
      setCurrentPage(1);
    };
    
    applySearchAndFilters();
  }, [businessOwners, searchTerm, filterOptions, sortField, sortDirection]);

  // Calculate pagination
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOwners.slice(startIndex, endIndex);
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilterOptions({ ...filterOptions, ...newFilters });
  };

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    if (selectedOwners.length === 0) return;
    
    console.log(`Performing ${action} on:`, selectedOwners);
    
    // Implement bulk action logic here
    switch (action) {
      case "assignManager":
        // Logic for assigning manager to selected owners
        break;
      case "changeStatus":
        // Logic for changing status of selected owners
        break;
      case "export":
        // Logic for exporting selected owners
        break;
      case "batchVerify":
        // Logic for batch verifying selected owners
        break;
      case "delete":
        // Logic for deleting selected owners
        break;
      default:
        break;
    }
  };

  // Handle selection
  const handleSelectionChange = (ownerIds: string[]) => {
    setSelectedOwners(ownerIds);
  };

  // Handle sorting
  const handleSortChange = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle opening the modal to add a new business owner
  const handleOpenAddOwnerModal = () => {
    setShowAddOwnerModal(true);
  };

  // Handle adding a new business owner
  const handleAddBusinessOwner = (newOwnerData: any) => {
    const newOwner: BusinessOwner = {
      ...newOwnerData,
      businessesCount: 0,
      activePermitsCount: 0,
      expiringPermitsCount: 0,
      city: null,
      assignedManagerId: null,
      assignedManagerName: null,
      createdAt: new Date().toISOString(),
    };

    // In a real implementation, this would be an API call
    // For now, just add to the local state
    setBusinessOwners([newOwner, ...businessOwners]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <Spinner size="lg" color="blue" />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {isDesktop ? (
        <DesktopBusinessOwnerList
          owners={getCurrentPageItems()}
          totalItems={totalItems}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          selectedOwners={selectedOwners}
          sortField={sortField}
          sortDirection={sortDirection}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onSelectionChange={handleSelectionChange}
          onBulkAction={handleBulkAction}
          onPageChange={handlePageChange}
          onOpenAddOwnerModal={handleOpenAddOwnerModal}
          filterOptions={filterOptions}
        />
      ) : (
        <MobileBusinessOwnerList
          owners={getCurrentPageItems()}
          totalItems={totalItems}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          selectedOwners={selectedOwners}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onSelectionChange={handleSelectionChange}
          onBulkAction={handleBulkAction}
          onPageChange={handlePageChange}
          onOpenAddOwnerModal={handleOpenAddOwnerModal}
          filterOptions={filterOptions}
        />
      )}
    </div>
  );
};

export default BusinessOwnersPage;
