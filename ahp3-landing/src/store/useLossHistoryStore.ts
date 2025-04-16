import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define types for our state
interface DateFields {
  lossRunEvaluation: string;
  anniversary: string;
  inception?: string;
}

interface CoveredData {
  current: string;
  prior: string;
  third: string;
}

interface ClaimsData {
  incurred: string;
  totalLosses: string;
}

// Define validation state
interface ValidationState {
  occupationalAccident: {
    valid: boolean;
    errors: {
      inPlace?: string;
      lossRunEvaluation?: string;
      anniversary?: string;
      current?: string;
      prior?: string;
      third?: string;
      claims?: string;
      incurred?: string;
      totalLosses?: string;
    };
  };
  nonTruckingLiability: {
    valid: boolean;
    errors: {
      inPlace?: string;
      lossRunEvaluation?: string;
      anniversary?: string;
      current?: string;
      prior?: string;
      third?: string;
      claims?: string;
      incurred?: string;
      totalLosses?: string;
    };
  };
  vehiclePhysicalDamage: {
    valid: boolean;
    errors: {
      inPlace?: string;
      inception?: string;
      lossRunEvaluation?: string;
      anniversary?: string;
      current?: string;
      prior?: string;
      third?: string;
      claims?: string;
      incurred?: string;
      totalLosses?: string;
    };
  };
}

interface LossHistoryState {
  // Accordion state
  openSections: {
    occupationalAccident: boolean;
    nonTruckingLiability: boolean;
    vehiclePhysicalDamage: boolean;
  };
  
  // Coverage in place states
  occupationalAccidentInPlace: string | null;
  nonTruckingLiabilityInPlace: string | null;
  vehiclePhysicalDamageInPlace: string | null;
  
  // Claims states
  occupationalAccidentClaims: string | null;
  nonTruckingLiabilityClaims: string | null;
  vehiclePhysicalDamageClaims: string | null;
  
  // Date fields
  dates: {
    occupationalAccident: DateFields;
    nonTruckingLiability: DateFields;
    vehiclePhysicalDamage: DateFields & { inception: string };
  };
  
  // Covered lives/units data
  coveredData: {
    occupationalAccident: CoveredData;
    nonTruckingLiability: CoveredData;
    vehiclePhysicalDamage: CoveredData;
  };
  
  // Claims data
  claimsData: {
    occupationalAccident: ClaimsData;
    nonTruckingLiability: ClaimsData;
    vehiclePhysicalDamage: ClaimsData;
  };
  
  // Validation state
  validation: ValidationState;
  
  // Actions - UI state
  setOpenSection: (section: keyof LossHistoryState['openSections'], isOpen: boolean) => void;
  
  // Occupational Accident specific actions
  setOccupationalAccidentInPlace: (value: string | null) => void;
  setOccupationalAccidentClaims: (value: string | null) => void;
  updateOccupationalAccidentDate: (field: keyof DateFields, value: string) => void;
  updateOccupationalAccidentCoveredData: (field: keyof CoveredData, value: string) => void;
  updateOccupationalAccidentClaimsData: (field: keyof ClaimsData, value: string) => void;
  
  // Non-Trucking Liability specific actions
  setNonTruckingLiabilityInPlace: (value: string | null) => void;
  setNonTruckingLiabilityClaims: (value: string | null) => void;
  updateNonTruckingLiabilityDate: (field: keyof DateFields, value: string) => void;
  updateNonTruckingLiabilityCoveredData: (field: keyof CoveredData, value: string) => void;
  updateNonTruckingLiabilityClaimsData: (field: keyof ClaimsData, value: string) => void;
  
  // Vehicle Physical Damage specific actions
  setVehiclePhysicalDamageInPlace: (value: string | null) => void;
  setVehiclePhysicalDamageClaims: (value: string | null) => void;
  updateVehiclePhysicalDamageDate: (field: keyof DateFields | 'inception', value: string) => void;
  updateVehiclePhysicalDamageCoveredData: (field: keyof CoveredData, value: string) => void;
  updateVehiclePhysicalDamageClaimsData: (field: keyof ClaimsData, value: string) => void;
  
  // Validation actions
  validateOccupationalAccident: () => void;
  validateNonTruckingLiability: () => void;
  validateVehiclePhysicalDamage: () => void;
  validateAll: () => boolean;
  
  reset: () => void;
}

// Initial state values
const initialState = {
  // Accordion state
  openSections: {
    occupationalAccident: true,
    nonTruckingLiability: true,
    vehiclePhysicalDamage: true
  },
  
  // Coverage in place states
  occupationalAccidentInPlace: null,
  nonTruckingLiabilityInPlace: null,
  vehiclePhysicalDamageInPlace: null,
  
  // Claims states
  occupationalAccidentClaims: null,
  nonTruckingLiabilityClaims: null,
  vehiclePhysicalDamageClaims: null,
  
  // Date fields
  dates: {
    occupationalAccident: { lossRunEvaluation: '', anniversary: '' },
    nonTruckingLiability: { lossRunEvaluation: '', anniversary: '' },
    vehiclePhysicalDamage: { inception: '', lossRunEvaluation: '', anniversary: '' }
  },
  
  // Covered lives/units data
  coveredData: {
    occupationalAccident: { current: '', prior: '', third: '' },
    nonTruckingLiability: { current: '', prior: '', third: '' },
    vehiclePhysicalDamage: { current: '', prior: '', third: '' }
  },
  
  // Claims data
  claimsData: {
    occupationalAccident: { incurred: '', totalLosses: '' },
    nonTruckingLiability: { incurred: '', totalLosses: '' },
    vehiclePhysicalDamage: { incurred: '', totalLosses: '' }
  },
  
  // Initialize validation state
  validation: {
    occupationalAccident: {
      valid: false,
      errors: {}
    },
    nonTruckingLiability: {
      valid: false,
      errors: {}
    },
    vehiclePhysicalDamage: {
      valid: false,
      errors: {}
    }
  }
};

  // Create the store
const useLossHistoryStore = create<LossHistoryState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Actions - UI state
      setOpenSection: (section, isOpen) => set((state) => ({
        openSections: {
          ...state.openSections,
          [section]: isOpen
        }
      })),
      
      // Occupational Accident specific actions
      setOccupationalAccidentInPlace: (value) => set({ occupationalAccidentInPlace: value }),
      setOccupationalAccidentClaims: (value) => set({ occupationalAccidentClaims: value }),
      
      updateOccupationalAccidentDate: (field, value) => set((state) => ({
        dates: {
          ...state.dates,
          occupationalAccident: {
            ...state.dates.occupationalAccident,
            [field]: value
          }
        }
      })),
      
      updateOccupationalAccidentCoveredData: (field, value) => set((state) => ({
        coveredData: {
          ...state.coveredData,
          occupationalAccident: {
            ...state.coveredData.occupationalAccident,
            [field]: value
          }
        }
      })),
      
      updateOccupationalAccidentClaimsData: (field, value) => set((state) => ({
        claimsData: {
          ...state.claimsData,
          occupationalAccident: {
            ...state.claimsData.occupationalAccident,
            [field]: value
          }
        }
      })),
      
      // Non-Trucking Liability specific actions
      setNonTruckingLiabilityInPlace: (value) => set({ nonTruckingLiabilityInPlace: value }),
      setNonTruckingLiabilityClaims: (value) => set({ nonTruckingLiabilityClaims: value }),
      
      updateNonTruckingLiabilityDate: (field, value) => set((state) => ({
        dates: {
          ...state.dates,
          nonTruckingLiability: {
            ...state.dates.nonTruckingLiability,
            [field]: value
          }
        }
      })),
      
      updateNonTruckingLiabilityCoveredData: (field, value) => set((state) => ({
        coveredData: {
          ...state.coveredData,
          nonTruckingLiability: {
            ...state.coveredData.nonTruckingLiability,
            [field]: value
          }
        }
      })),
      
      updateNonTruckingLiabilityClaimsData: (field, value) => set((state) => ({
        claimsData: {
          ...state.claimsData,
          nonTruckingLiability: {
            ...state.claimsData.nonTruckingLiability,
            [field]: value
          }
        }
      })),
      
      // Vehicle Physical Damage specific actions
      setVehiclePhysicalDamageInPlace: (value) => set({ vehiclePhysicalDamageInPlace: value }),
      setVehiclePhysicalDamageClaims: (value) => set({ vehiclePhysicalDamageClaims: value }),
      
      updateVehiclePhysicalDamageDate: (field, value) => set((state) => ({
        dates: {
          ...state.dates,
          vehiclePhysicalDamage: {
            ...state.dates.vehiclePhysicalDamage,
            [field]: value
          }
        }
      })),
      
      updateVehiclePhysicalDamageCoveredData: (field, value) => set((state) => ({
        coveredData: {
          ...state.coveredData,
          vehiclePhysicalDamage: {
            ...state.coveredData.vehiclePhysicalDamage,
            [field]: value
          }
        }
      })),
      
      updateVehiclePhysicalDamageClaimsData: (field, value) => set((state) => ({
        claimsData: {
          ...state.claimsData,
          vehiclePhysicalDamage: {
            ...state.claimsData.vehiclePhysicalDamage,
            [field]: value
          }
        }
      })),
      
      // Validation functions
      validateOccupationalAccident: () => set(state => {
        const errors: ValidationState['occupationalAccident']['errors'] = {};
        let valid = true;
        
        // Validate 'inPlace' radio selection
        if (!state.occupationalAccidentInPlace) {
          errors.inPlace = "Please select whether Occupational Accident coverage is currently in place";
          valid = false;
        }
        
        // If "Yes" is selected for inPlace
        if (state.occupationalAccidentInPlace === 'yes') {
          // Validate date fields
          if (!state.dates.occupationalAccident.lossRunEvaluation) {
            errors.lossRunEvaluation = "Loss run evaluation date is required";
            valid = false;
          }
          
          if (!state.dates.occupationalAccident.anniversary) {
            errors.anniversary = "Anniversary date is required";
            valid = false;
          }
          
          // Validate current policy year (required)
          if (!state.coveredData.occupationalAccident.current) {
            errors.current = "Current policy year is required";
            valid = false;
          } else if (!/^\d{4}$/.test(state.coveredData.occupationalAccident.current)) {
            errors.current = "Please enter a valid year in YYYY format";
            valid = false;
          }
          
          // Validate prior policy year if provided
          if (state.coveredData.occupationalAccident.prior && 
              !/^\d{4}$/.test(state.coveredData.occupationalAccident.prior)) {
            errors.prior = "Please enter a valid year in YYYY format";
            valid = false;
          }
          
          // Validate 3rd policy year if provided
          if (state.coveredData.occupationalAccident.third && 
              !/^\d{4}$/.test(state.coveredData.occupationalAccident.third)) {
            errors.third = "Please enter a valid year in YYYY format";
            valid = false;
          }
        }
        
        // Validate 'claims' radio selection
        if (!state.occupationalAccidentClaims) {
          errors.claims = "Please select whether there have been any claims";
          valid = false;
        }
        
        // If "Yes" is selected for claims
        if (state.occupationalAccidentClaims === 'yes') {
          // Validate incurred claims (must be a number)
          if (!state.claimsData.occupationalAccident.incurred) {
            errors.incurred = "Number of incurred claims is required";
            valid = false;
          } else if (!/^\d+$/.test(state.claimsData.occupationalAccident.incurred)) {
            errors.incurred = "Please enter a valid number";
            valid = false;
          }
          
          // Validate total losses (must be a currency amount)
          if (!state.claimsData.occupationalAccident.totalLosses) {
            errors.totalLosses = "Total losses paid is required";
            valid = false;
          } else if (!/^\$?[\d,]+(\.\d{0,2})?$/.test(state.claimsData.occupationalAccident.totalLosses)) {
            errors.totalLosses = "Please enter a valid currency amount";
            valid = false;
          }
        }
        
        return {
          validation: {
            ...state.validation,
            occupationalAccident: {
              valid,
              errors
            }
          }
        };
      }),
      
      validateNonTruckingLiability: () => set(state => {
        const errors: ValidationState['nonTruckingLiability']['errors'] = {};
        let valid = true;
        
        // Validate 'inPlace' radio selection
        if (!state.nonTruckingLiabilityInPlace) {
          errors.inPlace = "Please select whether Non-Trucking Liability coverage is currently in place";
          valid = false;
        }
        
        // For this section, we'll keep validation simple (can be expanded later)
        
        return {
          validation: {
            ...state.validation,
            nonTruckingLiability: {
              valid,
              errors
            }
          }
        };
      }),
      
      validateVehiclePhysicalDamage: () => set(state => {
        const errors: ValidationState['vehiclePhysicalDamage']['errors'] = {};
        let valid = true;
        
        // Validate 'inPlace' radio selection
        if (!state.vehiclePhysicalDamageInPlace) {
          errors.inPlace = "Please select whether Vehicle Physical Damage coverage is currently in place";
          valid = false;
        }
        
        // For this section, we'll keep validation simple (can be expanded later)
        
        return {
          validation: {
            ...state.validation,
            vehiclePhysicalDamage: {
              valid,
              errors
            }
          }
        };
      }),
      
      validateAll: (): boolean => {
        // Use a different approach to avoid circular reference
        // First validate all sections
        set((state) => {
          // Internal validation logic - duplicated but avoids circular reference
          const occupationalAccidentErrors: Record<string, string> = {};
          let occupationalAccidentValid = true;
          
          if (!state.occupationalAccidentInPlace) {
            occupationalAccidentErrors.inPlace = "Please select whether Occupational Accident coverage is currently in place";
            occupationalAccidentValid = false;
          }
          
          const nonTruckingLiabilityErrors: Record<string, string> = {};
          let nonTruckingLiabilityValid = true;
          
          if (!state.nonTruckingLiabilityInPlace) {
            nonTruckingLiabilityErrors.inPlace = "Please select whether Non-Trucking Liability coverage is currently in place";
            nonTruckingLiabilityValid = false;
          }
          
          const vehiclePhysicalDamageErrors: Record<string, string> = {};
          let vehiclePhysicalDamageValid = true;
          
          if (!state.vehiclePhysicalDamageInPlace) {
            vehiclePhysicalDamageErrors.inPlace = "Please select whether Vehicle Physical Damage coverage is currently in place";
            vehiclePhysicalDamageValid = false;
          }
          
          return {
            validation: {
              occupationalAccident: {
                valid: occupationalAccidentValid,
                errors: occupationalAccidentErrors
              },
              nonTruckingLiability: {
                valid: nonTruckingLiabilityValid,
                errors: nonTruckingLiabilityErrors
              },
              vehiclePhysicalDamage: {
                valid: vehiclePhysicalDamageValid,
                errors: vehiclePhysicalDamageErrors
              }
            }
          };
        });
        
        // Get state after validation to check results
        const currentState = get();
        
        // Check if all sections are valid
        return currentState.validation.occupationalAccident.valid &&
               currentState.validation.nonTruckingLiability.valid &&
               currentState.validation.vehiclePhysicalDamage.valid;
      },
      
      reset: () => set(initialState)
    }),
    {
      name: 'loss-history-storage', // name of the item in the storage (must be unique)
      // Optional configuration for storage
      partialize: (state) => ({
        openSections: state.openSections,
        occupationalAccidentInPlace: state.occupationalAccidentInPlace,
        nonTruckingLiabilityInPlace: state.nonTruckingLiabilityInPlace,
        vehiclePhysicalDamageInPlace: state.vehiclePhysicalDamageInPlace,
        occupationalAccidentClaims: state.occupationalAccidentClaims,
        nonTruckingLiabilityClaims: state.nonTruckingLiabilityClaims,
        vehiclePhysicalDamageClaims: state.vehiclePhysicalDamageClaims,
        dates: state.dates,
        coveredData: state.coveredData,
        claimsData: state.claimsData
      })
    }
  )
);

export default useLossHistoryStore;
