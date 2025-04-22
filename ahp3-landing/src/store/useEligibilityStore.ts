import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define types for our state
interface VehicleTypes {
  box: string;
  dump: string;
  flatbeds: string;
  intermodalContainer: string;
  refrigerated: string;
  tankers: string;
  other: string;
  otherType: string;
}

interface SelectedItem {
  id: string;
  name: string;
  type: 'agricultural' | 'bulk';
}

interface EligibilityState {
  // Driver Agreements state
  driverLeaseAgreement: string | null;
  independentContractors: string | null;
  
  // Vehicle Types state
  vehicleTypes: VehicleTypes;
  
  // Hauling state
  selectedItems: SelectedItem[];
  
  // UI state for sections
  openSections: {
    driverAgreements: boolean;
    vehicleTypes: boolean;
    hauling: boolean;
  };
  
  // Actions
  setDriverLeaseAgreement: (value: string | null) => void;
  setIndependentContractors: (value: string | null) => void;
  setVehicleType: (type: keyof VehicleTypes, value: string) => void;
  setSelectedItems: (items: SelectedItem[]) => void;
  addSelectedItem: (item: SelectedItem) => void;
  removeSelectedItem: (id: string) => void;
  setOpenSection: (section: 'driverAgreements' | 'vehicleTypes' | 'hauling', isOpen: boolean) => void;
  reset: () => void;
}

// Initial state values
const initialState = {
  // Driver Agreements
  driverLeaseAgreement: null,
  independentContractors: null,
  
  // Vehicle Types
  vehicleTypes: {
    box: '10',
    dump: '10',
    flatbeds: '20',
    intermodalContainer: '20',
    refrigerated: '20',
    tankers: '20',
    other: '',
    otherType: ''
  },
  
  // Hauling
  selectedItems: [],
  
  // UI state
  openSections: {
    driverAgreements: true,
    vehicleTypes: true,
    hauling: true
  }
};

// Create the store
const useEligibilityStore = create<EligibilityState>()(
  persist(
    (set) => ({
      ...initialState,
      
      // Driver agreements actions
      setDriverLeaseAgreement: (value) => set({ driverLeaseAgreement: value }),
      setIndependentContractors: (value) => set({ independentContractors: value }),
      
      // Vehicle types actions
      setVehicleType: (type, value) => set((state) => ({
        vehicleTypes: {
          ...state.vehicleTypes,
          [type]: value
        }
      })),
      
      // Hauling actions
      setSelectedItems: (items) => set({ selectedItems: items }),
      addSelectedItem: (item) => set((state) => ({
        selectedItems: [...state.selectedItems, item]
      })),
      removeSelectedItem: (id) => set((state) => ({
        selectedItems: state.selectedItems.filter(item => item.id !== id)
      })),
      
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
      name: 'eligibility-storage', // name of the item in the storage (must be unique)
      // Optional configuration for storage
      partialize: (state) => ({
        driverLeaseAgreement: state.driverLeaseAgreement,
        independentContractors: state.independentContractors,
        vehicleTypes: state.vehicleTypes,
        selectedItems: state.selectedItems,
        openSections: state.openSections
      })
    }
  )
);

export default useEligibilityStore;
