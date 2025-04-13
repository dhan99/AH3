import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddressData {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface AddressEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressData: AddressData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AddressEditModal: React.FC<AddressEditModalProps> = ({
  isOpen,
  onClose,
  addressData,
  onChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.2, 
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { 
        duration: 0.1, 
        ease: "easeIn"
      }
    }
  };

  // Overlay animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.1 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-[rgba(51,51,51,0.5)] backdrop-blur-[2px] flex items-center justify-center z-50"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
        >
          <motion.div 
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
            variants={modalVariants}
          >
            <div className="p-6 flex flex-col items-center relative">
              {/* Close button */}
              <button 
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 text-[#333333]"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="currentColor"/>
                </svg>
              </button>
              
              {/* Modal Title */}
              <h3 className="text-2xl font-semibold text-[#333333] text-center mb-6">
                Update<br />Motor Carrier Address
              </h3>
              
              <form onSubmit={onSubmit} className="w-full">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="streetAddress" className="block text-base font-semibold text-[#333333] mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      id="streetAddress"
                      name="streetAddress"
                      value={addressData.streetAddress}
                      onChange={onChange}
                      className="w-full px-4 py-3 bg-[#F2FBFC] border border-[#D8D8D8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]"
                      placeholder="Street address"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-base font-semibold text-[#333333] mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={addressData.city}
                      onChange={onChange}
                      className="w-full px-4 py-3 bg-[#F2FBFC] border border-[#D8D8D8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]"
                      placeholder="City"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-base font-semibold text-[#333333] mb-1">
                      State
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={addressData.state}
                      onChange={onChange}
                      className="w-full px-4 py-3 bg-[#F2FBFC] border border-[#D8D8D8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]"
                    >
                      <option value="">Select state</option>
                      {['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
                        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
                        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
                        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
                        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'].map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-base font-semibold text-[#333333] mb-1">
                      Zip code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={addressData.zipCode}
                      onChange={onChange}
                      className="w-full px-4 py-3 bg-[#F2FBFC] border border-[#D8D8D8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#007B87]"
                      placeholder="Zip code"
                    />
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#007B87] text-white font-semibold rounded hover:bg-[#005F69] transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddressEditModal;
