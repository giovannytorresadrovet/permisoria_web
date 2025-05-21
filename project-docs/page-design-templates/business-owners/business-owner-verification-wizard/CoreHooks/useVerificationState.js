// src/components/features/business-owners/verification/hooks/useVerificationState.js
import { useState, useEffect } from 'react';

export default function useVerificationState(ownerId, initialData = null) {
  // Core state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentZoom, setDocumentZoom] = useState(100);
  
  // Verification statuses
  const [verificationStatus, setVerificationStatus] = useState({
    identityVerified: false,
    addressVerified: false,
    businessConnectionVerified: false
  });
  
  // Section notes
  const [notes, setNotes] = useState({
    identity: '',
    address: '',
    business: '',
    general: ''
  });
  
  // Checklists with N/A support
  const [checklists, setChecklists] = useState({
    identity: [
      { id: 'id1', text: 'Full name matches documentation', checked: false, na: false, naReason: '' },
      { id: 'id2', text: 'Photo ID is clear and valid', checked: false, na: false, naReason: '' },
      { id: 'id3', text: 'ID is not expired', checked: false, na: false, naReason: '' },
      { id: 'id4', text: 'ID information is legible and consistent', checked: false, na: false, naReason: '' }
    ],
    address: [
      { id: 'addr1', text: 'Address matches documentation', checked: false, na: false, naReason: '' },
      { id: 'addr2', text: 'Documents are recent (within 90 days)', checked: false, na: false, naReason: '' },
      { id: 'addr3', text: 'Name on documents matches owner', checked: false, na: false, naReason: '' },
      { id: 'addr4', text: 'Documentation is complete and legible', checked: false, na: false, naReason: '' }
    ],
    business: [
      { id: 'biz1', text: 'Owner appears on business registration', checked: false, na: false, naReason: '' },
      { id: 'biz2', text: 'Ownership percentage is documented', checked: false, na: false, naReason: '' },
      { id: 'biz3', text: 'Business connection is clearly established', checked: false, na: false, naReason: '' }
    ]
  });
  
  // Final verification decision
  const [finalDecision, setFinalDecision] = useState({
    status: '', // "VERIFIED", "REJECTED", "NEEDS_INFO"
    rejectionReason: '',
    additionalInfoRequested: ''
  });
  
  // Business affiliation related state
  const [affiliationType, setAffiliationType] = useState(null); // 'NEW_INTENT' or 'EXISTING_CLAIM'
  
  // New business intent details
  const [newBusinessIntent, setNewBusinessIntent] = useState({
    legalName: '',
    dba: '',
    businessType: ''
  });
  
  // Existing business claim details
  const [businessClaim, setBusinessClaim] = useState({
    selectedBusiness: null,
    searchTerm: '',
    searchResults: [],
    ownershipPercentage: '',
    roleInBusiness: ''
  });
  
  // Document related states
  const [documentStatuses, setDocumentStatuses] = useState({});
  const [documentNotes, setDocumentNotes] = useState({});
  
  // Owner editable fields state (for Step 2 & 3)
  const [ownerFields, setOwnerFields] = useState({
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    taxId: '',
    idLicenseNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    zipCode: ''
  });
  
  // Load initial data
  useEffect(() => {
    if (initialData) {
      // Populate state from loaded draft or existing data
      // This would be used when resuming a draft or "Needs Info" state
      if (initialData.currentStep) setCurrentStep(initialData.currentStep);
      if (initialData.verificationStatus) setVerificationStatus(initialData.verificationStatus);
      if (initialData.notes) setNotes(initialData.notes);
      if (initialData.checklists) setChecklists(initialData.checklists);
      if (initialData.finalDecision) setFinalDecision(initialData.finalDecision);
      if (initialData.affiliationType) setAffiliationType(initialData.affiliationType);
      if (initialData.newBusinessIntent) setNewBusinessIntent(initialData.newBusinessIntent);
      if (initialData.businessClaim) setBusinessClaim(initialData.businessClaim);
      if (initialData.documentStatuses) setDocumentStatuses(initialData.documentStatuses);
      if (initialData.documentNotes) setDocumentNotes(initialData.documentNotes);
      if (initialData.ownerFields) setOwnerFields(initialData.ownerFields);
    }
  }, [initialData]);

  // Methods for updating state
  const toggleChecklistItem = (category, itemId) => {
    setChecklists(prev => ({
      ...prev,
      [category]: prev[category].map(item => 
        item.id === itemId 
          ? { ...item, checked: !item.checked, na: false, naReason: '' } 
          : item
      )
    }));
  };
  
  const toggleNaChecklistItem = (category, itemId) => {
    setChecklists(prev => ({
      ...prev,
      [category]: prev[category].map(item => 
        item.id === itemId 
          ? { ...item, na: !item.na, checked: false, naReason: item.na ? '' : item.naReason } 
          : item
      )
    }));
  };
  
  const updateNaReason = (category, itemId, reason) => {
    setChecklists(prev => ({
      ...prev,
      [category]: prev[category].map(item => 
        item.id === itemId 
          ? { ...item, naReason: reason } 
          : item
      )
    }));
  };
  
  const updateVerificationStatus = (category, status) => {
    setVerificationStatus(prev => ({
      ...prev,
      [`${category}Verified`]: status
    }));
  };
  
  const updateNotes = (category, value) => {
    setNotes(prev => ({
      ...prev,
      [category]: value
    }));
  };
  
  const updateDocumentStatus = (docId, status) => {
    setDocumentStatuses(prev => ({
      ...prev,
      [docId]: status
    }));
  };
  
  const updateDocumentNote = (docId, note) => {
    setDocumentNotes(prev => ({
      ...prev,
      [docId]: note
    }));
  };
  
  const updateOwnerField = (field, value) => {
    setOwnerFields(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Helper methods for checking completion status
  const areAllChecked = (category) => {
    return checklists[category].every(item => item.checked || item.na);
  };
  
  // Prepare draft for auto-save
  const getDraftData = () => ({
    ownerId,
    currentStep,
    verificationStatus,
    notes,
    checklists,
    finalDecision,
    affiliationType,
    newBusinessIntent,
    businessClaim,
    documentStatuses,
    documentNotes,
    ownerFields
  });
  
  // Prepare final submission data
  const getSubmissionData = () => ({
    ownerId,
    verificationStatus,
    notes,
    checklists,
    finalDecision,
    affiliationType,
    newBusinessIntent,
    businessClaim,
    documentStatuses,
    documentNotes,
    ownerFields
  });
  
  return {
    // State
    currentStep,
    setCurrentStep,
    selectedDocument,
    setSelectedDocument,
    documentZoom,
    setDocumentZoom,
    verificationStatus,
    notes,
    checklists,
    finalDecision,
    setFinalDecision,
    affiliationType,
    setAffiliationType,
    newBusinessIntent,
    setNewBusinessIntent,
    businessClaim,
    setBusinessClaim,
    documentStatuses,
    documentNotes,
    ownerFields,
    
    // Methods
    toggleChecklistItem,
    toggleNaChecklistItem,
    updateNaReason,
    updateVerificationStatus,
    updateNotes,
    updateDocumentStatus,
    updateDocumentNote,
    updateOwnerField,
    areAllChecked,
    getDraftData,
    getSubmissionData
  };
}