// /components/desktop/owners/BusinessOwnerList.tsx
import React, { useState } from "react";
import { 
  Table, 
  Badge, 
  Button, 
  Avatar, 
  TextInput, 
  Dropdown, 
  Pagination,
  Card,
  Tooltip,
  Modal
} from "keep-react";
import {
  MagnifyingGlass,
  Funnel,
  FunnelSimple,
  Plus,
  DotsThreeOutlineVertical,
  UserCircle,
  Buildings,
  Clipboard,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  TrashSimple,
  DownloadSimple,
  ArrowsClockwise,
} from "phosphor-react";
import { motion } from "framer-motion";
import { BusinessOwner, FilterOptions } from "@/app/business-owners/page";

const getVerificationStatusDetails = (status: string) => {
  switch (status) {
    case "VERIFIED":
      return { color: "success", icon: <CheckCircle size={16} weight="fill" /> };
    case "REJECTED":
      return { color: "error", icon: <XCircle size={16} weight="fill" /> };
    case "PENDING":
      return { color: "warning", icon: <Clock size={16} weight="fill" /> };
    default:
      return { color: "gray", icon: <Clock size={16} weight="fill" /> };
  }
};

const getStatusDetails = (status: string) => {
  return status === "ACTIVE" 
    ? { color: "success", label: "Active" } 
    : { color: "gray", label: "Inactive" };
};

interface BusinessOwnerListProps {
  owners: BusinessOwner[];
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  selectedOwners: string[];
  sortField: string;
  sortDirection: "asc" | "desc";
  filterOptions: FilterOptions;
  onSearch: (term: string) => void;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  onSortChange: (field: string) => void;
  onSelectionChange: (ownerIds: string[]) => void;
  onBulkAction: (action: string) => void;
  onPageChange: (page: number) => void;
  onOpenAddOwnerModal: () => void;
}

const DesktopBusinessOwnerList: React.FC<BusinessOwnerListProps> = ({
  owners,
  totalItems,
  currentPage,
  itemsPerPage,
  totalPages,
  selectedOwners,
  sortField,
  sortDirection,
  filterOptions,
  onSearch,
  onFilterChange,
  onSortChange,
  onSelectionChange,
  onBulkAction,
  onPageChange,
  onOpenAddOwnerModal,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [showBulkActionConfirm, setShowBulkActionConfirm] = useState(false);
  const [pendingBulkAction, setPendingBulkAction] = useState("");

  // List of municipalities for the filter dropdown (would come from API in real app)
  const municipalities = ["San Juan", "Ponce", "Bayamón", "Carolina", "Mayagüez"];
  
  // List of managers for the filter dropdown (would come from API in real app)
  const managers = [
    { id: "pm-1", name: "Alex Rodriguez" },
    { id: "pm-2", name: "Sofia Mendez" },
    { id: "pm-3", name: "Carlos Vega" },
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(owners.map((owner) => owner.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOwner = (ownerId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedOwners, ownerId]);
    } else {
      onSelectionChange(selectedOwners.filter((id) => id !== ownerId));
    }
  };

  const handleApplyFilters = () => {
    onSearch(searchTerm);
    setShowFilterPanel(false);
    
    // Check if any filters are applied
    const hasActiveFilters = Boolean(
      filterOptions.status || 
      filterOptions.verificationStatus || 
      filterOptions.municipality || 
      filterOptions.assignedManager
    );
    
    setIsFilterApplied(hasActiveFilters);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    onSearch("");
    onFilterChange({
      status: null,
      verificationStatus: null,
      municipality: null,
      assignedManager: null,
    });
    setIsFilterApplied(false);
  };

  const handleInitiateBulkAction = (action: string) => {
    // For delete and other destructive actions, show confirmation first
    if (action === "delete") {
      setPendingBulkAction(action);
      setShowBulkActionConfirm(true);
    } else {
      onBulkAction(action);
    }
  };

  const confirmBulkAction = () => {
    onBulkAction(pendingBulkAction);
    setShowBulkActionConfirm(false);
    setPendingBulkAction("");
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    return sortDirection === "asc" ? (
      <span className="ml-1">↑</span>
    ) : (
      <span className="ml-1">↓</span>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-6"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">Business Owners</h1>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <TextInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, ID..."
              className="bg-gray-800 text-white w-full"
              afterIcon={<MagnifyingGlass size={20} color="#9CA3AF" />}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleApplyFilters();
                }
              }}
            />
          </div>
          
          <Button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            size="md"
            color="metal" 
            className={`relative ${isFilterApplied ? 'border-blue-500' : ''}`}
          >
            <FunnelSimple size={20} weight="bold" />
            <span className="ml-2 hidden md:inline">Filters</span>
            {isFilterApplied && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
            )}
          </Button>
          
          <Button
            onClick={onOpenAddOwnerModal}
            size="md"
            color="primary"
          >
            <Plus size={20} weight="bold" />
            <span className="ml-2 hidden md:inline">Add Owner</span>
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-gray-800 border border-gray-700 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <Dropdown
                  label={filterOptions.status || "Any Status"}
                  size="md"
                  dismissOnClick={true}
                  className="w-full bg-gray-700"
                >
                  <Dropdown.Item
                    onClick={() => onFilterChange({ status: null })}
                    className={!filterOptions.status ? "bg-gray-700" : ""}
                  >
                    Any Status
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => onFilterChange({ status: "ACTIVE" })}
                    className={filterOptions.status === "ACTIVE" ? "bg-gray-700" : ""}
                  >
                    Active
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => onFilterChange({ status: "INACTIVE" })}
                    className={filterOptions.status === "INACTIVE" ? "bg-gray-700" : ""}
                  >
                    Inactive
                  </Dropdown.Item>
                </Dropdown>
              </div>

              {/* Verification Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Verification Status
                </label>
                <Dropdown
                  label={filterOptions.verificationStatus || "Any Verification Status"}
                  size="md"
                  dismissOnClick={true}
                  className="w-full bg-gray-700"
                >
                  <Dropdown.Item
                    onClick={() => onFilterChange({ verificationStatus: null })}
                    className={!filterOptions.verificationStatus ? "bg-gray-700" : ""}
                  >
                    Any Verification Status
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => onFilterChange({ verificationStatus: "UNVERIFIED" })}
                    className={filterOptions.verificationStatus === "UNVERIFIED" ? "bg-gray-700" : ""}
                  >
                    Unverified
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => onFilterChange({ verificationStatus: "PENDING" })}
                    className={filterOptions.verificationStatus === "PENDING" ? "bg-gray-700" : ""}
                  >
                    Pending
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => onFilterChange({ verificationStatus: "VERIFIED" })}
                    className={filterOptions.verificationStatus === "VERIFIED" ? "bg-gray-700" : ""}
                  >
                    Verified
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => onFilterChange({ verificationStatus: "REJECTED" })}
                    className={filterOptions.verificationStatus === "REJECTED" ? "bg-gray-700" : ""}
                  >
                    Rejected
                  </Dropdown.Item>
                </Dropdown>
              </div>

              {/* Municipality Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Municipality
                </label>
                <Dropdown
                  label={filterOptions.municipality || "Any Municipality"}
                  size="md"
                  dismissOnClick={true}
                  className="w-full bg-gray-700"
                >
                  <Dropdown.Item
                    onClick={() => onFilterChange({ municipality: null })}
                    className={!filterOptions.municipality ? "bg-gray-700" : ""}
                  >
                    Any Municipality
                  </Dropdown.Item>
                  {municipalities.map((municipality) => (
                    <Dropdown.Item
                      key={municipality}
                      onClick={() => onFilterChange({ municipality })}
                      className={filterOptions.municipality === municipality ? "bg-gray-700" : ""}
                    >
                      {municipality}
                    </Dropdown.Item>
                  ))}
                </Dropdown>
              </div>

              {/* Assigned Manager Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Assigned Manager
                </label>
                <Dropdown
                  label={
                    filterOptions.assignedManager
                      ? managers.find((m) => m.id === filterOptions.assignedManager)?.name || "Any Manager"
                      : "Any Manager"
                  }
                  size="md"
                  dismissOnClick={true}
                  className="w-full bg-gray-700"
                >
                  <Dropdown.Item
                    onClick={() => onFilterChange({ assignedManager: null })}
                    className={!filterOptions.assignedManager ? "bg-gray-700" : ""}
                  >
                    Any Manager
                  </Dropdown.Item>
                  {managers.map((manager) => (
                    <Dropdown.Item
                      key={manager.id}
                      onClick={() => onFilterChange({ assignedManager: manager.id })}
                      className={filterOptions.assignedManager === manager.id ? "bg-gray-700" : ""}
                    >
                      {manager.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown>
              </div>
            </div>

            <div className="flex justify-end px-4 py-3 bg-gray-800 border-t border-gray-700">
              <Button
                onClick={handleClearFilters}
                size="sm"
                color="metal"
                className="mr-2"
              >
                Clear
              </Button>
              <Button
                onClick={handleApplyFilters}
                size="sm"
                color="primary"
              >
                Apply Filters
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Active Filter Chips */}
      {isFilterApplied && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filterOptions.status && (
            <Badge
              color="metal"
              size="sm"
              className="bg-gray-800 border border-gray-700"
            >
              Status: {filterOptions.status}
              <button
                onClick={() => onFilterChange({ status: null })}
                className="ml-2 text-gray-400 hover:text-white"
              >
                ×
              </button>
            </Badge>
          )}
          
          {filterOptions.verificationStatus && (
            <Badge
              color="metal"
              size="sm"
              className="bg-gray-800 border border-gray-700"
            >
              Verification: {filterOptions.verificationStatus}
              <button
                onClick={() => onFilterChange({ verificationStatus: null })}
                className="ml-2 text-gray-400 hover:text-white"
              >
                ×
              </button>
            </Badge>
          )}
          
          {filterOptions.municipality && (
            <Badge
              color="metal"
              size="sm"
              className="bg-gray-800 border border-gray-700"
            >
              Municipality: {filterOptions.municipality}
              <button
                onClick={() => onFilterChange({ municipality: null })}
                className="ml-2 text-gray-400 hover:text-white"
              >
                ×
              </button>
            </Badge>
          )}
          
          {filterOptions.assignedManager && (
            <Badge
              color="metal"
              size="sm"
              className="bg-gray-800 border border-gray-700"
            >
              Manager: {managers.find((m) => m.id === filterOptions.assignedManager)?.name}
              <button
                onClick={() => onFilterChange({ assignedManager: null })}
                className="ml-2 text-gray-400 hover:text-white"
              >
                ×
              </button>
            </Badge>
          )}
          
          <Button
            onClick={handleClearFilters}
            size="xs"
            color="metal"
            className="text-xs"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {selectedOwners.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="mb-4 bg-gray-800 border border-gray-700 rounded-lg p-3 flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center">
            <span className="text-sm text-gray-300 mr-4">
              {selectedOwners.length} {selectedOwners.length === 1 ? "owner" : "owners"} selected
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                color="metal"
                onClick={() => handleInitiateBulkAction("assignManager")}
              >
                <User size={16} className="mr-1" />
                Assign Manager
              </Button>
              <Button
                size="sm"
                color="metal"
                onClick={() => handleInitiateBulkAction("changeStatus")}
              >
                <ArrowsClockwise size={16} className="mr-1" />
                Change Status
              </Button>
              <Button
                size="sm"
                color="metal"
                onClick={() => handleInitiateBulkAction("export")}
              >
                <DownloadSimple size={16} className="mr-1" />
                Export
              </Button>
              <Button
                size="sm"
                color="metal"
                onClick={() => handleInitiateBulkAction("batchVerify")}
              >
                <CheckCircle size={16} className="mr-1" />
                Batch Verify
              </Button>
            </div>
          </div>
          <Button
            size="sm"
            color="error"
            onClick={() => handleInitiateBulkAction("delete")}
          >
            <TrashSimple size={16} className="mr-1" />
            Delete
          </Button>
        </motion.div>
      )}

      {/* Owners Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden mb-6">
        <Table className="bg-gray-800">
          <Table.Head className="bg-gray-900 text-white">
            <Table.HeadCell className="w-10">
              <input
                type="checkbox"
                className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 h-4 w-4 bg-gray-700"
                checked={selectedOwners.length === owners.length && owners.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </Table.HeadCell>
            <Table.HeadCell 
              className="cursor-pointer hover:bg-gray-800"
              onClick={() => onSortChange("lastName")}
            >
              <div className="flex items-center">
                Owner Name {renderSortIcon("lastName")}
              </div>
            </Table.HeadCell>
            <Table.HeadCell
              className="cursor-pointer hover:bg-gray-800"
              onClick={() => onSortChange("email")}
            >
              <div className="flex items-center">
                Email {renderSortIcon("email")}
              </div>
            </Table.HeadCell>
            <Table.HeadCell
              className="cursor-pointer hover:bg-gray-800"
              onClick={() => onSortChange("phone")}
            >
              <div className="flex items-center">
                Phone {renderSortIcon("phone")}
              </div>
            </Table.HeadCell>
            <Table.HeadCell
              className="cursor-pointer hover:bg-gray-800"
              onClick={() => onSortChange("city")}
            >
              <div className="flex items-center">
                Location {renderSortIcon("city")}
              </div>
            </Table.HeadCell>
            <Table.HeadCell
              className="cursor-pointer hover:bg-gray-800"
              onClick={() => onSortChange("status")}
            >
              <div className="flex items-center">
                Status {renderSortIcon("status")}
              </div>
            </Table.HeadCell>
            <Table.HeadCell
              className="cursor-pointer hover:bg-gray-800"
              onClick={() => onSortChange("verificationStatus")}
            >
              <div className="flex items-center">
                Verification {renderSortIcon("verificationStatus")}
              </div>
            </Table.HeadCell>
            <Table.HeadCell
              className="cursor-pointer hover:bg-gray-800"
              onClick={() => onSortChange("businessesCount")}
            >
              <div className="flex items-center">
                Businesses {renderSortIcon("businessesCount")}
              </div>
            </Table.HeadCell>
            <Table.HeadCell
              className="cursor-pointer hover:bg-gray-800"
              onClick={() => onSortChange("activePermitsCount")}
            >
              <div className="flex items-center">
                Active Permits {renderSortIcon("activePermitsCount")}
              </div>
            </Table.HeadCell>
            <Table.HeadCell
              className="cursor-pointer hover:bg-gray-800"
              onClick={() => onSortChange("expiringPermitsCount")}
            >
              <div className="flex items-center">
                Expiring Permits {renderSortIcon("expiringPermitsCount")}
              </div>
            </Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y divide-gray-700">
            {owners.length > 0 ? (
              owners.map((owner) => {
                const verificationDetails = getVerificationStatusDetails(owner.verificationStatus);
                const statusDetails = getStatusDetails(owner.status);
                
                return (
                  <Table.Row key={owner.id} className="bg-gray-800 hover:bg-gray-750">
                    <Table.Cell>
                      <input
                        type="checkbox"
                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 h-4 w-4 bg-gray-700"
                        checked={selectedOwners.includes(owner.id)}
                        onChange={(e) => handleSelectOwner(owner.id, e.target.checked)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center">
                        <Avatar 
                          shape="circle"
                          size="md"
                          className="mr-3 bg-blue-600 text-white"
                        >
                          <UserCircle size={24} weight="fill" />
                        </Avatar>
                        <div>
                          <a
                            href={`/app/business-owners/${owner.id}`}
                            className="font-medium text-blue-400 hover:text-blue-300"
                          >
                            {owner.firstName} {owner.lastName}
                          </a>
                          <p className="text-xs text-gray-400">{owner.id}</p>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <a
                        href={`mailto:${owner.email}`}
                        className="text-gray-300 hover:text-blue-400"
                      >
                        {owner.email}
                      </a>
                    </Table.Cell>
                    <Table.Cell>
                      {owner.phone || (
                        <span className="text-gray-500 italic">Not provided</span>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {owner.city || (
                        <span className="text-gray-500 italic">Not provided</span>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge 
                        color={statusDetails.color as any} 
                        size="sm"
                      >
                        {statusDetails.label}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge 
                        color={verificationDetails.color as any} 
                        size="sm"
                        icon={verificationDetails.icon}
                      >
                        {owner.verificationStatus}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Tooltip content="View businesses" trigger="hover">
                        <a
                          href={`/app/businesses?ownerId=${owner.id}`}
                          className="text-center flex items-center"
                        >
                          <Buildings size={16} className="mr-1 text-gray-400" />
                          <span className={owner.businessesCount > 0 ? "text-white" : "text-gray-500"}>
                            {owner.businessesCount}
                          </span>
                        </a>
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell>
                      <Tooltip content="View active permits" trigger="hover">
                        <a
                          href={`/app/permits?ownerId=${owner.id}&status=ACTIVE`}
                          className="text-center flex items-center"
                        >
                          <Clipboard size={16} className="mr-1 text-gray-400" />
                          <span className={owner.activePermitsCount > 0 ? "text-white" : "text-gray-500"}>
                            {owner.activePermitsCount}
                          </span>
                        </a>
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell>
                      <Tooltip content="View expiring permits" trigger="hover">
                        <a
                          href={`/app/permits?ownerId=${owner.id}&status=EXPIRING_SOON`}
                          className="text-center flex items-center"
                        >
                          <Calendar size={16} className="mr-1 text-orange-400" />
                          <span className={owner.expiringPermitsCount > 0 ? "text-orange-400 font-medium" : "text-gray-500"}>
                            {owner.expiringPermitsCount}
                          </span>
                        </a>
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell>
                      <Dropdown
                        label=""
                        size="sm"
                        dismissOnClick={true}
                        type="primary"
                        icon={<DotsThreeOutlineVertical size={16} />}
                      >
                        <Dropdown.Item>
                          <a
                            href={`/app/business-owners/${owner.id}`}
                            className="flex items-center w-full"
                          >
                            <UserCircle size={16} className="mr-2" />
                            View Details
                          </a>
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <a
                            href={`/app/business-owners/${owner.id}/edit`}
                            className="flex items-center w-full"
                          >
                            <UserCircle size={16} className="mr-2" />
                            Edit
                          </a>
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <a
                            href={`/app/business-owners/${owner.id}/verify`}
                            className="flex items-center w-full"
                          >
                            <CheckCircle size={16} className="mr-2" />
                            Verify
                          </a>
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <button
                            className="flex items-center w-full"
                            onClick={() => {
                              // Toggle status logic
                              console.log(`Toggle status for ${owner.id}`);
                            }}
                          >
                            <ArrowsClockwise size={16} className="mr-2" />
                            {owner.status === "ACTIVE" ? "Set Inactive" : "Set Active"}
                          </button>
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <a
                            href={`/app/businesses/new?ownerId=${owner.id}`}
                            className={`flex items-center w-full ${
                              owner.verificationStatus !== "VERIFIED" || owner.status !== "ACTIVE"
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <Buildings size={16} className="mr-2" />
                            Add Business
                          </a>
                        </Dropdown.Item>
                        <Dropdown.Item className="text-red-500 hover:bg-red-900/30">
                          <button
                            className="flex items-center w-full text-red-500"
                            onClick={() => {
                              // Delete logic
                              console.log(`Delete ${owner.id}`);
                            }}
                          >
                            <TrashSimple size={16} className="mr-2" />
                            Delete
                          </button>
                        </Dropdown.Item>
                      </Dropdown>
                    </Table.Cell>
                  </Table.Row>
                );
              })
            ) : (
              <Table.Row className="bg-gray-800">
                <Table.Cell colSpan={11} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <UserCircle size={48} weight="light" className="mb-3" />
                    <p className="text-xl font-medium mb-2">No business owners found</p>
                    <p className="text-gray-500 mb-4">
                      {isFilterApplied
                        ? "Try adjusting your filters or search criteria"
                        : "Start by adding your first business owner"}
                    </p>
                    {!isFilterApplied && (
                      <Button
                        onClick={onOpenAddOwnerModal}
                        size="md"
                        color="primary"
                      >
                        <Plus size={20} weight="bold" />
                        <span className="ml-2">Add Business Owner</span>
                      </Button>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-gray-400 mb-4 md:mb-0">
          Showing <span className="font-medium text-white">{owners.length}</span> of{" "}
          <span className="font-medium text-white">{totalItems}</span> business owners
        </div>
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          showIcons={true}
          iconClassName="text-white"
          activeIconClassName="bg-blue-600"
        />
      </div>

      {/* Bulk Action Confirmation Modal */}
      <Modal
        size="md"
        show={showBulkActionConfirm}
        onClose={() => setShowBulkActionConfirm(false)}
      >
        <Modal.Header className="bg-gray-800 text-white border-b border-gray-700">Confirm Action</Modal.Header>
        <Modal.Body className="bg-gray-800 text-white">
          <div className="space-y-6">
            <p>
              Are you sure you want to {pendingBulkAction === "delete" ? "delete" : pendingBulkAction}{" "}
              the selected {selectedOwners.length} {selectedOwners.length === 1 ? "owner" : "owners"}?
            </p>
            <p className="text-gray-400 text-sm">
              {pendingBulkAction === "delete"
                ? "This action cannot be undone. All associated businesses and permits will also be affected."
                : "This will update the status of all selected business owners."}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-gray-800 border-t border-gray-700">
          <Button
            onClick={() => setShowBulkActionConfirm(false)}
            size="sm"
            color="metal"
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmBulkAction}
            size="sm"
            color={pendingBulkAction === "delete" ? "error" : "primary"}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
};

export default DesktopBusinessOwnerList;
