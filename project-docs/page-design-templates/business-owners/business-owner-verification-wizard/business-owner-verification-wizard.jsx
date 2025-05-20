import React, { useState, useEffect, useRef } from "react";
import { 
  Modal, 
  Button, 
  Card, 
  Badge, 
  TextInput, 
  Textarea,
  Checkbox,
  Breadcrumb,
  Avatar,
  Tooltip
} from "keep-react";
import {
  X,
  CheckCircle,
  XCircle,
  Clock,
  CaretRight,
  CaretLeft,
  User,
  MapPin,
  Buildings,
  IdentificationCard,
  FileText,
  DownloadSimple,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  ArrowClockwise,
  WarningCircle,
  ThumbsUp,
  Upload,
  Info,
  CheckSquare,
  Square
} from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";

const BusinessOwnerVerificationWizard = ({ 
  isOpen, 
  onClose, 
  ownerId,
  ownerData,
  onVerificationComplete
}) => {
  // State for current step
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // State for verification status
  const [verificationStatus, setVerificationStatus] = useState({
    identityVerified: false,
    addressVerified: false,
    businessConnectionVerified: false
  });

  // State for notes
  const [notes, setNotes] = useState({
    identity: "",
    address: "",
    business: "",
    general: ""
  });

  // State for document viewer
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentZoom, setDocumentZoom] = useState(100);
  
  // State for checklist items
  const [checklists, setChecklists] = useState({
    identity: [
      { id: 'id1', text: 'Full name matches documentation', checked: false },
      { id: 'id2', text: 'Photo ID is clear and valid', checked: false },
      { id: 'id3', text: 'ID is not expired', checked: false },
      { id: 'id4', text: 'ID information is legible and consistent', checked: false }
    ],
    address: [
      { id: 'addr1', text: 'Address matches documentation', checked: false },
      { id: 'addr2', text: 'Documents are recent (within 90 days)', checked: false },
      { id: 'addr3', text: 'Name on documents matches owner', checked: false },
      { id: 'addr4', text: 'Documentation is complete and legible', checked: false }
    ],
    business: [
      { id: 'biz1', text: 'Owner appears on business registration', checked: false },
      { id: 'biz2', text: 'Ownership percentage is documented', checked: false },
      { id: 'biz3', text: 'Business connection is clearly established', checked: false },
      { id: 'biz4', text: 'Multiple ownership is properly documented', checked: false }
    ]
  });

  // State for final verification decision
  const [finalDecision, setFinalDecision] = useState({
    status: "", // "VERIFIED", "REJECTED", "PENDING"
    rejectionReason: ""
  });

  // Toggle checklist item
  const toggleChecklistItem = (category, itemId) => {
    setChecklists(prev => ({
      ...prev,
      [category]: prev[category].map(item => 
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    }));
  };

  // Check if all checklist items in a category are checked
  const areAllChecked = (category) => {
    return checklists[category].every(item => item.checked);
  };

  // Update verification status
  const updateVerificationStatus = (category, status) => {
    setVerificationStatus(prev => ({
      ...prev,
      [`${category}Verified`]: status
    }));
  };

  // Handle note changes
  const handleNoteChange = (category, value) => {
    setNotes(prev => ({
      ...prev,
      [category]: value
    }));
  };

  // Handle document selection
  const handleSelectDocument = (doc) => {
    setSelectedDocument(doc);
  };

  // Zoom document
  const handleZoom = (action) => {
    if (action === "in") {
      setDocumentZoom(prev => Math.min(prev + 25, 200));
    } else if (action === "out") {
      setDocumentZoom(prev => Math.max(prev - 25, 50));
    } else {
      setDocumentZoom(100);
    }
  };

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Complete verification process
  const completeVerification = () => {
    const allVerified = verificationStatus.identityVerified && 
                         verificationStatus.addressVerified && 
                         verificationStatus.businessConnectionVerified;
    
    const finalStatus = allVerified ? "VERIFIED" : finalDecision.status;
    
    onVerificationComplete({
      ownerId,
      status: finalStatus,
      notes,
      rejectionReason: finalDecision.rejectionReason,
      timestamp: new Date().toISOString()
    });
    
    onClose();
  };

  // Effect to auto-update verification status based on checklist
  useEffect(() => {
    if (areAllChecked('identity') && !verificationStatus.identityVerified) {
      updateVerificationStatus('identity', true);
    } else if (!areAllChecked('identity') && verificationStatus.identityVerified) {
      updateVerificationStatus('identity', false);
    }

    if (areAllChecked('address') && !verificationStatus.addressVerified) {
      updateVerificationStatus('address', true);
    } else if (!areAllChecked('address') && verificationStatus.addressVerified) {
      updateVerificationStatus('address', false);
    }

    if (areAllChecked('business') && !verificationStatus.businessConnectionVerified) {
      updateVerificationStatus('business', true);
    } else if (!areAllChecked('business') && verificationStatus.businessConnectionVerified) {
      updateVerificationStatus('business', false);
    }
  }, [checklists]);

  // Sample documents (would come from ownerData in a real implementation)
  const sampleDocuments = [
    { id: 'doc1', name: "Driver's License", type: "ID", status: "PENDING", thumbnailUrl: "https://via.placeholder.com/100" },
    { id: 'doc2', name: "Utility Bill", type: "Address", status: "PENDING", thumbnailUrl: "https://via.placeholder.com/100" },
    { id: 'doc3', name: "Business Registration", type: "Business", status: "PENDING", thumbnailUrl: "https://via.placeholder.com/100" }
  ];

  // Sample owner data (would be provided via props in a real implementation)
  const owner = ownerData || {
    id: "BO-78945612",
    firstName: "Maria",
    lastName: "Rodriguez",
    email: "maria.rodriguez@example.com",
    phone: "+1 (555) 123-4567",
    addressLine1: "123 Calle Sol",
    addressLine2: "Apt 4B",
    city: "San Juan",
    zipCode: "00901",
    verificationStatus: "PENDING",
    businesses: [
      { id: "BIZ-1001", name: "Sol Cafe", type: "Restaurant" },
      { id: "BIZ-1002", name: "Rodriguez Import/Export", type: "Trade" }
    ]
  };

  // Step content rendering
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return renderIntroStep();
      case 2:
        return renderIdentityStep();
      case 3:
        return renderAddressStep();
      case 4:
        return renderBusinessStep();
      case 5:
        return renderSummaryStep();
      case 6:
        return renderCompletionStep();
      default:
        return null;
    }
  };

  // Render Step 1: Introduction
  const renderIntroStep = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <Avatar 
            shape="circle"
            size="xl"
            className="bg-blue-600 text-white text-2xl"
          >
            {owner.firstName.charAt(0)}{owner.lastName.charAt(0)}
          </Avatar>
        </div>
        <h2 className="text-xl font-bold mb-1">{owner.firstName} {owner.lastName}</h2>
        <p className="text-gray-400 text-sm">{owner.id}</p>
      </div>

      <Card className="bg-gray-800 border border-gray-700">
        <div className="p-4">
          <h3 className="text-lg font-medium mb-3">Verification Process</h3>
          <p className="text-gray-300 mb-4">
            You are about to verify this business owner's identity and information.
            This process includes the following steps:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-600/20 text-blue-400 mr-3">
                <IdentificationCard size={18} />
              </div>
              <div>
                <h4 className="font-medium">Identity Verification</h4>
                <p className="text-sm text-gray-400">Verify personal ID documents and information</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-600/20 text-blue-400 mr-3">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="font-medium">Address Verification</h4>
                <p className="text-sm text-gray-400">Confirm residential address details</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-600/20 text-blue-400 mr-3">
                <Buildings size={18} />
              </div>
              <div>
                <h4 className="font-medium">Business Connection</h4>
                <p className="text-sm text-gray-400">Validate relationship to associated businesses</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-600/20 text-blue-400 mr-3">
                <CheckCircle size={18} />
              </div>
              <div>
                <h4 className="font-medium">Final Verification</h4>
                <p className="text-sm text-gray-400">Review and complete the verification process</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="bg-blue-900/30 border border-blue-800 rounded-md p-4">
        <div className="flex items-start">
          <Info size={20} className="text-blue-400 mt-0.5 mr-3" />
          <div>
            <p className="text-blue-300 text-sm">
              This verification is required before the owner can be associated with 
              any businesses or apply for permits. Please review all documents carefully 
              and ensure all information is consistent and valid.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Render Step 2: Identity Verification
  const renderIdentityStep = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Viewer */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Identity Documents</h3>
          
          <div className="grid grid-cols-1 gap-3">
            {sampleDocuments
              .filter(doc => doc.type === "ID")
              .map(doc => (
                <Card 
                  key={doc.id}
                  className={`bg-gray-750 border ${selectedDocument?.id === doc.id ? 'border-blue-500' : 'border-gray-700'} cursor-pointer`}
                  onClick={() => handleSelectDocument(doc)}
                >
                  <div className="p-3 flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-700 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                      <img src={doc.thumbnailUrl} alt={doc.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-sm">{doc.name}</h4>
                      <p className="text-gray-400 text-xs">{doc.type}</p>
                    </div>
                    <Badge 
                      color="warning" 
                      size="sm"
                      icon={<Clock size={14} weight="fill" />}
                    >
                      {doc.status}
                    </Badge>
                  </div>
                </Card>
              ))}
              
            <Button
              size="sm" 
              color="metal"
              className="mt-2 w-full"
            >
              <Upload size={16} className="mr-1.5" />
              Upload New ID Document
            </Button>
          </div>

          {selectedDocument && (
            <Card className="bg-gray-800 border border-gray-700">
              <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{selectedDocument.name}</h4>
                  <p className="text-xs text-gray-400">{selectedDocument.type}</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="xs" circle={true} color="metal" onClick={() => handleZoom("out")}>
                    <MagnifyingGlassMinus size={16} />
                  </Button>
                  <Button size="xs" circle={true} color="metal" onClick={() => handleZoom("reset")}>
                    <ArrowClockwise size={16} />
                  </Button>
                  <Button size="xs" circle={true} color="metal" onClick={() => handleZoom("in")}>
                    <MagnifyingGlassPlus size={16} />
                  </Button>
                </div>
              </div>
              <div className="p-4 h-64 flex items-center justify-center bg-gray-900">
                <img 
                  src={selectedDocument.thumbnailUrl} 
                  alt={selectedDocument.name}
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    transform: `scale(${documentZoom/100})`,
                    transition: 'transform 0.2s'
                  }}
                  className="object-contain"
                />
              </div>
              <div className="p-3 border-t border-gray-700 flex justify-end">
                <Button size="xs" color="metal">
                  <DownloadSimple size={16} className="mr-1.5" />
                  Download
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Verification Checklist */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Identity Verification</h3>
          
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-4">
              <h4 className="font-medium mb-3">Personal Information</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-xs">Full Name</p>
                  <p>{owner.firstName} {owner.lastName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">ID/License Number</p>
                  <p>PR23456789</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Date of Birth</p>
                  <p>June 15, 1985</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-4">
              <h4 className="font-medium mb-3">Verification Checklist</h4>
              <div className="space-y-3">
                {checklists.identity.map(item => (
                  <div key={item.id} className="flex items-center">
                    <button
                      className="mr-2 text-gray-400 hover:text-blue-400 focus:outline-none"
                      onClick={() => toggleChecklistItem('identity', item.id)}
                    >
                      {item.checked ? 
                        <CheckSquare size={20} weight="fill" className="text-blue-500" /> : 
                        <Square size={20} />
                      }
                    </button>
                    <span className={item.checked ? 'text-blue-400' : 'text-gray-300'}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-4">
              <h4 className="font-medium mb-2">Verification Notes</h4>
              <Textarea
                value={notes.identity}
                onChange={(e) => handleNoteChange('identity', e.target.value)}
                placeholder="Add notes about the identity verification..."
                className="bg-gray-700 border-gray-600 text-white w-full"
                rows={4}
              />
            </div>
          </Card>
          
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Identity Verification Status</h4>
                <Badge 
                  color={verificationStatus.identityVerified ? "success" : "warning"} 
                  size="sm"
                  icon={verificationStatus.identityVerified ? 
                    <CheckCircle size={14} weight="fill" /> : 
                    <Clock size={14} weight="fill" />
                  }
                >
                  {verificationStatus.identityVerified ? "VERIFIED" : "PENDING"}
                </Badge>
              </div>
              <div className="mt-3 flex space-x-2">
                <Button
                  size="sm"
                  color={verificationStatus.identityVerified ? "gray" : "success"}
                  onClick={() => updateVerificationStatus('identity', true)}
                  className={verificationStatus.identityVerified ? "opacity-50" : ""}
                  disabled={verificationStatus.identityVerified}
                >
                  <CheckCircle size={16} weight="bold" className="mr-1.5" />
                  Verify Identity
                </Button>
                <Button
                  size="sm"
                  color={!verificationStatus.identityVerified ? "gray" : "error"}
                  onClick={() => updateVerificationStatus('identity', false)}
                  className={!verificationStatus.identityVerified ? "opacity-50" : ""}
                  disabled={!verificationStatus.identityVerified}
                >
                  <XCircle size={16} weight="bold" className="mr-1.5" />
                  Mark Unverified
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );

  // Render Step 3: Address Verification
  const renderAddressStep = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Viewer */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Address Documents</h3>
          
          <div className="grid grid-cols-1 gap-3">
            {sampleDocuments
              .filter(doc => doc.type === "Address")
              .map(doc => (
                <Card 
                  key={doc.id}
                  className={`bg-gray-750 border ${selectedDocument?.id === doc.id ? 'border-blue-500' : 'border-gray-700'} cursor-pointer`}
                  onClick={() => handleSelectDocument(doc)}
                >
                  <div className="p-3 flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-700 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                      <img src={doc.thumbnailUrl} alt={doc.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-sm">{doc.name}</h4>
                      <p className="text-gray-400 text-xs">{doc.type}</p>
                    </div>
                    <Badge 
                      color="warning" 
                      size="sm"
                      icon={<Clock size={14} weight="fill" />}
                    >
                      {doc.status}
                    </Badge>
                  </div>
                </Card>
              ))}
              
            <Button
              size="sm" 
              color="metal"
              className="mt-2 w-full"
            >
              <Upload size={16} className="mr-1.5" />
              Upload New Address Document
            </Button>
          </div>

          {selectedDocument && (
            <Card className="bg-gray-800 border border-gray-700">
              <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{selectedDocument.name}</h4>
                  <p className="text-xs text-gray-400">{selectedDocument.type}</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="xs" circle={true} color="metal" onClick={() => handleZoom("out")}>
                    <MagnifyingGlassMinus size={16} />
                  </Button>
                  <Button size="xs" circle={true} color="metal" onClick={() => handleZoom("reset")}>
                    <ArrowClockwise size={16} />
                  </Button>
                  <Button size="xs" circle={true} color="metal" onClick={() => handleZoom("in")}>
                    <MagnifyingGlassPlus size={16} />
                  </Button>
                </div>
              </div>
              <div className="p-4 h-64 flex items-center justify-center bg-gray-900">
                <img 
                  src={selectedDocument.thumbnailUrl} 
                  alt={selectedDocument.name}
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    transform: `scale(${documentZoom/100})`,
                    transition: 'transform 0.2s'
                  }}
                  className="object-contain"
                />
              </div>
              <div className="p-3 border-t border-gray-700 flex justify-end">
                <Button size="xs" color="metal">
                  <DownloadSimple size={16} className="mr-1.5" />
                  Download
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Verification Checklist */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Address Verification</h3>
          
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-4">
              <h4 className="font-medium mb-3">Address Information</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-xs">Street Address</p>
                  <p>{owner.addressLine1}</p>
                </div>
                {owner.addressLine2 && (
                  <div>
                    <p className="text-gray-400 text-xs">Address Line 2</p>
                    <p>{owner.addressLine2}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-400 text-xs">City & Zip Code</p>
                  <p>{owner.city}, {owner.zipCode}</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-4">
              <h4 className="font-medium mb-3">Verification Checklist</h4>
              <div className="space-y-3">
                {checklists.address.map(item => (
                  <div key={item.id} className="flex items-center">
                    <button
                      className="mr-2 text-gray-400 hover:text-blue-400 focus:outline-none"
                      onClick={() => toggleChecklistItem('address', item.id)}
                    >
                      {item.checked ? 
                        <CheckSquare size={20} weight="fill" className="text-blue-500" /> : 
                        <Square size={20} />
                      }
                    </button>
                    <span className={item.checked ? 'text-blue-400' : 'text-gray-300'}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-4">
              <h4 className="font-medium mb-2">Verification Notes</h4>
              <Textarea
                value={notes.address}
                onChange={(e) => handleNoteChange('address', e.target.value)}
                placeholder="Add notes about the address verification..."
                className="bg-gray-700 border-gray-600 text-white w-full"
                rows={4}
              />
            </div>
          </Card>
          
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Address Verification Status</h4>
                <Badge 
                  color={verificationStatus.addressVerified ? "success" : "warning"} 
                  size="sm"
                  icon={verificationStatus.addressVerified ? 
                    <CheckCircle size={14} weight="fill" /> : 
                    <Clock size={14} weight="fill" />
                  }
                >
                  {verificationStatus.addressVerified ? "VERIFIED" : "PENDING"}
                </Badge>
              </div>
              <div className="mt-3 flex space-x-2">
                <Button
                  size="sm"
                  color={verificationStatus.addressVerified ? "gray" : "success"}
                  onClick={() => updateVerificationStatus('address', true)}
                  className={verificationStatus.addressVerified ? "opacity-50" : ""}
                  disabled={verificationStatus.addressVerified}
                >
                  <CheckCircle size={16} weight="bold" className="mr-1.5" />
                  Verify Address
                </Button>
                <Button
                  size="sm"
                  color={!verificationStatus.addressVerified ? "gray" : "error"}
                  onClick={() => updateVerificationStatus('address', false)}
                  className={!verificationStatus.addressVerified ? "opacity-50" : ""}
                  disabled={!verificationStatus.addressVerified}
                >
                  <XCircle size={16} weight="bold" className="mr-1.5" />
                  Mark Unverified
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );

  // Render Step 4: Business Connection
  const renderBusinessStep = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Viewer */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Business Documents</h3>
          
          <div className="grid grid-cols-1 gap-3">
            {sampleDocuments
              .filter(doc => doc.type === "Business")
              .map(doc => (
                <Card 
                  key={doc.id}
                  className={`bg-gray-750 border ${selectedDocument?.id === doc.id ? 'border-blue-500' : 'border-gray-700'} cursor-pointer`}
                  onClick={() => handleSelectDocument(doc)}
                >
                  <div className="p-3 flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-700 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                      <img src={doc.thumbnailUrl} alt={doc.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-sm">{doc.name}</h4>
                      <p className="text-gray-400 text-xs">{doc.type}</p>
                    </div>
                    <Badge 
                      color="warning" 
                      size="sm"
                      icon={<Clock size={14} weight="fill" />}
                    >
                      {doc.status}
                    </Badge>
                  </div>
                </Card>
              ))}
              
            <Button
              size="sm" 
              color="metal"
              className="mt-2 w-full"
            >
              <Upload size={16} className="mr-1.5" />
              Upload New Business Document
            </Button>
          </div>

          {selectedDocument && (
            <Card className="bg-gray-800 border border-gray-700">
              <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{selectedDocument.name}</h4>
                  <p className="text-xs text-gray-400">{selectedDocument.type}</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="xs" circle={true} color="metal" onClick={() => handleZoom("out")}>
                    <MagnifyingGlassMinus size={16} />
                  </Button>
                  <Button size="xs" circle={true} color="metal" onClick={() => handleZoom("reset")}>
                    <ArrowClockwise size={16} />
                  </Button>
                  <Button size="xs" circle={true} color="metal" onClick={() => handleZoom("in")}>
                    <MagnifyingGlassPlus size={16} />
                  </Button>
                </div>
              </div>
              <div className="p-4 h-64 flex items-center justify-center bg-gray-900">
                <img 
                  src={selectedDocument.thumbnailUrl} 
                  alt={selectedDocument.name}
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    transform: `scale(${documentZoom/100})`,
                    transition: 'transform 0.2s'
                  }}
                  className="object-contain"
                />
              </div>
              <div className="p-3 border-t border-gray-700 flex justify-end">
                <Button size="xs" color="metal">
                  <DownloadSimple size={16} className="mr-1.5" />
                  Download
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Verification Checklist */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Business Connection Verification</h3>
          
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-4">
              <h4 className="font-medium mb-3">Associated Businesses</h4>
              <div className="space-y-3">
                {owner.businesses.map(business => (
                  <div key={business.id} className="p-3 bg-gray-750 rounded-md border border-gray-700">
                    <h5 className="font-medium">{business.name}</h5>
                    <p className="text-sm text-gray-400">{business.type}</p>
                    <p className="text-xs text-gray-500 mt-1">{business.id}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-4">
              <h4 className="font-medium mb-3">Verification Checklist</h4>
              <div className="space-y-3">
                {checklists.business.map(item => (
                  <div key={item.id} className="flex items-center">
                    <button
                      className="mr-2 text-gray-400 hover:text-blue-400 focus:outline-none"
                      onClick={() => toggleChecklistItem('business', item.id)}
                    >
                      {item.checked ? 
                        <CheckSquare size={20} weight="fill" className="text-blue-500" /> : 
                        <Square size={20} />
                      }
                    </button>
                    <span className={item.checked ? 'text-blue-400' : 'text-gray-300'}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-4">
              <h4 className="font-medium mb-2">Verification Notes</h4>
              <Textarea
                value={notes.business}
                onChange={(e) => handleNoteChange('business', e.target.value)}
                placeholder="Add notes about the business connection verification..."
                className="bg-gray-700 border-gray-600 text-white w-full"
                rows={4}
              />
            </div>
          </Card>
          
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Business Connection Status</h4>
                <Badge 
                  color={verificationStatus.businessConnectionVerified ? "success" : "warning"} 
                  size="sm"
                  icon={verificationStatus.businessConnectionVerified ? 
                    <CheckCircle size={14} weight="fill" /> : 
                    <Clock size={14} weight="fill" />
                  }
                >
                  {verificationStatus.businessConnectionVerified ? "VERIFIED" : "PENDING"}
                </Badge>
              </div>
              <div className="mt-3 flex space-x-2">
                <Button
                  size="sm"
                  color={verificationStatus.businessConnectionVerified ? "gray" : "success"}
                  onClick={() => updateVerificationStatus('businessConnection', true)}
                  className={verificationStatus.businessConnectionVerified ? "opacity-50" : ""}
                  disabled={verificationStatus.businessConnectionVerified}
                >
                  <CheckCircle size={16} weight="bold" className="mr-1.5" />
                  Verify Connection
                </Button>
                <Button
                  size="sm"
                  color={!verificationStatus.businessConnectionVerified ? "gray" : "error"}
                  onClick={() => updateVerificationStatus('businessConnection', false)}
                  className={!verificationStatus.businessConnectionVerified ? "opacity-50" : ""}
                  disabled={!verificationStatus.businessConnectionVerified}
                >
                  <XCircle size={16} weight="bold" className="mr-1.5" />
                  Mark Unverified
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );

  // Render Step 5: Verification Summary
  const renderSummaryStep = () => {
    const allVerified = verificationStatus.identityVerified && 
                         verificationStatus.addressVerified && 
                         verificationStatus.businessConnectionVerified;
                         
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        <Card className="bg-gray-800 border border-gray-700">
          <div className="p-5">
            <h3 className="text-lg font-semibold mb-4">Verification Summary</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-750 rounded-md">
                <div className="flex items-center">
                  <IdentificationCard size={20} className="text-gray-400 mr-3" />
                  <span>Identity Verification</span>
                </div>
                <Badge 
                  color={verificationStatus.identityVerified ? "success" : "warning"} 
                  size="sm"
                  icon={verificationStatus.identityVerified ? 
                    <CheckCircle size={14} weight="fill" /> : 
                    <Clock size={14} weight="fill" />
                  }
                >
                  {verificationStatus.identityVerified ? "VERIFIED" : "PENDING"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-750 rounded-md">
                <div className="flex items-center">
                  <MapPin size={20} className="text-gray-400 mr-3" />
                  <span>Address Verification</span>
                </div>
                <Badge 
                  color={verificationStatus.addressVerified ? "success" : "warning"} 
                  size="sm"
                  icon={verificationStatus.addressVerified ? 
                    <CheckCircle size={14} weight="fill" /> : 
                    <Clock size={14} weight="fill" />
                  }
                >
                  {verificationStatus.addressVerified ? "VERIFIED" : "PENDING"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-750 rounded-md">
                <div className="flex items-center">
                  <Buildings size={20} className="text-gray-400 mr-3" />
                  <span>Business Connection</span>
                </div>
                <Badge 
                  color={verificationStatus.businessConnectionVerified ? "success" : "warning"} 
                  size="sm"
                  icon={verificationStatus.businessConnectionVerified ? 
                    <CheckCircle size={14} weight="fill" /> : 
                    <Clock size={14} weight="fill" />
                  }
                >
                  {verificationStatus.businessConnectionVerified ? "VERIFIED" : "PENDING"}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gray-800 border border-gray-700">
          <div className="p-5">
            <h3 className="text-lg font-semibold mb-4">Verification Decision</h3>
            
            <div className="space-y-4">
              {allVerified ? (
                <div className="bg-green-900/30 p-4 border border-green-700 rounded-md">
                  <div className="flex items-start">
                    <CheckCircle size={24} className="text-green-500 mr-3" />
                    <div>
                      <h4 className="font-medium text-green-400">All Verification Steps Complete</h4>
                      <p className="text-green-300 text-sm mt-1">
                        All required verification steps have been completed successfully. 
                        You can now approve this business owner.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-900/30 p-4 border border-yellow-700 rounded-md">
                  <div className="flex items-start">
                    <WarningCircle size={24} className="text-yellow-500 mr-3" />
                    <div>
                      <h4 className="font-medium text-yellow-400">Incomplete Verification</h4>
                      <p className="text-yellow-300 text-sm mt-1">
                        Some verification steps are still pending. You can 
                        request additional information, or reject the verification.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="pt-4">
                <div className="space-x-3">
                  <Button
                    size="sm"
                    color="success"
                    onClick={() => setFinalDecision({ 
                      status: "VERIFIED", 
                      rejectionReason: "" 
                    })}
                    className={finalDecision.status === "VERIFIED" ? "ring-2 ring-green-500" : ""}
                  >
                    <CheckCircle size={16} weight="bold" className="mr-1.5" />
                    Approve Owner
                  </Button>
                  
                  <Button
                    size="sm"
                    color="warning"
                    onClick={() => setFinalDecision({ 
                      status: "PENDING", 
                      rejectionReason: "" 
                    })}
                    className={finalDecision.status === "PENDING" ? "ring-2 ring-yellow-500" : ""}
                  >
                    <Clock size={16} weight="bold" className="mr-1.5" />
                    Request More Info
                  </Button>
                  
                  <Button
                    size="sm"
                    color="error"
                    onClick={() => setFinalDecision({ 
                      status: "REJECTED", 
                      rejectionReason: "" 
                    })}
                    className={finalDecision.status === "REJECTED" ? "ring-2 ring-red-500" : ""}
                  >
                    <XCircle size={16} weight="bold" className="mr-1.5" />
                    Reject Verification
                  </Button>
                </div>
              </div>
              
              {finalDecision.status === "REJECTED" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <h4 className="font-medium mb-2">Rejection Reason</h4>
                  <Textarea
                    value={finalDecision.rejectionReason}
                    onChange={(e) => setFinalDecision(prev => ({ 
                      ...prev, 
                      rejectionReason: e.target.value 
                    }))}
                    placeholder="Please provide a reason for rejection..."
                    className="bg-gray-700 border-gray-600 text-white w-full"
                    rows={4}
                    required
                  />
                </motion.div>
              )}
              
              {finalDecision.status === "PENDING" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <h4 className="font-medium mb-2">Additional Information Needed</h4>
                  <Textarea
                    value={finalDecision.rejectionReason}
                    onChange={(e) => setFinalDecision(prev => ({ 
                      ...prev, 
                      rejectionReason: e.target.value 
                    }))}
                    placeholder="Please specify what additional information is needed..."
                    className="bg-gray-700 border-gray-600 text-white w-full"
                    rows={4}
                    required
                  />
                </motion.div>
              )}
            </div>
          </div>
        </Card>
        
        <Card className="bg-gray-800 border border-gray-700">
          <div className="p-5">
            <h3 className="text-lg font-semibold mb-3">Final Notes</h3>
            <Textarea
              value={notes.general}
              onChange={(e) => handleNoteChange('general', e.target.value)}
              placeholder="Add any final notes about this verification process..."
              className="bg-gray-700 border-gray-600 text-white w-full"
              rows={4}
            />
          </div>
        </Card>
      </motion.div>
    );
  };

  // Render Step 6: Completion
  const renderCompletionStep = () => {
    const allVerified = verificationStatus.identityVerified && 
                         verificationStatus.addressVerified && 
                         verificationStatus.businessConnectionVerified;
    
    const isFinalDecisionMade = finalDecision.status !== "";
    const finalStatus = isFinalDecisionMade ? finalDecision.status : (allVerified ? "VERIFIED" : "PENDING");
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        <div className="text-center py-6">
          {finalStatus === "VERIFIED" && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/30 text-green-500 mb-4">
                <CheckCircle size={36} weight="fill" />
              </div>
              <h2 className="text-2xl font-bold text-green-400 mb-2">Verification Approved</h2>
              <p className="text-gray-300 mb-6">
                This business owner has been successfully verified and is now 
                eligible to be associated with businesses and apply for permits.
              </p>
            </>
          )}
          
          {finalStatus === "REJECTED" && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/30 text-red-500 mb-4">
                <XCircle size={36} weight="fill" />
              </div>
              <h2 className="text-2xl font-bold text-red-400 mb-2">Verification Rejected</h2>
              <p className="text-gray-300 mb-6">
                This business owner's verification has been rejected. They will need to 
                provide corrected or additional information before reapplying.
              </p>
            </>
          )}
          
          {finalStatus === "PENDING" && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-900/30 text-yellow-500 mb-4">
                <Clock size={36} weight="fill" />
              </div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-2">Additional Information Requested</h2>
              <p className="text-gray-300 mb-6">
                Additional information has been requested from this business owner. 
                Verification will remain in pending status until this is provided.
              </p>
            </>
          )}
          
          <div className="flex flex-col space-y-3 items-center">
            <Button
              size="lg"
              color="primary"
              onClick={completeVerification}
            >
              <ThumbsUp size={20} weight="bold" className="mr-2" />
              Complete Verification Process
            </Button>
            
            <Button
              size="md"
              color="metal"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <Modal
      size="5xl"
      show={isOpen}
      onClose={onClose}
    >
      <Modal.Header className="bg-gray-800 text-white border-b border-gray-700">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-0.5">Business Owner Verification</h2>
            <Breadcrumb>
              <Breadcrumb.Item 
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  setCurrentStep(1);
                }}
                className={currentStep >= 1 ? "text-blue-400" : "text-gray-400"}
              >
                Introduction
              </Breadcrumb.Item>
              <Breadcrumb.Item
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  if (currentStep >= 2) setCurrentStep(2);
                }}
                className={currentStep >= 2 ? "text-blue-400" : "text-gray-400"}
              >
                Identity
              </Breadcrumb.Item>
              <Breadcrumb.Item
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  if (currentStep >= 3) setCurrentStep(3);
                }}
                className={currentStep >= 3 ? "text-blue-400" : "text-gray-400"}
              >
                Address
              </Breadcrumb.Item>
              <Breadcrumb.Item
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  if (currentStep >= 4) setCurrentStep(4);
                }}
                className={currentStep >= 4 ? "text-blue-400" : "text-gray-400"}
              >
                Business
              </Breadcrumb.Item>
              <Breadcrumb.Item
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  if (currentStep >= 5) setCurrentStep(5);
                }}
                className={currentStep >= 5 ? "text-blue-400" : "text-gray-400"}
              >
                Summary
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="flex items-center space-x-2">
            {/* Progress indicators */}
            <div className="hidden sm:flex items-center space-x-1.5 mr-4">
              {[...Array(totalSteps)].map((_, index) => (
                <div 
                  key={index} 
                  className={`w-2.5 h-2.5 rounded-full ${
                    currentStep > index 
                      ? 'bg-blue-500' 
                      : currentStep === index + 1 
                        ? 'bg-blue-600 ring-2 ring-blue-400/30' 
                        : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <Button
              size="sm"
              variant="circular"
              color="gray"
              onClick={onClose}
            >
              <X size={20} weight="bold" />
            </Button>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="bg-gray-800 text-white p-6 max-h-[70vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </Modal.Body>
      <Modal.Footer className="bg-gray-800 border-t border-gray-700">
        <div className="flex justify-between w-full">
          <Button
            size="md"
            color="metal"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={currentStep === 1 ? "opacity-50" : ""}
          >
            <CaretLeft size={16} weight="bold" className="mr-1.5" />
            Previous
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              size="md"
              color="primary"
              onClick={nextStep}
            >
              Next
              <CaretRight size={16} weight="bold" className="ml-1.5" />
            </Button>
          ) : (
            <Button
              size="md"
              color="primary"
              onClick={completeVerification}
            >
              Complete Verification
              <CheckCircle size={16} weight="bold" className="ml-1.5" />
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default BusinessOwnerVerificationWizard;