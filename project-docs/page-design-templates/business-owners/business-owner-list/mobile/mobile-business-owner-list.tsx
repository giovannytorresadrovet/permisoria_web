// /components/mobile/owners/BusinessOwnerList.tsx
import React, { useState } from "react";
import { 
  Card, 
  Badge, 
  Button, 
  Avatar, 
  TextInput, 
  Dropdown, 
  Pagination, 
  Modal, 
  Drawer
} from "keep-react";
import {
  MagnifyingGlass,
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
  ArrowRight,
  Envelope,
  Phone,
  MapPin,
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
  filterOptions: FilterOptions;
  onSearch: (term: string) => void;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  onSelectionChange: (ownerIds: string[]) => void;
  onBulkAction: (action: string) => void;
  onPageChange: (page: number) => void;
  onOpenAddOwnerModal: () => void;
}

const MobileBusinessOwnerList: React.FC<BusinessOwnerListProps> = ({
  owners,
  totalItems,
  currentPage,
  itemsPerPage,
  totalPages,
  selectedOwners,
  filterOptions,
  onSearch,
  onFilterChange,
  onSelectionChange,
  onBulkAction,
  onPageChange,
  onOpenAddOwnerModal,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [showBulkActionConfirm, setShowBulkActionConfirm] = useState(false);
  const [pendingBulkAction, setPendingBulkAction] = useState("");
  const [showSelectionMode, setShowSelectionMode] = useState(false);

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

  const handleSelectOwner = (ownerId: string) => {
    if (selectedOwners.includes(ownerId)) {
      onSelectionChange(selectedOwners.filter((id) => id !== ownerId));
    } else {
      onSelectionChange([...selectedOwners, ownerId]);
    }
  };

  const handleApplyFilters = () => {
    onSearch(searchTerm);
    setShowFilterDrawer(false);
    
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
    setShowFilterDrawer(false);
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

  const toggleSelectionMode = () => {
    setShowSelectionMode(!showSelectionMode);
    if (showSelectionMode) {
      // When exiting selection mode, clear selections
      onSelectionChange([]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="px-4 py-6"
    >
      {/* Page Header */}
      <div className="flex flex-col mb-4">
        <h1 className="text-2xl font-bold text-white mb-3">Business Owners</h1>
        
        <div className="flex space-x-2">
          <div className="relative flex-grow">
            <TextInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search owners..."
              className="bg-gray-800 text-white w-full"
              afterIcon={<MagnifyingGlass size={20} color="#9CA3AF" />}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearch(searchTerm);
                }
              }}
            />
          </div>
          
          <Button
            onClick={() => setShowFilterDrawer(true)}
            size="md"
            color="metal" 
            className={`${isFilterApplied ? 'border-blue-500' : ''}`}
          >
            <FunnelSimple size={20} weight="bold" />
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
          </Button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {isFilterApplied && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mb-4 pb-2 overflow-x-auto"
        >
          {filterOptions.status && (
            <Badge
              color="metal"
              size="sm"
              className="bg-gray-800 border border-gray-700 whitespace-nowrap"
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
              className="bg-gray-800 border border-gray-700 whitespace-nowrap"
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
              className="bg-gray-800 border border-gray-700 whitespace-nowrap"
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
              className="bg-gray-800 border border-gray-700 whitespace-nowrap"
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
        </motion.div>
      )}

      {/* Selection Mode Toggle */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-400">
          {totalItems} {totalItems === 1 ? "owner" : "owners"}
        </div>
        
        <Button
          onClick={toggleSelectionMode}
          size="sm"
          color="metal"
          className="text-sm"
        >
          {showSelectionMode ? "Cancel Selection" : "Select"}
        </Button>
      </div>

      {/* Bulk Actions Bar */}
      {showSelectionMode && selectedOwners.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-3 z-10 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">
              {selectedOwners.length} selected
            </span>
            
            <div className="flex gap-2">
              <Dropdown
                label="Actions"
                size="sm"
                type="primary"
                dismissOnClick={true}
              >
                <Dropdown.Item onClick={() => handleInitiateBulkAction("assignManager")}>
                  <User size={16} className="mr-2" />
                  Assign Manager
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleInitiateBulkAction("changeStatus")}>
                  <ArrowsClockwise size={16} className="mr-2" />
                  Change Status
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleInitiateBulkAction("export")}>
                  <DownloadSimple size={16} className="mr-2" />
                  Export
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleInitiateBulkAction("batchVerify")}>
                  <CheckCircle size={16} className="mr-2" />
                  Batch Verify
                </Dropdown.Item>
                <Dropdown.Item 
                  onClick={() => handleInitiateBulkAction("delete")}
                  className="text-red-500 hover:bg-red-900/30"
                >
                  <TrashSimple size={16} className="mr-2" />
                  Delete
                </Dropdown.Item>
              </Dropdown>
              
              <Button
                size="sm"
                color="metal"
                onClick={() => handleSelectAll(selectedOwners.length !== owners.length)}
              >
                {selectedOwners.length === owners.length ? "Deselect All" : "Select All"}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Owners Card List */}
      <div className="space-y-3 mb-6 pb-16">
        {owners.length > 0 ? (
          owners.map((owner) => {
            const verificationDetails = getVerificationStatusDetails(owner.verificationStatus);
            const statusDetails = getStatusDetails(owner.status);
            
            return (
              <motion.div
                key={owner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-gray-800 border border-gray-700 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start p-4">
                    {/* Checkbox (in selection mode) */}
                    {showSelectionMode && (
                      <div className="mr-3 mt-1.5">
                        <input
                          type="checkbox"
                          className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 h-4 w-4 bg-gray-700"
                          checked={selectedOwners.includes(owner.id)}
                          onChange={() => handleSelectOwner(owner.id)}
                        />
                      </div>
                    )}
                    
                    {/* Avatar */}
                    <Avatar 
                      shape="circle"
                      size="md"
                      className="mr-3 bg-blue-600 text-white"
                    >
                      <UserCircle size={24} weight="fill" />
                    </Avatar>
                    
                    {/* Owner Info */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <a
                            href={`/app/business-owners/${owner.id}`}
                            className="text-blue-400 hover:text-blue-300 font-medium block mb-0.5"
                          >
                            {owner.firstName} {owner.lastName}
                          </a>
                          <p className="text-xs text-gray-400 mb-2">{owner.id}</p>
                        </div>
                        
                        {!showSelectionMode && (
                          <Dropdown
                            label=""
                            size="sm"
                            dismissOnClick={true}
                            type="primary"
                            icon={<DotsThreeOutlineVertical size={18} />}
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
                        )}
                      </div>
                      
                      {/* Contact Info */}
                      <div className="mb-2">
                        <div className="flex items-center mb-1.5">
                          <Envelope size={16} className="text-gray-400 mr-2" />
                          <a
                            href={`mailto:${owner.email}`}
                            className="text-gray-300 hover:text-blue-400 text-sm"
                          >
                            {owner.email}
                          </a>
                        </div>
                        
                        {owner.phone && (
                          <div className="flex items-center mb-1.5">
                            <Phone size={16} className="text-gray-400 mr-2" />
                            <a
                              href={`tel:${owner.phone}`}
                              className="text-gray-300 hover:text-blue-400 text-sm"
                            >
                              {owner.phone}
                            </a>
                          </div>
                        )}
                        
                        {owner.city && (
                          <div className="flex items-center">
                            <MapPin size={16} className="text-gray-400 mr-2" />
                            <span className="text-gray-300 text-sm">{owner.city}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Status Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge 
                          color={statusDetails.color as any} 
                          size="sm"
                        >
                          {statusDetails.label}
                        </Badge>
                        
                        <Badge 
                          color={verificationDetails.color as any} 
                          size="sm"
                          icon={verificationDetails.icon}
                        >
                          {owner.verificationStatus}
                        </Badge>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <a
                          href={`/app/businesses?ownerId=${owner.id}`}
                          className="flex flex-col items-center p-2 rounded-md bg-gray-750 border border-gray-700"
                        >
                          <Buildings size={16} className="text-gray-400 mb-1" />
                          <span className={`text-xs font-medium ${owner.businessesCount > 0 ? "text-white" : "text-gray-500"}`}>
                            {owner.businessesCount} {owner.businessesCount === 1 ? "Business" : "Businesses"}
                          </span>
                        </a>
                        
                        <a
                          href={`/app/permits?ownerId=${owner.id}&status=ACTIVE`}
                          className="flex flex-col items-center p-2 rounded-md bg-gray-750 border border-gray-700"
                        >
                          <Clipboard size={16} className="text-gray-400 mb-1" />
                          <span className={`text-xs font-medium ${owner.activePermitsCount > 0 ? "text-white" : "text-gray-500"}`}>
                            {owner.activePermitsCount} Active
                          </span>
                        </a>
                        
                        <a
                          href={`/app/permits?ownerId=${owner.id}&status=EXPIRING_SOON`}
                          className="flex flex-col items-center p-2 rounded-md bg-gray-750 border border-gray-700"
                        >
                          <Calendar size={16} className={`mb-1 ${owner.expiringPermitsCount > 0 ? "text-orange-400" : "text-gray-400"}`} />
                          <span className={`text-xs font-medium ${owner.expiringPermitsCount > 0 ? "text-orange-400" : "text-gray-500"}`}>
                            {owner.expiringPermitsCount} Expiring
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <div className="py-10 flex flex-col items-center justify-center text-gray-400">
            <UserCircle size={48} weight="light" className="mb-3" />
            <p className="text-xl font-medium mb-2">No business owners found</p>
            <p className="text-gray-500 mb-4 text-center">
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
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 py-3 px-4 flex justify-center z-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            showIcons={true}
            iconClassName="text-white"
            activeIconClassName="bg-blue-600"
          />
        </div>
      )}

      {/* Filter Drawer */}
      <Drawer
        isOpen={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        position="right"
        size="md"
      >
        <Drawer.Header className="bg-gray-800 border-b border-gray-700">
          <div className="text-xl font-semibold text-white">Filter Business Owners</div>
        </Drawer.Header>
        <Drawer.Body className="bg-gray-800">
          <div className="space-y-6 p-4">
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

            {/* Search Term */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search
              </label>
              <TextInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name, Email, ID, Location..."
                className="bg-gray-700 text-white w-full"
                afterIcon={<MagnifyingGlass size={20} color="#9CA3AF" />}
              />
            </div>
          </div>
        </Drawer.Body>
        <Drawer.Footer className="bg-gray-800 border-t border-gray-700">
          <div className="flex justify-between w-full">
            <Button
              onClick={handleClearFilters}
              size="md"
              color="metal"
            >
              Clear All
            </Button>
            <Button
              onClick={handleApplyFilters}
              size="md"
              color="primary"
            >
              Apply Filters
            </Button>
          </div>
        </Drawer.Footer>
      </Drawer>

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

export default MobileBusinessOwnerList;
