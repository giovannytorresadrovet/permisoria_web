// /components/shared/owners/AddBusinessOwnerModal.tsx
import React, { useState } from "react";
import { Modal, Button, TextInput } from "keep-react";
import { motion } from "framer-motion";
import { X, User, Envelope, Phone } from "phosphor-react";

interface AddBusinessOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOwner: (data: any) => void;
}

const AddBusinessOwnerModal: React.FC<AddBusinessOwnerModalProps> = ({
  isOpen,
  onClose,
  onAddOwner,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user edits
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Here you would typically make an API call to create the business owner
        // For now, we'll simulate a successful creation
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        onAddOwner({
          ...formData,
          id: `bo-${Date.now()}`,
          status: "ACTIVE",
          verificationStatus: "UNVERIFIED",
        });
        
        // Reset form and close modal
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        });
        onClose();
      } catch (error) {
        console.error("Failed to create business owner:", error);
        setErrors((prev) => ({ ...prev, general: "Failed to create business owner. Please try again." }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Modal
      size="md"
      show={isOpen}
      onClose={onClose}
    >
      <Modal.Header className="bg-gray-800 text-white border-b border-gray-700">
        <div className="flex justify-between items-center w-full">
          <h3 className="text-xl font-semibold">Add New Business Owner</h3>
          <Button
            size="sm"
            variant="circular"
            color="gray"
            onClick={onClose}
          >
            <X size={20} weight="bold" />
          </Button>
        </div>
      </Modal.Header>
      <Modal.Body className="bg-gray-800 text-white">
        <div className="space-y-4">
          <p className="text-sm text-gray-400 mb-4">
            Enter basic details to create a new business owner. Full information can be added on the Owner Detail page after creation.
          </p>
          
          {errors.general && (
            <div className="p-3 bg-red-900/30 border border-red-700 rounded-md text-red-400 text-sm">
              {errors.general}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <TextInput
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className={`bg-gray-700 text-white w-full ${errors.firstName ? 'border-red-500' : ''}`}
                afterIcon={<User size={20} color="#9CA3AF" />}
              />
              {errors.firstName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-500"
                >
                  {errors.firstName}
                </motion.p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <TextInput
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className={`bg-gray-700 text-white w-full ${errors.lastName ? 'border-red-500' : ''}`}
                afterIcon={<User size={20} color="#9CA3AF" />}
              />
              {errors.lastName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-red-500"
                >
                  {errors.lastName}
                </motion.p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <TextInput
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className={`bg-gray-700 text-white w-full ${errors.email ? 'border-red-500' : ''}`}
              afterIcon={<Envelope size={20} color="#9CA3AF" />}
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-xs text-red-500"
              >
                {errors.email}
              </motion.p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Phone Number
            </label>
            <TextInput
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number (optional)"
              className={`bg-gray-700 text-white w-full ${errors.phone ? 'border-red-500' : ''}`}
              afterIcon={<Phone size={20} color="#9CA3AF" />}
            />
            {errors.phone && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-xs text-red-500"
              >
                {errors.phone}
              </motion.p>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-gray-800 border-t border-gray-700">
        <div className="flex justify-end gap-3">
          <Button
            size="md"
            color="metal"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            size="md"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Owner"}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AddBusinessOwnerModal;
