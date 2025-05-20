// /lib/services/businessOwnerService.js
import { mockBusinessOwner } from "../mocks/mockData";

// Service functions for business owner data management
export const getBusinessOwnerById = async (id) => {
  // In a real implementation, this would be an API call
  // const response = await fetch(`/api/business-owners/${id}`);
  // const data = await response.json();
  // return data;
  
  // Using mock data for demo
  return mockBusinessOwner;
};

export const updateBusinessOwner = async (id, data) => {
  // In a real implementation, this would be an API call
  // const response = await fetch(`/api/business-owners/${id}`, {
  //   method: 'PATCH',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(data),
  // });
  // const updatedOwner = await response.json();
  // return updatedOwner;
  
  // Mock implementation
  console.log(`Updating owner ${id} with data:`, data);
  return { ...mockBusinessOwner, ...data };
};

export const changeBusinessOwnerStatus = async (id, status) => {
  // In a real implementation, this would be an API call
  // const response = await fetch(`/api/business-owners/${id}/status`, {
  //   method: 'PATCH',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ status }),
  // });
  // const updatedOwner = await response.json();
  // return updatedOwner;
  
  // Mock implementation
  console.log(`Changing status of owner ${id} to ${status}`);
  return { ...mockBusinessOwner, status };
};

export const changeVerificationStatus = async (id, verificationStatus) => {
  // In a real implementation, this would be an API call
  // const response = await fetch(`/api/business-owners/${id}/verification`, {
  //   method: 'PATCH',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ verificationStatus }),
  // });
  // const updatedOwner = await response.json();
  // return updatedOwner;
  
  // Mock implementation
  console.log(`Changing verification status of owner ${id} to ${verificationStatus}`);
  return { ...mockBusinessOwner, verificationStatus };
};

export const deleteBusinessOwner = async (id) => {
  // In a real implementation, this would be an API call
  // const response = await fetch(`/api/business-owners/${id}`, {
  //   method: 'DELETE',
  // });
  // return response.ok;
  
  // Mock implementation
  console.log(`Deleting owner ${id}`);
  return true;
};

export const addBusinessOwnerNote = async (id, note) => {
  // In a real implementation, this would be an API call
  // const response = await fetch(`/api/business-owners/${id}/notes`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(note),
  // });
  // const updatedOwner = await response.json();
  // return updatedOwner;
  
  // Mock implementation
  console.log(`Adding note to owner ${id}:`, note);
  const newNote = {
    id: `NOTE-${mockBusinessOwner.notes.length + 1}`,
    ...note,
    timestamp: new Date().toISOString(),
  };
  return {
    ...mockBusinessOwner,
    notes: [newNote, ...mockBusinessOwner.notes],
  };
};

export const uploadBusinessOwnerDocument = async (id, document) => {
  // In a real implementation, this would involve file upload to storage
  // and then an API call to associate the document with the owner
  // const formData = new FormData();
  // formData.append('file', document.file);
  // formData.append('type', document.type);
  // formData.append('name', document.name);
  
  // const response = await fetch(`/api/business-owners/${id}/documents`, {
  //   method: 'POST',
  //   body: formData,
  // });
  // const updatedOwner = await response.json();
  // return updatedOwner;
  
  // Mock implementation
  console.log(`Uploading document for owner ${id}:`, document);
  const newDocument = {
    id: `DOC-${mockBusinessOwner.documents.length + 1}`,
    name: document.name,
    type: document.type,
    uploadDate: new Date().toISOString(),
    status: "PENDING",
    thumbnailUrl: "https://via.placeholder.com/100",
  };
  return {
    ...mockBusinessOwner,
    documents: [newDocument, ...mockBusinessOwner.documents],
  };
};

// Utility functions for UI
export const getVerificationStatusDetails = (status) => {
  switch (status) {
    case "VERIFIED":
      return { color: "success", iconName: "CheckCircle" };
    case "REJECTED":
      return { color: "error", iconName: "XCircle" };
    case "PENDING":
      return { color: "warning", iconName: "Clock" };
    default:
      return { color: "gray", iconName: "Clock" };
  }
};

export const getStatusDetails = (status) => {
  return status === "ACTIVE" 
    ? { color: "success", label: "Active" } 
    : { color: "gray", label: "Inactive" };
};

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatTime = (dateString) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleTimeString(undefined, options);
};

export const getInitials = (firstName, lastName) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
};

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  // In a real implementation, you would show a toast notification
  console.log(`Copied to clipboard: ${text}`);
};

export const getDocumentStatusBadge = (status) => {
  // Returns information for badges - actual JSX is implemented in the components
  switch (status) {
    case "VERIFIED":
      return { color: "success", iconName: "CheckCircle", label: "Verified" };
    case "REJECTED":
      return { color: "error", iconName: "XCircle", label: "Rejected" };
    case "PENDING":
      return { color: "warning", iconName: "Clock", label: "Pending" };
    default:
      return { color: "gray", iconName: null, label: "Unknown" };
  }
};

// Mock data - in a real implementation, this would come from the API
export const mockBusinessOwner = {
  id: "BO-78945612",
  userId: "U-12345",
  firstName: "Maria",
  lastName: "Rodriguez",
  email: "maria.rodriguez@example.com",
  phone: "+1 (555) 123-4567",
  dateOfBirth: "1985-06-15",
  taxId: "***-**-6789",
  idLicenseNumber: "PR23456789",
  addressLine1: "123 Calle Sol",
  addressLine2: "Apt 4B",
  city: "San Juan",
  zipCode: "00901",
  status: "ACTIVE",
  verificationStatus: "VERIFIED",
  registrationDate: "2023-10-12T10:30:00Z",
  assignedManagerId: "PM-1",
  assignedManagerName: "Alex Johnson",
  createdAt: "2023-10-12T10:30:00Z",
  updatedAt: "2023-11-05T14:20:00Z",
  businesses: [
    {
      id: "BIZ-1001",
      name: "Sol Cafe",
      type: "Restaurant",
      location: "San Juan",
      status: "ACTIVE",
      activePermitCount: 3,
      role: "Owner",
      ownershipPercentage: 100
    },
    {
      id: "BIZ-1002",
      name: "Rodriguez Import/Export",
      type: "Trade",
      location: "San Juan",
      status: "ACTIVE",
      activePermitCount: 2,
      role: "Partner",
      ownershipPercentage: 50
    }
  ],
  documents: [
    {
      id: "DOC-1",
      name: "Driver's License",
      type: "ID",
      uploadDate: "2023-10-12T11:45:00Z",
      status: "VERIFIED",
      thumbnailUrl: "https://via.placeholder.com/100"
    },
    {
      id: "DOC-2",
      name: "Proof of Address",
      type: "Address Verification",
      uploadDate: "2023-10-12T12:30:00Z",
      status: "VERIFIED",
      thumbnailUrl: "https://via.placeholder.com/100"
    },
    {
      id: "DOC-3",
      name: "Business Agreement",
      type: "Business",
      uploadDate: "2023-10-15T09:15:00Z",
      status: "PENDING",
      thumbnailUrl: "https://via.placeholder.com/100"
    }
  ],
  historyLogs: [
    {
      id: "LOG-1",
      timestamp: "2023-11-05T14:20:00Z",
      actionType: "VERIFICATION",
      description: "Owner verification status changed to VERIFIED",
      user: "Alex Johnson"
    },
    {
      id: "LOG-2",
      timestamp: "2023-10-30T10:10:00Z",
      actionType: "DOCUMENT",
      description: "New document uploaded: Business Agreement",
      user: "Maria Rodriguez"
    },
    {
      id: "LOG-3",
      timestamp: "2023-10-15T09:20:00Z",
      actionType: "BUSINESS",
      description: "Associated with business: Rodriguez Import/Export",
      user: "Alex Johnson"
    },
    {
      id: "LOG-4",
      timestamp: "2023-10-12T12:35:00Z",
      actionType: "DOCUMENT",
      description: "Document verified: Proof of Address",
      user: "Alex Johnson"
    },
    {
      id: "LOG-5",
      timestamp: "2023-10-12T11:50:00Z",
      actionType: "DOCUMENT",
      description: "Document verified: Driver's License",
      user: "Alex Johnson"
    },
    {
      id: "LOG-6",
      timestamp: "2023-10-12T10:30:00Z",
      actionType: "REGISTRATION",
      description: "Business Owner account created",
      user: "System"
    }
  ],
  notes: [
    {
      id: "NOTE-1",
      content: "Met with Maria to discuss permit requirements for Sol Cafe expansion.",
      author: "Alex Johnson",
      timestamp: "2023-11-02T13:45:00Z",
      category: "Admin"
    },
    {
      id: "NOTE-2",
      content: "Verified all required documentation for business ownership.",
      author: "Alex Johnson",
      timestamp: "2023-10-30T11:20:00Z",
      category: "Verification"
    }
  ]
};
