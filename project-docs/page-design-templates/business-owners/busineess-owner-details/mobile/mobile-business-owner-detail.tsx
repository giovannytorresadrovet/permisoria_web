// /components/mobile/owners/BusinessOwnerDetail.jsx
import React, { useState, useEffect } from "react";
import { 
  Card, 
  Badge, 
  Button, 
  Avatar, 
  TextInput, 
  Dropdown, 
  Tabs, 
  Breadcrumb,
  Modal
} from "keep-react";
import {
  ArrowLeft,
  DotsThreeOutlineVertical,
  UserCircle,
  Buildings,
  Clipboard,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Envelope,
  Phone,
  MapPin,
  CopySimple,
  PencilSimple,
  NotePencil,
  FileText,
  ClockClockwise,
  Eye,
  Plus,
  TrashSimple,
  DownloadSimple,
  FloppyDisk,
  WarningCircle,
  Info
} from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";
import * as businessOwnerService from "../../../lib/services/businessOwnerService";

const MobileBusinessOwnerDetail = ({ id }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [owner, setOwner] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editSectionId, setEditSectionId] = useState("");
  const [showActionConfirm, setShowActionConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState("");
  const [noteText, setNoteText] = useState("");
  const [noteCategory, setNoteCategory] = useState("Admin");
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [showDocumentViewModal, setShowDocumentViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch owner data
  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const data = await businessOwnerService.getBusinessOwnerById(id);
        setOwner(data);
      } catch (error) {
        console.error("Error fetching business owner:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwner();
  }, [id]);

  // Handle initiating action with confirmation
  const handleInitiateAction = (action) => {
    setPendingAction(action);
    setShowActionConfirm(true);
  };

  // Confirm action
  const confirmAction = async () => {
    try {
      switch (pendingAction) {
        case "delete":
          await businessOwnerService.deleteBusinessOwner(owner.id);
          // In real app, would redirect to business owners list
          console.log(`Deleted owner: ${owner.id}`);
          break;
        case "verify":
          // Would redirect to verification workflow
          console.log(`Start verification for owner: ${owner.id}`);
          break;
        case "changeStatus":
          const newStatus = owner.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
          const updatedOwner = await businessOwnerService.changeBusinessOwnerStatus(owner.id, newStatus);
          setOwner(updatedOwner);
          break;
        default:
          if (pendingAction.startsWith("unlinkBusiness-")) {
            const businessId = pendingAction.replace("unlinkBusiness-", "");
            console.log(`Unlink business ${businessId} from owner ${owner.id}`);
            // Would make API call here
            // For demo, filter out the business from local state
            setOwner({
              ...owner,
              businesses: owner.businesses.filter((b) => b.id !== businessId)
            });
          }
          break;
      }
    } catch (error) {
      console.error("Error performing action:", error);
    } finally {
      setShowActionConfirm(false);
      setPendingAction("");
    }
  };

  // Handle edit mode
  const toggleEditMode = (sectionId) => {
    if (isEditMode && editSectionId === sectionId) {
      // Save changes
      console.log(`Save changes for section: ${sectionId}`);
      setIsEditMode(false);
      setEditSectionId("");
    } else {
      // Enter edit mode
      setIsEditMode(true);
      setEditSectionId(sectionId);
    }
  };

  // Handle adding a note
  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    
    try {
      const newNote = {
        content: noteText,
        author: "Alex Johnson", // Would be the current user
        category: noteCategory
      };
      
      const updatedOwner = await businessOwnerService.addBusinessOwnerNote(owner.id, newNote);
      setOwner(updatedOwner);
      setNoteText("");
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };
  
  // Handle document view
  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setShowDocumentViewModal(true);
  };

  // Handle document upload
  const handleUploadDocument = async (documentData) => {
    try {
      const updatedOwner = await businessOwnerService.uploadBusinessOwnerDocument(owner.id, documentData);
      setOwner(updatedOwner);
      setShowAddDocumentModal(false);
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  // Get action confirmation content based on action type
  const getActionConfirmContent = () => {
    switch (pendingAction) {
      case "delete":
        return {
          title: "Confirm Deletion",
          description: "Are you sure you want to delete this business owner? This action cannot be undone and will affect all associated businesses and permits.",
          buttonText: "Delete Owner",
          buttonColor: "error"
        };
      case "verify":
        return {
          title: "Start Verification Process",
          description: "Are you sure you want to start the verification process for this business owner?",
          buttonText: "Start Verification",
          buttonColor: "primary"
        };
      case "changeStatus":
        const newStatus = owner?.status === "ACTIVE" ? "Inactive" : "Active";
        return {
          title: `Set Status to ${newStatus}`,
          description: `Are you sure you want to change the status of this business owner to ${newStatus.toLowerCase()}?`,
          buttonText: `Set ${newStatus}`,
          buttonColor: "primary"
        };
      default:
        if (pendingAction.startsWith("unlinkBusiness-")) {
          return {
            title: "Unlink Business",
            description: "Are you sure you want to unlink this business from this owner? This action will remove the association but will not delete the business.",
            buttonText: "Unlink Business",
            buttonColor: "primary"
          };
        }
        return {
          title: "Confirm Action",
          description: "Are you sure you want to proceed with this action?",
          buttonText: "Confirm",
          buttonColor: "primary"
        };
    }
  };

  // Render loading state if owner is not loaded
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state if owner is not found
  if (!owner) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white p-6">
        <WarningCircle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Business Owner Not Found</h1>
        <p className="text-gray-400 mb-6 text-center">The business owner you're looking for does not exist or you do not have permission to view it.</p>
        <a 
          href="/app/business-owners" 
          className="flex items-center text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft size={16} className="mr-1" />
          Return to Business Owners
        </a>
      </div>
    );
  }

  const verificationStatusDetails = businessOwnerService.getVerificationStatusDetails(owner.verificationStatus);
  const statusDetails = businessOwnerService.getStatusDetails(owner.status);
  const confirmContent = getActionConfirmContent();

  return (
    <div className="bg-gray-900 min-h-screen text-white pb-20">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-4 py-4 border-b border-gray-800 bg-gray-900 sticky top-0 z-10"
      >
        <div className="flex flex-col">
          <div className="flex items-center mb-1">
            <a href="/app/business-owners" className="text-blue-400 hover:text-blue-300 mr-2">
              <ArrowLeft size={20} />
            </a>
            <Breadcrumb>
              <Breadcrumb.Item href="/app/dashboard">Dashboard</Breadcrumb.Item>
              <Breadcrumb.Item href="/app/business-owners">Business Owners</Breadcrumb.Item>
              <Breadcrumb.Item href="#">{owner.firstName} {owner.lastName}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold mr-3">
                {owner.firstName} {owner.lastName}
              </h1>
              <p className="text-sm text-gray-400">{owner.id}</p>
            </div>
            
            <div className="flex">
              <Dropdown
                label=""
                size="sm"
                type="primary"
                dismissOnClick={true}
                icon={<DotsThreeOutlineVertical size={18} />}
              >
                <Dropdown.Item>
                  <a
                    href={`/app/business-owners/${owner.id}/edit`}
                    className="flex items-center w-full"
                  >
                    <PencilSimple size={16} className="mr-2" />
                    Edit
                  </a>
                </Dropdown.Item>
                <Dropdown.Item>
                  <button
                    className="flex items-center w-full"
                    onClick={() => handleInitiateAction("verify")}
                  >
                    <CheckCircle size={16} className="mr-2" />
                    {owner.verificationStatus === "VERIFIED" ? "View Verification" : "Start Verification"}
                  </button>
                </Dropdown.Item>
                <Dropdown.Item>
                  <button
                    className="flex items-center w-full"
                    onClick={() => handleInitiateAction("changeStatus")}
                  >
                    <Calendar size={16} className="mr-2" />
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
                    onClick={() => handleInitiateAction("delete")}
                  >
                    <TrashSimple size={16} className="mr-2" />
                    Delete
                  </button>
                </Dropdown.Item>
              </Dropdown>
            </div>
          </div>
          
          <div className="flex space-x-2 mt-2">
            <Badge 
              color={statusDetails.color} 
              size="sm"
            >
              {statusDetails.label}
            </Badge>
            <Badge 
              color={verificationStatusDetails.color} 
              size="sm"
              icon={<CheckCircle size={16} weight="fill" />}
            >
              {owner.verificationStatus}
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="px-4 py-6"
      >
        <Card className="bg-gray-800 border border-gray-700 shadow-xl overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex flex-col items-center mb-6">
              <Avatar 
                shape="circle"
                size="2xl"
                className="bg-blue-600 text-white text-2xl mb-4"
              >
                {businessOwnerService.getInitials(owner.firstName, owner.lastName)}
              </Avatar>
              <h2 className="text-xl font-bold">{owner.firstName} {owner.lastName}</h2>
              
              {owner.verificationStatus === "VERIFIED" ? (
                <div className="mt-2 flex items-center">
                  <Badge 
                    color="success" 
                    size="sm"
                    icon={<CheckCircle size={16} weight="fill" />}
                  >
                    Verified
                  </Badge>
                </div>
              ) : (
                <Button
                  size="sm"
                  color="primary"
                  className="mt-3"
                  onClick={() => handleInitiateAction("verify")}
                >
                  <CheckCircle size={16} weight="bold" className="mr-1.5" />
                  {owner.verificationStatus === "PENDING" ? "Continue Verification" : "Start Verification"}
                </Button>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Envelope size={18} className="text-gray-400 mr-3" />
                <div className="flex-grow">
                  <p className="text-gray-400 text-sm mb-0.5">Email</p>
                  <div className="flex items-center">
                    <a 
                      href={`mailto:${owner.email}`}
                      className="text-gray-200 hover:text-blue-400 mr-2 text-sm"
                    >
                      {owner.email}
                    </a>
                    <button 
                      onClick={() => businessOwnerService.copyToClipboard(owner.email)}
                      className="text-gray-500 hover:text-blue-400"
                    >
                      <CopySimple size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone size={18} className="text-gray-400 mr-3" />
                <div className="flex-grow">
                  <p className="text-gray-400 text-sm mb-0.5">Phone</p>
                  <div className="flex items-center">
                    <a 
                      href={`tel:${owner.phone}`}
                      className="text-gray-200 hover:text-blue-400 mr-2 text-sm"
                    >
                      {owner.phone}
                    </a>
                    <button 
                      onClick={() => businessOwnerService.copyToClipboard(owner.phone)}
                      className="text-gray-500 hover:text-blue-400"
                    >
                      <CopySimple size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin size={18} className="text-gray-400 mr-3 mt-0.5" />
                <div className="flex-grow">
                  <p className="text-gray-400 text-sm mb-0.5">Address</p>
                  <div className="flex items-start">
                    <p className="text-gray-200 mr-2 text-sm">
                      {owner.addressLine1}<br />
                      {owner.addressLine2 && <>{owner.addressLine2}<br /></>}
                      {owner.city}, {owner.zipCode}
                    </p>
                    <button 
                      onClick={() => businessOwnerService.copyToClipboard(
                        `${owner.addressLine1}, ${owner.addressLine2 ? owner.addressLine2 + ', ' : ''}${owner.city}, ${owner.zipCode}`
                      )}
                      className="text-gray-500 hover:text-blue-400 mt-0.5"
                    >
                      <CopySimple size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <ClockClockwise size={18} className="text-gray-400 mr-3" />
                <div className="flex-grow">
                  <p className="text-gray-400 text-sm mb-0.5">Registration Date</p>
                  <p className="text-gray-200 text-sm">
                    {businessOwnerService.formatDate(owner.registrationDate)}
                  </p>
                </div>
              </div>
              
              {owner.assignedManagerName && (
                <div className="flex items-center">
                  <User size={18} className="text-gray-400 mr-3" />
                  <div className="flex-grow">
                    <p className="text-gray-400 text-sm mb-0.5">Assigned Manager</p>
                    <p className="text-gray-200 text-sm">
                      {owner.assignedManagerName}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <Button
                size="md"
                color="primary"
                className="w-full"
                onClick={() => handleInitiateAction("verify")}
              >
                <Eye size={18} weight="bold" className="mr-1.5" />
                View Verification History
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabs Section */}
      <div className="px-4">
        <Tabs 
          value={activeTab}
          onValueChange={(tab) => setActiveTab(tab)}
          className="border-b border-gray-700"
        >
          <Tabs.List className="bg-gray-900 overflow-x-auto">
            <Tabs.Tab
              value="overview"
              className={`py-3 px-4 text-sm font-medium ${activeTab === 'overview' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Overview
            </Tabs.Tab>
            <Tabs.Tab
              value="businesses"
              className={`py-3 px-4 text-sm font-medium ${activeTab === 'businesses' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Businesses ({owner.businesses.length})
            </Tabs.Tab>
            <Tabs.Tab
              value="documents"
              className={`py-3 px-4 text-sm font-medium ${activeTab === 'documents' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Documents ({owner.documents.length})
            </Tabs.Tab>
            <Tabs.Tab
              value="history"
              className={`py-3 px-4 text-sm font-medium ${activeTab === 'history' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            >
              History
            </Tabs.Tab>
            <Tabs.Tab
              value="notes"
              className={`py-3 px-4 text-sm font-medium ${activeTab === 'notes' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Notes ({owner.notes.length})
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
        
        <div className="mt-6 pb-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Personal Information */}
              <Card className="bg-gray-800 border border-gray-700 shadow-md mb-6">
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    <Button
                      size="sm"
                      color="metal"
                      onClick={() => toggleEditMode("personal")}
                    >
                      {isEditMode && editSectionId === "personal" ? (
                        <>
                          <FloppyDisk size={16} className="mr-1.5" />
                          Save
                        </>
                      ) : (
                        <>
                          <PencilSimple size={16} className="mr-1.5" />
                          Edit
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {isEditMode && editSectionId === "personal" ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          First Name
                        </label>
                        <TextInput
                          placeholder="First Name"
                          value={owner.firstName}
                          onChange={(e) => setOwner({...owner, firstName: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Last Name
                        </label>
                        <TextInput
                          placeholder="Last Name"
                          value={owner.lastName}
                          onChange={(e) => setOwner({...owner, lastName: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Date of Birth
                        </label>
                        <TextInput
                          type="date"
                          value={owner.dateOfBirth}
                          onChange={(e) => setOwner({...owner, dateOfBirth: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Tax ID
                        </label>
                        <TextInput
                          placeholder="Tax ID"
                          value={owner.taxId}
                          disabled
                          className="bg-gray-700 border-gray-600 text-white opacity-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">Tax ID can only be updated during verification</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          ID License Number
                        </label>
                        <TextInput
                          placeholder="ID License Number"
                          value={owner.idLicenseNumber}
                          onChange={(e) => setOwner({...owner, idLicenseNumber: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Full Name</p>
                        <p className="text-white">{owner.firstName} {owner.lastName}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Date of Birth</p>
                        <p className="text-white">{businessOwnerService.formatDate(owner.dateOfBirth)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Tax ID</p>
                        <p className="text-white">{owner.taxId}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">ID License Number</p>
                        <p className="text-white">{owner.idLicenseNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
              
              {/* Contact Information */}
              <Card className="bg-gray-800 border border-gray-700 shadow-md mb-6">
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                    <Button
                      size="sm"
                      color="metal"
                      onClick={() => toggleEditMode("contact")}
                    >
                      {isEditMode && editSectionId === "contact" ? (
                        <>
                          <FloppyDisk size={16} className="mr-1.5" />
                          Save
                        </>
                      ) : (
                        <>
                          <PencilSimple size={16} className="mr-1.5" />
                          Edit
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {isEditMode && editSectionId === "contact" ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Email
                        </label>
                        <TextInput
                          placeholder="Email"
                          value={owner.email}
                          onChange={(e) => setOwner({...owner, email: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Phone
                        </label>
                        <TextInput
                          placeholder="Phone"
                          value={owner.phone}
                          onChange={(e) => setOwner({...owner, phone: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Address Line 1
                        </label>
                        <TextInput
                          placeholder="Address Line 1"
                          value={owner.addressLine1}
                          onChange={(e) => setOwner({...owner, addressLine1: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Address Line 2
                        </label>
                        <TextInput
                          placeholder="Address Line 2 (Optional)"
                          value={owner.addressLine2}
                          onChange={(e) => setOwner({...owner, addressLine2: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          City
                        </label>
                        <TextInput
                          placeholder="City"
                          value={owner.city}
                          onChange={(e) => setOwner({...owner, city: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Zip Code
                        </label>
                        <TextInput
                          placeholder="Zip Code"
                          value={owner.zipCode}
                          onChange={(e) => setOwner({...owner, zipCode: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Email</p>
                        <div className="flex items-center">
                          <a href={`mailto:${owner.email}`} className="text-white hover:text-blue-400 mr-2">
                            {owner.email}
                          </a>
                          <button 
                            onClick={() => businessOwnerService.copyToClipboard(owner.email)}
                            className="text-gray-500 hover:text-blue-400"
                          >
                            <CopySimple size={16} />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Phone</p>
                        <div className="flex items-center">
                          <a href={`tel:${owner.phone}`} className="text-white hover:text-blue-400 mr-2">
                            {owner.phone}
                          </a>
                          <button 
                            onClick={() => businessOwnerService.copyToClipboard(owner.phone)}
                            className="text-gray-500 hover:text-blue-400"
                          >
                            <CopySimple size={16} />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Address</p>
                        <div className="flex items-start">
                          <p className="text-white mr-2">
                            {owner.addressLine1}<br />
                            {owner.addressLine2 && <>{owner.addressLine2}<br /></>}
                            {owner.city}, {owner.zipCode}
                          </p>
                          <button 
                            onClick={() => businessOwnerService.copyToClipboard(
                              `${owner.addressLine1}, ${owner.addressLine2 ? owner.addressLine2 + ', ' : ''}${owner.city}, ${owner.zipCode}`
                            )}
                            className="text-gray-500 hover:text-blue-400 mt-0.5"
                          >
                            <CopySimple size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
              
              {/* Status Information */}
              <Card className="bg-gray-800 border border-gray-700 shadow-md mb-6">
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Status Information</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Status</p>
                      <div className="flex items-center">
                        <Badge 
                          color={statusDetails.color} 
                          size="sm"
                        >
                          {statusDetails.label}
                        </Badge>
                        <button
                          onClick={() => handleInitiateAction("changeStatus")}
                          className="ml-2 text-xs text-blue-400 hover:text-blue-300"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Verification Status</p>
                      <div className="flex items-center">
                        <Badge 
                          color={verificationStatusDetails.color} 
                          size="sm"
                          icon={<CheckCircle size={16} weight="fill" />}
                        >
                          {owner.verificationStatus}
                        </Badge>
                        <button
                          onClick={() => handleInitiateAction("verify")}
                          className="ml-2 text-xs text-blue-400 hover:text-blue-300"
                        >
                          {owner.verificationStatus === "VERIFIED" ? "View History" : "Start Verification"}
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Registration Date</p>
                      <p className="text-white">{businessOwnerService.formatDate(owner.registrationDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Last Updated</p>
                      <p className="text-white">{businessOwnerService.formatDate(owner.updatedAt)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Assigned Manager</p>
                      <p className="text-white">{owner.assignedManagerName || "Not assigned"}</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Recent Activity */}
              <Card className="bg-gray-800 border border-gray-700 shadow-md">
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                    <Button
                      size="sm"
                      color="metal"
                      onClick={() => setActiveTab("history")}
                    >
                      View All
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {owner.historyLogs.slice(0, 3).map((log) => (
                      <div key={log.id} className="border-l-2 border-gray-700 pl-4 py-1">
                        <div className="flex items-center">
                          <Badge 
                            color={
                              log.actionType === "VERIFICATION" ? "success" :
                              log.actionType === "DOCUMENT" ? "info" :
                              log.actionType === "BUSINESS" ? "warning" :
                              "gray"
                            }
                            size="sm"
                            className="mr-2"
                          >
                            {log.actionType}
                          </Badge>
                          <p className="text-sm text-gray-400">
                            {businessOwnerService.formatDate(log.timestamp)} at {businessOwnerService.formatTime(log.timestamp)}
                          </p>
                        </div>
                        <p className="text-white text-sm mt-1">{log.description}</p>
                        <p className="text-xs text-gray-500 mt-0.5">By {log.user}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
          
          {/* Businesses Tab */}
          {activeTab === "businesses" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Associated Businesses</h3>
                <a
                  href={`/app/businesses/new?ownerId=${owner.id}`}
                  className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    owner.verificationStatus !== "VERIFIED" || owner.status !== "ACTIVE"
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                >
                  <Plus size={16} className="mr-1.5" />
                  Add Business
                </a>
              </div>
              
              {owner.verificationStatus !== "VERIFIED" && (
                <div className="bg-yellow-900/30 border border-yellow-700 rounded-md p-3 mb-4 flex items-start">
                  <WarningCircle size={20} className="text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-300 font-medium">Verification Required</p>
                    <p className="text-yellow-200/80 text-sm mt-1">
                      This owner must be verified before they can be associated with any new businesses.
                      {owner.verificationStatus === "PENDING" ? (
                        " Please complete the verification process."
                      ) : (
                        " Please start the verification process."
                      )}
                    </p>
                    <Button
                      size="sm"
                      color="warning"
                      className="mt-2"
                      onClick={() => handleInitiateAction("verify")}
                    >
                      <CheckCircle size={16} className="mr-1.5" />
                      {owner.verificationStatus === "PENDING" ? "Continue Verification" : "Start Verification"}
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {owner.businesses.length > 0 ? (
                  owner.businesses.map((business) => (
                    <Card key={business.id} className="bg-gray-800 border border-gray-700 shadow-md">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <a 
                              href={`/app/businesses/${business.id}`}
                              className="font-medium text-blue-400 hover:text-blue-300 text-lg"
                            >
                              {business.name}
                            </a>
                            <p className="text-gray-400 text-sm">{business.id}</p>
                          </div>
                          <Badge 
                            color={business.status === "ACTIVE" ? "success" : "gray"} 
                            size="sm"
                          >
                            {business.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-3 mt-3">
                          <div>
                            <p className="text-xs text-gray-400">Type</p>
                            <p className="text-sm">{business.type}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Location</p>
                            <p className="text-sm">{business.location}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Role</p>
                            <p className="text-sm">
                              {business.role}
                              {business.ownershipPercentage && (
                                <span className="ml-1 text-gray-400 text-xs">
                                  ({business.ownershipPercentage}%)
                                </span>
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Active Permits</p>
                            <a 
                              href={`/app/businesses/${business.id}/permits`}
                              className="text-sm text-white hover:text-blue-400"
                            >
                              {business.activePermitCount}
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex justify-between mt-4 pt-3 border-t border-gray-700">
                          <a 
                            href={`/app/businesses/${business.id}`}
                            className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300"
                          >
                            <Eye size={16} className="mr-1" />
                            View Details
                          </a>
                          <button 
                            className="inline-flex items-center text-sm text-red-400 hover:text-red-300"
                            onClick={() => handleInitiateAction(`unlinkBusiness-${business.id}`)}
                          >
                            <XCircle size={16} className="mr-1" />
                            Unlink
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="py-10 flex flex-col items-center text-gray-400">
                    <Buildings size={36} className="mb-2" />
                    <p className="text-lg font-medium mb-1">No businesses associated</p>
                    <p className="text-sm text-gray-500 mb-4 text-center px-6">
                      {owner.verificationStatus !== "VERIFIED" 
                        ? "This owner must be verified before adding businesses."
                        : "Start by adding this owner to a business."
                      }
                    </p>
                    {owner.verificationStatus === "VERIFIED" && (
                      <a
                        href={`/app/businesses/new?ownerId=${owner.id}`}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Plus size={16} className="mr-1.5" />
                        Add Business
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Documents Tab */}
          {activeTab === "documents" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Documents</h3>
                <Button
                  size="sm"
                  color="primary"
                  onClick={() => setShowAddDocumentModal(true)}
                >
                  <Plus size={16} className="mr-1.5" />
                  Upload Document
                </Button>
              </div>
              
              <div className="flex flex-col space-y-3 mb-4">
                <TextInput
                  placeholder="Search documents..."
                  className="bg-gray-700 text-white w-full"
                />
                
                <div className="flex space-x-2">
                  <Dropdown
                    label="All Types"
                    size="sm"
                    dismissOnClick={true}
                    className="bg-gray-700"
                  >
                    <Dropdown.Item>All Types</Dropdown.Item>
                    <Dropdown.Item>ID</Dropdown.Item>
                    <Dropdown.Item>Address Verification</Dropdown.Item>
                    <Dropdown.Item>Business</Dropdown.Item>
                    <Dropdown.Item>Other</Dropdown.Item>
                  </Dropdown>
                  
                  <Dropdown
                    label="All Statuses"
                    size="sm"
                    dismissOnClick={true}
                    className="bg-gray-700"
                  >
                    <Dropdown.Item>All Statuses</Dropdown.Item>
                    <Dropdown.Item>Verified</Dropdown.Item>
                    <Dropdown.Item>Pending</Dropdown.Item>
                    <Dropdown.Item>Rejected</Dropdown.Item>
                  </Dropdown>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                {owner.documents.length > 0 ? (
                  owner.documents.map((document) => {
                    const statusBadge = businessOwnerService.getDocumentStatusBadge(document.status);
                    return (
                      <Card key={document.id} className="bg-gray-800 border border-gray-700">
                        <div className="p-3">
                          <div className="flex items-center space-x-3">
                            <div className="relative bg-gray-700 rounded-md overflow-hidden w-20 h-20 flex-shrink-0">
                              <img 
                                src={document.thumbnailUrl} 
                                alt={document.name}
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => handleViewDocument(document)}
                              />
                            </div>
                            
                            <div className="flex-grow">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{document.name}</h4>
                                  <p className="text-gray-400 text-xs">{document.type}</p>
                                  <p className="text-gray-500 text-xs mt-1">
                                    {businessOwnerService.formatDate(document.uploadDate)}
                                  </p>
                                </div>
                                <Badge 
                                  color={statusBadge.color} 
                                  size="sm"
                                  icon={statusBadge.iconName === "CheckCircle" ? <CheckCircle size={16} weight="fill" /> : 
                                        statusBadge.iconName === "XCircle" ? <XCircle size={16} weight="fill" /> :
                                        statusBadge.iconName === "Clock" ? <Clock size={16} weight="fill" /> : null
                                  }
                                >
                                  {statusBadge.label}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end space-x-3 mt-3 pt-3 border-t border-gray-700">
                            <button 
                              className="text-sm text-gray-400 hover:text-blue-400 flex items-center"
                              onClick={() => handleViewDocument(document)}
                            >
                              <Eye size={16} className="mr-1" />
                              View
                            </button>
                            <button className="text-sm text-gray-400 hover:text-blue-400 flex items-center">
                              <DownloadSimple size={16} className="mr-1" />
                              Download
                            </button>
                            <button className="text-sm text-red-400 hover:text-red-300 flex items-center">
                              <TrashSimple size={16} className="mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                ) : (
                  <div className="py-10 flex flex-col items-center text-gray-400">
                    <FileText size={36} className="mb-2" />
                    <p className="text-lg font-medium mb-1">No documents</p>
                    <p className="text-sm text-gray-500 mb-4 text-center px-6">
                      Upload documents to verify this owner's identity and address.
                    </p>
                    <Button
                      size="sm"
                      color="primary"
                      onClick={() => setShowAddDocumentModal(true)}
                    >
                      <Plus size={16} className="mr-1.5" />
                      Upload Document
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* History Tab */}
          {activeTab === "history" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Activity History</h3>
                
                <div className="flex space-x-2">
                  <Dropdown
                    label="All Actions"
                    size="sm"
                    dismissOnClick={true}
                    className="bg-gray-700"
                  >
                    <Dropdown.Item>All Actions</Dropdown.Item>
                    <Dropdown.Item>Verification</Dropdown.Item>
                    <Dropdown.Item>Document</Dropdown.Item>
                    <Dropdown.Item>Business</Dropdown.Item>
                    <Dropdown.Item>Registration</Dropdown.Item>
                  </Dropdown>
                  
                  <Button
                    size="sm"
                    color="metal"
                  >
                    <DownloadSimple size={16} className="mr-1.5" />
                    Export
                  </Button>
                </div>
              </div>
              
              <Card className="bg-gray-800 border border-gray-700 shadow-md overflow-hidden mb-6">
                <div className="divide-y divide-gray-700">
                  {owner.historyLogs.map((log) => (
                    <div key={log.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          color={
                            log.actionType === "VERIFICATION" ? "success" :
                            log.actionType === "DOCUMENT" ? "info" :
                            log.actionType === "BUSINESS" ? "warning" :
                            "gray"
                          }
                          size="sm"
                        >
                          {log.actionType}
                        </Badge>
                        <div className="text-sm text-gray-400">
                          {businessOwnerService.formatDate(log.timestamp)} at {businessOwnerService.formatTime(log.timestamp)}
                        </div>
                      </div>
                      <p className="text-white text-sm mb-1">{log.description}</p>
                      <p className="text-xs text-gray-500">By {log.user}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
          
          {/* Notes Tab */}
          {activeTab === "notes" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <Card className="bg-gray-800 border border-gray-700 shadow-md">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Add Note</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <textarea 
                          className="w-full rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                          rows={4}
                          placeholder="Enter your note here..."
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                        ></textarea>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Dropdown
                          label={noteCategory}
                          size="sm"
                          dismissOnClick={true}
                          className="bg-gray-700"
                        >
                          <Dropdown.Item onClick={() => setNoteCategory("Admin")}>Admin</Dropdown.Item>
                          <Dropdown.Item onClick={() => setNoteCategory("Verification")}>Verification</Dropdown.Item>
                          <Dropdown.Item onClick={() => setNoteCategory("Inspection")}>Inspection</Dropdown.Item>
                          <Dropdown.Item onClick={() => setNoteCategory("Compliance")}>Compliance</Dropdown.Item>
                        </Dropdown>
                        
                        <Button
                          size="sm"
                          color="primary"
                          onClick={handleAddNote}
                          disabled={!noteText.trim()}
                        >
                          <NotePencil size={16} className="mr-1.5" />
                          Add Note
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Notes</h3>
                  
                  <Dropdown
                    label="All Categories"
                    size="sm"
                    dismissOnClick={true}
                    className="bg-gray-700"
                  >
                    <Dropdown.Item>All Categories</Dropdown.Item>
                    <Dropdown.Item>Admin</Dropdown.Item>
                    <Dropdown.Item>Verification</Dropdown.Item>
                    <Dropdown.Item>Inspection</Dropdown.Item>
                    <Dropdown.Item>Compliance</Dropdown.Item>
                  </Dropdown>
                </div>
                
                <div className="space-y-4">
                  {owner.notes.length > 0 ? (
                    owner.notes.map((note) => (
                      <Card key={note.id} className="bg-gray-800 border border-gray-700 shadow-md">
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center">
                              <div className="mr-3">
                                <Avatar 
                                  shape="circle"
                                  size="sm"
                                  className="bg-blue-600 text-white"
                                >
                                  {note.author.charAt(0)}
                                </Avatar>
                              </div>
                              <div>
                                <p className="font-medium">{note.author}</p>
                                <p className="text-gray-400 text-xs">
                                  {businessOwnerService.formatDate(note.timestamp)} at {businessOwnerService.formatTime(note.timestamp)}
                                </p>
                              </div>
                            </div>
                            <Badge 
                              color={
                                note.category === "Verification" ? "success" :
                                note.category === "Inspection" ? "warning" :
                                note.category === "Compliance" ? "error" :
                                "info"
                              }
                              size="sm"
                            >
                              {note.category}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-200 text-sm whitespace-pre-line">{note.content}</p>
                          
                          <div className="flex justify-end mt-4 pt-2 border-t border-gray-700">
                            <div className="flex space-x-3">
                              <button className="text-sm text-gray-400 hover:text-blue-400 flex items-center">
                                <PencilSimple size={16} className="mr-1" />
                                Edit
                              </button>
                              <button className="text-sm text-red-400 hover:text-red-300 flex items-center">
                                <TrashSimple size={16} className="mr-1" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="py-10 flex flex-col items-center text-gray-400">
                      <NotePencil size={36} className="mb-2" />
                      <p className="text-lg font-medium mb-1">No notes</p>
                      <p className="text-sm text-gray-500 mb-4 text-center">
                        Add a note to track important information about this business owner.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Action Confirmation Modal */}
      <Modal
        size="md"
        show={showActionConfirm}
        onClose={() => setShowActionConfirm(false)}
      >
        <Modal.Header className="bg-gray-800 text-white border-b border-gray-700">
          {confirmContent.title}
        </Modal.Header>
        <Modal.Body className="bg-gray-800 text-white">
          <div className="space-y-6">
            <p>{confirmContent.description}</p>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-gray-800 border-t border-gray-700">
          <Button
            onClick={() => setShowActionConfirm(false)}
            size="sm"
            color="metal"
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmAction}
            size="sm"
            color={confirmContent.buttonColor}
          >
            {confirmContent.buttonText}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Add Document Modal */}
      <Modal
        size="md"
        show={showAddDocumentModal}
        onClose={() => setShowAddDocumentModal(false)}
      >
        <Modal.Header className="bg-gray-800 text-white border-b border-gray-700">
          Upload Document
        </Modal.Header>
        <Modal.Body className="bg-gray-800 text-white">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Document Type
              </label>
              <Dropdown
                label="Select Document Type"
                size="md"
                dismissOnClick={true}
                className="w-full bg-gray-700"
              >
                <Dropdown.Item>Identification (ID, Passport, License)</Dropdown.Item>
                <Dropdown.Item>Proof of Address</Dropdown.Item>
                <Dropdown.Item>Business Registration</Dropdown.Item>
                <Dropdown.Item>Tax Document</Dropdown.Item>
                <Dropdown.Item>Other</Dropdown.Item>
              </Dropdown>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Document Name
              </label>
              <TextInput
                placeholder="Enter document name"
                className="bg-gray-700 text-white w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Upload File
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-600 rounded-md hover:border-gray-500 transition-colors">
                <div className="space-y-1 text-center">
                  <DownloadSimple size={24} className="mx-auto text-gray-400" />
                  <div className="flex text-sm text-gray-400">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input 
                        type="file" 
                        className="sr-only"
                        accept="image/*, application/pdf"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-900/30 border border-blue-800 rounded-md p-3 flex items-start">
              <Info size={20} className="text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-blue-300 text-sm">
                  Documents uploaded here will be used to verify the business owner's identity and address. They will be reviewed by a permit manager before verification is complete.
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-gray-800 border-t border-gray-700">
          <Button
            onClick={() => setShowAddDocumentModal(false)}
            size="sm"
            color="metal"
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            color="primary"
            onClick={() => {
              // Simulate successful upload with basic document data
              handleUploadDocument({
                name: "New Document",
                type: "Other"
              });
            }}
          >
            Upload Document
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Document View Modal */}
      <Modal
        size="lg"
        show={showDocumentViewModal}
        onClose={() => setShowDocumentViewModal(false)}
      >
        {selectedDocument && (
          <>
            <Modal.Header className="bg-gray-800 text-white border-b border-gray-700">
              <div className="flex justify-between items-center w-full">
                <div>
                  <h3 className="text-xl font-semibold">{selectedDocument.name}</h3>
                  <p className="text-sm text-gray-400">
                    {selectedDocument.type} • Uploaded {businessOwnerService.formatDate(selectedDocument.uploadDate)}
                  </p>
                </div>
                <div>
                  {(() => {
                    const statusBadge = businessOwnerService.getDocumentStatusBadge(selectedDocument.status);
                    return (
                      <Badge 
                        color={statusBadge.color} 
                        size="sm"
                        icon={statusBadge.iconName === "CheckCircle" ? <CheckCircle size={16} weight="fill" /> : 
                              statusBadge.iconName === "XCircle" ? <XCircle size={16} weight="fill" /> :
                              statusBadge.iconName === "Clock" ? <Clock size={16} weight="fill" /> : null
                        }
                      >
                        {statusBadge.label}
                      </Badge>
                    );
                  })()}
                </div>
              </div>
            </Modal.Header>
            <Modal.Body className="bg-gray-900 text-white p-0 flex items-center justify-center">
              <div className="relative w-full h-64 bg-gray-900 flex items-center justify-center">
                <img 
                  src={selectedDocument.thumbnailUrl} 
                  alt={selectedDocument.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </Modal.Body>
            <Modal.Footer className="bg-gray-800 border-t border-gray-700">
              <div className="flex justify-between w-full">
                <div className="flex space-x-3">
                  {selectedDocument.status !== "VERIFIED" && (
                    <Button
                      size="sm"
                      color="success"
                      className="mr-2"
                    >
                      <CheckCircle size={16} className="mr-1.5" />
                      Verify
                    </Button>
                  )}
                  {selectedDocument.status !== "REJECTED" && (
                    <Button
                      size="sm"
                      color="error"
                    >
                      <XCircle size={16} className="mr-1.5" />
                      Reject
                    </Button>
                  )}
                </div>
                
                <div>
                  <Button
                    size="sm"
                    color="metal"
                    className="mr-2"
                  >
                    <DownloadSimple size={16} className="mr-1.5" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    color="metal"
                    onClick={() => setShowDocumentViewModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default MobileBusinessOwnerDetail;
