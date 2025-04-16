import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define types for our state
interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

interface CarrierInfo {
  mcNumber: string;
  name: string;
  dbaName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  vehicles: number;
  warnings: string[];
  errors: string[];
  info: string[];
}

interface AddressData {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface SubmissionState {
  // DOT Search state
  dotNumber: string;
  isDOTValid: boolean;
  carrierInfo: CarrierInfo | null;
  
  // Product selection state
  selectedProducts: string[];
  
  // Contact data
  contactData: ContactInfo | null;
  isContactValid: boolean;
  
  // Address data
  addressData: AddressData;
  
  // UI state for sections
  openSections: {
    motorCarrier: boolean;
    motorCarrierContact: boolean;
    coverage: boolean;
  };
  
  // Actions
  setDotNumber: (value: string) => void;
  setIsDOTValid: (value: boolean) => void;
  setCarrierInfo: (info: CarrierInfo | null) => void;
  setSelectedProducts: (products: string[]) => void;
  addSelectedProduct: (product: string) => void;
  removeSelectedProduct: (product: string) => void;
  setContactData: (data: ContactInfo | null) => void;
  setIsContactValid: (valid: boolean) => void;
  setAddressData: (data: AddressData) => void;
  setOpenSection: (section: keyof SubmissionState['openSections'], isOpen: boolean) => void;
  reset: () => void;
}

// Initial state values
const initialState = {
  // DOT Search state
  dotNumber: '',
  isDOTValid: false,
  carrierInfo: null,
  
  // Product selection state
  selectedProducts: ['occupational_accident', 'non_trucking_liability', 'vehicle_physical_damage'],
  
  // Contact data
  contactData: null,
  isContactValid: false,
  
  // Address data
  addressData: {
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  },
  
  // UI state
  openSections: {
    motorCarrier: true,
    motorCarrierContact: true,
    coverage: true
  }
};

// Create the store
const useSubmissionStore = create<SubmissionState>()(
  persist(
    (set) => ({
      ...initialState,
      
      // DOT actions
      setDotNumber: (value) => set({ dotNumber: value }),
      setIsDOTValid: (value) => set({ isDOTValid: value }),
      setCarrierInfo: (info) => set({ carrierInfo: info }),
      
      // Product selection actions
      setSelectedProducts: (products) => set({ selectedProducts: products }),
      addSelectedProduct: (product) => set((state) => ({
        selectedProducts: [...state.selectedProducts, product]
      })),
      removeSelectedProduct: (product) => set((state) => ({
        selectedProducts: state.selectedProducts.filter(p => p !== product)
      })),
      
      // Contact data actions
      setContactData: (data) => set({ contactData: data }),
      setIsContactValid: (valid) => set({ isContactValid: valid }),
      
      // Address data actions
      setAddressData: (data) => set({ addressData: data }),
      
      // UI actions
      setOpenSection: (section, isOpen) => set((state) => ({
        openSections: {
          ...state.openSections,
          [section]: isOpen
        }
      })),
      
      // Reset action (for signout)
      reset: () => set(initialState)
    }),
    {
      name: 'submission-storage', // name of the item in the storage (must be unique)
      // Optional configuration for storage
      partialize: (state) => ({
        dotNumber: state.dotNumber,
        isDOTValid: state.isDOTValid,
        carrierInfo: state.carrierInfo,
        selectedProducts: state.selectedProducts,
        contactData: state.contactData,
        isContactValid: state.isContactValid,
        addressData: state.addressData,
        openSections: state.openSections
      })
    }
  )
);

export default useSubmissionStore;
