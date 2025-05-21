'use client';

import { useState, useCallback } from 'react';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NEEDS_REVIEW';

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  isNA?: boolean;
  naReason?: string;
}

export interface DocumentStatus {
  id: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NEEDS_REVIEW' | 'OTHER_ISSUE';
  note?: string;
}

interface OwnerFields {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  zipCode?: string;
  taxId?: string;
  idNumber?: string;
  idType?: string;
}

interface VerificationState {
  // Owner information
  ownerFields: OwnerFields;
  
  // Verification checklists by category
  checklists: {
    identity: ChecklistItem[];
    address: ChecklistItem[];
    business: ChecklistItem[];
  };
  
  // Verification status by category
  verificationStatus: {
    identity: VerificationStatus;
    address: VerificationStatus;
    business: VerificationStatus;
    overall: VerificationStatus;
  };
  
  // Notes by category
  notes: {
    identity: string;
    address: string;
    business: string;
    overall: string;
  };
  
  // Document statuses
  documentStatuses: DocumentStatus[];
  
  // Selected document for viewing
  selectedDocument: string | null;
}

// Initial state for the verification process
const getInitialState = (ownerData: any = null): VerificationState => {
  return {
    ownerFields: {
      firstName: ownerData?.firstName || '',
      lastName: ownerData?.lastName || '',
      email: ownerData?.email || '',
      phone: ownerData?.phone || '',
      addressLine1: ownerData?.addressLine1 || '',
      addressLine2: ownerData?.addressLine2 || '',
      city: ownerData?.city || '',
      zipCode: ownerData?.zipCode || '',
      taxId: ownerData?.taxId || '',
      idNumber: ownerData?.idNumber || '',
      idType: ownerData?.idType || ''
    },
    checklists: {
      identity: [
        { id: 'id-match', text: 'ID information matches provided details', checked: false },
        { id: 'id-valid', text: 'ID document is valid and not expired', checked: false },
        { id: 'photo-match', text: 'Photo on ID matches other documentation', checked: false },
        { id: 'tax-id-valid', text: 'Tax ID format is valid', checked: false }
      ],
      address: [
        { id: 'address-match', text: 'Address on documents matches provided address', checked: false },
        { id: 'address-valid', text: 'Address is a valid mailing address', checked: false },
        { id: 'proof-recent', text: 'Proof of address is recent (< 3 months)', checked: false }
      ],
      business: [
        { id: 'business-owner', text: 'Person is confirmed as a business owner', checked: false },
        { id: 'business-active', text: 'Business is active', checked: false },
        { id: 'business-docs', text: 'Business ownership documents are valid', checked: false }
      ]
    },
    verificationStatus: {
      identity: 'PENDING',
      address: 'PENDING',
      business: 'PENDING',
      overall: 'PENDING'
    },
    notes: {
      identity: '',
      address: '',
      business: '',
      overall: ''
    },
    documentStatuses: [],
    selectedDocument: null
  };
};

export default function useVerificationState(ownerId: string, initialData: any = null) {
  const [state, setState] = useState<VerificationState>(getInitialState(initialData));
  
  // Toggle an item in a checklist
  const toggleChecklistItem = useCallback((category: keyof VerificationState['checklists'], itemId: string) => {
    setState(prevState => {
      const updatedChecklist = prevState.checklists[category].map(item => 
        item.id === itemId ? { ...item, checked: !item.checked } : item
      );
      
      return {
        ...prevState,
        checklists: {
          ...prevState.checklists,
          [category]: updatedChecklist
        }
      };
    });
  }, []);
  
  // Toggle "Not Applicable" for a checklist item
  const toggleNaChecklistItem = useCallback((category: keyof VerificationState['checklists'], itemId: string) => {
    setState(prevState => {
      const updatedChecklist = prevState.checklists[category].map(item => 
        item.id === itemId ? { ...item, isNA: !item.isNA, checked: false } : item
      );
      
      return {
        ...prevState,
        checklists: {
          ...prevState.checklists,
          [category]: updatedChecklist
        }
      };
    });
  }, []);
  
  // Update reason for NA
  const updateNaReason = useCallback((category: keyof VerificationState['checklists'], itemId: string, reason: string) => {
    setState(prevState => {
      const updatedChecklist = prevState.checklists[category].map(item => 
        item.id === itemId ? { ...item, naReason: reason } : item
      );
      
      return {
        ...prevState,
        checklists: {
          ...prevState.checklists,
          [category]: updatedChecklist
        }
      };
    });
  }, []);
  
  // Update verification status for a category
  const updateVerificationStatus = useCallback((category: keyof VerificationState['verificationStatus'], status: VerificationStatus) => {
    setState(prevState => ({
      ...prevState,
      verificationStatus: {
        ...prevState.verificationStatus,
        [category]: status
      }
    }));
  }, []);
  
  // Update notes for a category
  const updateNotes = useCallback((category: keyof VerificationState['notes'], value: string) => {
    setState(prevState => ({
      ...prevState,
      notes: {
        ...prevState.notes,
        [category]: value
      }
    }));
  }, []);
  
  // Update status for a document
  const updateDocumentStatus = useCallback((docId: string, status: DocumentStatus['status']) => {
    setState(prevState => {
      const docIndex = prevState.documentStatuses.findIndex(doc => doc.id === docId);
      
      if (docIndex >= 0) {
        const updated = [...prevState.documentStatuses];
        updated[docIndex] = { ...updated[docIndex], status };
        return { ...prevState, documentStatuses: updated };
      }
      
      return {
        ...prevState,
        documentStatuses: [...prevState.documentStatuses, { id: docId, status }]
      };
    });
  }, []);
  
  // Update note for a document
  const updateDocumentNote = useCallback((docId: string, note: string) => {
    setState(prevState => {
      const docIndex = prevState.documentStatuses.findIndex(doc => doc.id === docId);
      
      if (docIndex >= 0) {
        const updated = [...prevState.documentStatuses];
        updated[docIndex] = { ...updated[docIndex], note };
        return { ...prevState, documentStatuses: updated };
      }
      
      return prevState;
    });
  }, []);
  
  // Update owner field
  const updateOwnerField = useCallback((field: keyof OwnerFields, value: string) => {
    setState(prevState => ({
      ...prevState,
      ownerFields: {
        ...prevState.ownerFields,
        [field]: value
      }
    }));
  }, []);
  
  // Select a document for viewing
  const setSelectedDocument = useCallback((docId: string | null) => {
    setState(prevState => ({
      ...prevState,
      selectedDocument: docId
    }));
  }, []);
  
  // Check if all items in a category are checked
  const areAllChecked = useCallback((category: keyof VerificationState['checklists']) => {
    return state.checklists[category].every(item => item.checked || item.isNA);
  }, [state.checklists]);

  return {
    state,
    toggleChecklistItem,
    toggleNaChecklistItem,
    updateNaReason,
    updateVerificationStatus,
    updateNotes,
    updateDocumentStatus,
    updateDocumentNote,
    updateOwnerField,
    setSelectedDocument,
    areAllChecked
  };
} 