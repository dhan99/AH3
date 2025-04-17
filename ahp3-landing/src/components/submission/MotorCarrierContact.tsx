import React, { useState, useEffect, useRef } from 'react';

interface MotorCarrierContactProps {
  dotAddressData: {
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
  } | null;
  onValidationChange?: (isValid: boolean) => void;
  onDataChange?: (data: ContactInfo) => void;
  // Initial data from parent component to restore state when component remounts
  initialData?: ContactInfo;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  useAddressAbove: boolean;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

// Create a global window property type
declare global {
  interface Window {
    validateContactInfo?: () => boolean;
  }
}

const MotorCarrierContact: React.FC<MotorCarrierContactProps> = ({ 
  dotAddressData, 
  onValidationChange,
  onDataChange,
  initialData
}) => {
  // Create a reference to expose to parent
  const validateRef = useRef<HTMLInputElement>(null);
  
  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true);
  
  // Track phone field focus state and validation
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [phoneBlurred, setPhoneBlurred] = useState(false);
  
  // State for contact information - initialize with initialData if provided, otherwise empty
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => {
    if (initialData) {
      return initialData;
    }
    
    return {
      firstName: '',
      lastName: '',
      title: '',
      email: '',
      phone: '',
      useAddressAbove: false,
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
    };
  });
  
  // Update contact info when initialData changes (e.g., when accordion reopens)
  useEffect(() => {
    if (initialData && !isFirstRender.current) {
      // Explicitly preserve the current useAddressAbove state to prevent overriding it
      setContactInfo(prevInfo => {
        // Only update if the data is actually different to avoid infinite loops
        const shouldUpdate = 
          prevInfo.firstName !== initialData.firstName ||
          prevInfo.lastName !== initialData.lastName ||
          prevInfo.title !== initialData.title ||
          prevInfo.email !== initialData.email ||
          prevInfo.phone !== initialData.phone;
        
        if (shouldUpdate) {
          return {
            ...initialData,
            // Keep the current useAddressAbove state rather than using initialData's value
            useAddressAbove: prevInfo.useAddressAbove
          };
        }
        return prevInfo;
      });
    }
    isFirstRender.current = false;
  }, [initialData]);

  // Handle DOT data copying when checkbox changes - run only when useAddressAbove or dotAddressData changes
  useEffect(() => {
    // Run this effect only when checkbox is EXPLICITLY checked by user and DOT data is available
    // This prevents automatic checking when first name or other fields are changed
    if (!contactInfo.useAddressAbove || !dotAddressData) return;
    
    // To prevent infinite loops, only update if address fields don't match DOT data
    if (
      contactInfo.streetAddress === dotAddressData.streetAddress &&
      contactInfo.city === dotAddressData.city &&
      contactInfo.state === dotAddressData.state &&
      contactInfo.zipCode === dotAddressData.zipCode
    ) {
      return; // Skip if data already matches
    }
    
    // Use functional update pattern to avoid stale closures
    setContactInfo(prev => {
      const updated = {
        ...prev,
        streetAddress: dotAddressData.streetAddress,
        city: dotAddressData.city,
        state: dotAddressData.state,
        zipCode: dotAddressData.zipCode,
      };
      
      // Notify parent component
      if (onDataChange) {
        onDataChange(updated);
      }
      
      return updated;
    });
  }, [contactInfo.useAddressAbove, dotAddressData, onDataChange]); // Only include the checkbox state and DOT data

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof ContactInfo, string>>>({});

  // Expose validation function to window object
  useEffect(() => {
    window.validateContactInfo = validateContactInfo;
    
    return () => {
      // Clean up when component unmounts
      delete window.validateContactInfo;
    };
  }, []);
  
  // Validate all fields except title
  const validateContactInfo = (): boolean => {
    const errors: Partial<Record<keyof ContactInfo, string>> = {};
    
    if (!contactInfo.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    
    if (!contactInfo.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    
    if (!contactInfo.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(contactInfo.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!contactInfo.phone.trim()) {
      errors.phone = "Phone number is required";
    } else {
      // Simplified phone validation that accepts:
      // 1. 10 digits (e.g., 1234567890)
      // 2. 11 digits starting with 1 (e.g., 11234567890)
      // 3. Common formats with separators: (123) 456-7890, 123-456-7890, 123.456.7890, +1 234 567 8901
      const strippedPhone = contactInfo.phone.replace(/\D/g, ''); // Remove all non-digits
      const isValidLength = strippedPhone.length === 10 || 
                           (strippedPhone.length === 11 && strippedPhone[0] === '1');
                           
      if (!isValidLength) {
        errors.phone = "Please enter a valid 10-digit US or Canadian phone number";
      }
    }
    
    if (!contactInfo.streetAddress.trim()) {
      errors.streetAddress = "Street address is required";
    }
    
    if (!contactInfo.city.trim()) {
      errors.city = "City is required";
    }
    
    if (!contactInfo.state) {
      errors.state = "State is required";
    }
    
    if (!contactInfo.zipCode.trim()) {
      errors.zipCode = "Zip code is required";
    }
    
    setValidationErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    
    if (onValidationChange) {
      onValidationChange(isValid);
    }
    
    // If valid, ensure the contact data is provided to the parent
    if (isValid && onDataChange) {
      onDataChange(contactInfo);
    }
    
    return isValid;
  };
  
  // Validate form in real-time and update parent about validation status without showing errors
  // This is in a separate useEffect to avoid updating parent state during rendering
  useEffect(() => {
    // Use a single render cycle with setTimeout to prevent errors
    const validateFields = () => {
      // Simplified phone validation - just check for correct digit length
      const strippedPhone = contactInfo.phone.replace(/\D/g, ''); // Remove all non-digits
      const isValidPhone = strippedPhone.length === 10 || 
                          (strippedPhone.length === 11 && strippedPhone[0] === '1');
      
      // Check if all required fields (except title) are filled and valid
      const isValid = 
        contactInfo.firstName.trim() !== '' &&
        contactInfo.lastName.trim() !== '' &&
        contactInfo.email.trim() !== '' &&
        /^\S+@\S+\.\S+$/.test(contactInfo.email) &&
        contactInfo.phone.trim() !== '' &&
        isValidPhone &&
        contactInfo.streetAddress.trim() !== '' &&
        contactInfo.city.trim() !== '' &&
        contactInfo.state !== '' &&
        contactInfo.zipCode.trim() !== '';
      
      // Update parent about validation status
      if (onValidationChange) {
        onValidationChange(isValid);
      }
      
      // Clear all validation errors if all fields are valid
      if (isValid && Object.keys(validationErrors).length > 0) {
        setValidationErrors({});
      }
    };
    
    // Defer state updates to avoid React warnings
    const timeoutId = setTimeout(validateFields, 0);
    return () => clearTimeout(timeoutId);
  }, [contactInfo, onValidationChange, validationErrors]);

  // Input handler for form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false;
    
    // Always clear validation errors for this field on change
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name as keyof ContactInfo];
      return newErrors;
    });
    
    // Special handling for the checkbox that controls address copying
    if (type === 'checkbox' && name === 'useAddressAbove') {
      // If checking the box, update checkbox state only - useEffect will handle copying
      // If unchecking, clear the address fields immediately
      const updatedInfo = checked 
        ? { 
            ...contactInfo, 
            useAddressAbove: true 
          }
        : {
            ...contactInfo,
            useAddressAbove: false,
            streetAddress: '',
            city: '',
            state: '',
            zipCode: ''
          };
          
      // Update state with new values
      setContactInfo(updatedInfo);
      
      // Notify parent component
      if (onDataChange) {
        onDataChange(updatedInfo);
      }
    } else {
      // For all other fields, simple update - ensure we don't affect useAddressAbove state
      setContactInfo(prev => {
        const updated = { 
          ...prev,
          [name]: type === 'checkbox' ? checked : value 
        };
        
        // Notify parent component
        if (onDataChange) {
          onDataChange(updated);
        }
        
        return updated;
      });
    }
  };

  // Function to show field error style
  const getFieldErrorClass = (fieldName: keyof ContactInfo) => {
    return validationErrors[fieldName] 
      ? "border-[#C60C30] focus:ring-[#C60C30] bg-white" 
      : "border-[#D8D8D8] focus:ring-[#007B87] bg-white";
  };

  return (
    <div className="p-6">
      <p className="text-base mb-6 whitespace-pre-line">
        Enter a contact for the insurance policy.  
        <br />
        We will use this information to email a copy of your proof of insurance, or to contact you about the policy.
      </p>
      
      <div className="space-y-4">
        {/* First, Last, Title Row */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[150px]">
            <label htmlFor="firstName" className="block text-base font-semibold text-[#333333] mb-1">
              First
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={contactInfo.firstName}
              onChange={handleInputChange}
              onBlur={() => {
                // Validate firstName on blur
                if (!contactInfo.firstName.trim()) {
                  setValidationErrors(prev => ({
                    ...prev,
                    firstName: "First name is required"
                  }));
                }
              }}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${getFieldErrorClass('firstName')}`}
            />
            {validationErrors.firstName && (
              <p className="text-[#C60C30] text-sm mt-1">{validationErrors.firstName}</p>
            )}
          </div>
          <div className="flex-1 min-w-[150px]">
            <label htmlFor="lastName" className="block text-base font-semibold text-[#333333] mb-1">
              Last
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={contactInfo.lastName}
              onChange={handleInputChange}
              onBlur={() => {
                // Validate lastName on blur
                if (!contactInfo.lastName.trim()) {
                  setValidationErrors(prev => ({
                    ...prev,
                    lastName: "Last name is required"
                  }));
                }
              }}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${getFieldErrorClass('lastName')}`}
            />
            {validationErrors.lastName && (
              <p className="text-[#C60C30] text-sm mt-1">{validationErrors.lastName}</p>
            )}
          </div>
          <div className="flex-1 min-w-[150px]">
            <label htmlFor="title" className="block text-base font-semibold text-[#333333] mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={contactInfo.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-[#D8D8D8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]"
            />
          </div>
        </div>
        
        {/* Email and Phone Row */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[230px]">
            <label htmlFor="email" className="block text-base font-semibold text-[#333333] mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={contactInfo.email}
              onChange={handleInputChange}
              onBlur={() => {
                // Validate email on blur
                if (!contactInfo.email.trim()) {
                  setValidationErrors(prev => ({
                    ...prev,
                    email: "Email is required"
                  }));
                } else if (!/^\S+@\S+\.\S+$/.test(contactInfo.email)) {
                  setValidationErrors(prev => ({
                    ...prev,
                    email: "Please enter a valid email address"
                  }));
                }
              }}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${getFieldErrorClass('email')}`}
            />
            {validationErrors.email && (
              <p className="text-[#C60C30] text-sm mt-1">{validationErrors.email}</p>
            )}
          </div>
          <div className="flex-1 min-w-[230px]">
            <label htmlFor="phone" className="block text-base font-semibold text-[#333333] mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={contactInfo.phone}
              onChange={handleInputChange}
              onFocus={() => setIsPhoneFocused(true)}
              onBlur={() => {
                setIsPhoneFocused(false);
                setPhoneBlurred(true);
                
                // Use setTimeout to avoid setState during render
                setTimeout(() => {
                  // Validate phone on blur
                  if (contactInfo.phone.trim() !== '') {
                    const strippedPhone = contactInfo.phone.replace(/\D/g, ''); // Remove all non-digits
                    const isValidLength = strippedPhone.length === 10 || 
                                        (strippedPhone.length === 11 && strippedPhone[0] === '1');
                                        
                    if (!isValidLength) {
                      setValidationErrors(prev => ({
                        ...prev,
                        phone: "Please enter a valid 10-digit US or Canadian phone number"
                      }));
                    } else {
                      // Clear error if valid
                      setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.phone;
                        return newErrors;
                      });
                    }
                  }
                  
                  // Always notify parent of data change on blur
                  if (onDataChange) {
                    onDataChange(contactInfo);
                  }
                }, 0);
              }}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${getFieldErrorClass('phone')}`}
              placeholder="(123) 456-7890"
            />
            {validationErrors.phone && (
              <p className="text-[#C60C30] text-sm mt-1">{validationErrors.phone}</p>
            )}
            {!validationErrors.phone && isPhoneFocused && (
              <p className="text-sm text-[#666666] mt-1">
                Accepted formats: 10 digits (1234567890), formatted (123) 456-7890, 123-456-7890, or with country code (+1 234 567 8901)
              </p>
            )}
          </div>
        </div>
        
        {/* Same as address above checkbox - Always displayed as per Figma spec */}
        <div className="mt-6 mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              id="useAddressAbove"
              name="useAddressAbove"
              checked={contactInfo.useAddressAbove}
              onChange={handleInputChange}
              className="w-4 h-4 mr-2 border border-[#757575] border-2 rounded"
              disabled={!dotAddressData} // Only disable if no DOT data is available
            />
            <span className="text-base text-[#333333]">Same as address above</span>
          </label>
        </div>
        
        {/* Address Field */}
        <div>
          <label htmlFor="streetAddress" className="block text-base font-semibold text-[#333333] mb-1">
            Mailing address, including apartment, suite, unit, building, floor, etc..
          </label>
          <input
            type="text"
            id="streetAddress"
            name="streetAddress"
            value={contactInfo.streetAddress}
            onChange={handleInputChange}
            onBlur={() => {
              // Validate street address on blur (only if not using address above)
              if (!contactInfo.useAddressAbove && !contactInfo.streetAddress.trim()) {
                setValidationErrors(prev => ({
                  ...prev,
                  streetAddress: "Street address is required"
                }));
              }
            }}
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${getFieldErrorClass('streetAddress')}`}
            disabled={contactInfo.useAddressAbove}
          />
          {validationErrors.streetAddress && (
            <p className="text-[#C60C30] text-sm mt-1">{validationErrors.streetAddress}</p>
          )}
        </div>
        
        {/* City, State, Zip Row */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[230px]">
            <label htmlFor="city" className="block text-base font-semibold text-[#333333] mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={contactInfo.city}
              onChange={handleInputChange}
              onBlur={() => {
                // Validate city on blur (only if not using address above)
                if (!contactInfo.useAddressAbove && !contactInfo.city.trim()) {
                  setValidationErrors(prev => ({
                    ...prev,
                    city: "City is required"
                  }));
                }
              }}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${getFieldErrorClass('city')}`}
              disabled={contactInfo.useAddressAbove}
            />
            {validationErrors.city && (
              <p className="text-[#C60C30] text-sm mt-1">{validationErrors.city}</p>
            )}
          </div>
          <div className="w-32">
            <label htmlFor="state" className="block text-base font-semibold text-[#333333] mb-1">
              State
            </label>
            <select
              id="state"
              name="state"
              value={contactInfo.state}
              onChange={handleInputChange}
              onBlur={() => {
                // Validate state on blur (only if not using address above)
                if (!contactInfo.useAddressAbove && !contactInfo.state) {
                  setValidationErrors(prev => ({
                    ...prev,
                    state: "State is required"
                  }));
                }
              }}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${getFieldErrorClass('state')}`}
              disabled={contactInfo.useAddressAbove}
            >
              <option value="">Select</option>
              {['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
                'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
                'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
                'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
                'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'].map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {validationErrors.state && (
              <p className="text-[#C60C30] text-sm mt-1">{validationErrors.state}</p>
            )}
          </div>
          <div className="w-48">
            <label htmlFor="zipCode" className="block text-base font-semibold text-[#333333] mb-1">
              Zip code
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={contactInfo.zipCode}
              onChange={handleInputChange}
              onBlur={() => {
                // Validate zip code on blur (only if not using address above)
                if (!contactInfo.useAddressAbove && !contactInfo.zipCode.trim()) {
                  setValidationErrors(prev => ({
                    ...prev,
                    zipCode: "Zip code is required"
                  }));
                }
              }}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${getFieldErrorClass('zipCode')}`}
              disabled={contactInfo.useAddressAbove}
            />
            {validationErrors.zipCode && (
              <p className="text-[#C60C30] text-sm mt-1">{validationErrors.zipCode}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotorCarrierContact;
