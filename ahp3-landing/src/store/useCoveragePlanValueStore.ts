import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define validation state
interface ValidationState {
  vehicles: {
    valid: boolean;
    errors: {
      lessThan10000?: string;
      between10000And26000?: string;
      moreThan26000?: string;
    };
  };
  ntlCoverageOptions: {
    valid: boolean;
    errors: {
      combinedSingleLimit?: string;
    };
  };
  vpdCoverageOptions: {
    valid: boolean;
    errors: {
      limit?: string;
      deductible?: string;
    };
  };
  effectiveDates: {
    valid: boolean;
    errors: {
      occupationalAccident?: string;
      nonTruckingLiability?: string;
      vehiclePhysicalDamage?: string;
    };
  };
  tivForVpd: {
    valid: boolean;
    errors: {
      powerUnitsCount?: string;
      powerUnitsTiv?: string;
      trailersCount?: string;
      trailersTiv?: string;
    };
  };
}

interface CoveragePlanValueState {
  // Vehicle counts
  vehicleCounts: {
    lessThan10000: string;
    between10000And26000: string;
    moreThan26000: string;
  };
  
  // NTL options
  ntlCombinedSingleLimit: string | null;
  
  // Power units and trailers for TIV
  powerUnits: { 
    units: string; 
    tiv: string;
  };
  trailers: { 
    units: string; 
    tiv: string;
  };
  
  // VPD options
  vpdLimit: string | null;
  vpdDeductible: string | null;
  
  // Effective dates
  effectiveDates: {
    occupationalAccident: string;
    nonTruckingLiability: string;
    vehiclePhysicalDamage: string;
  };
  
  // UI states that need to be persisted
  sameEffectiveDateForAll: boolean;
  setSameEffectiveDateForAll: (value: boolean) => void;
  
  // Accordion open states
  openSections: {
    unitsByState: boolean;
    vehicles: boolean;
    ntlCoverageOptions: boolean;
    tivForVpd: boolean;
    vpdCoverageOptions: boolean;
    effectiveDates: boolean;
  };
  
  // Validation state
  validation: ValidationState;
  
  // Actions - Vehicle counts
  setVehicleCount: (field: keyof CoveragePlanValueState['vehicleCounts'], value: string) => void;
  
  // Actions - NTL options
  setNtlCombinedSingleLimit: (value: string | null) => void;
  
  // Actions - TIV
  setPowerUnits: (field: 'units' | 'tiv', value: string) => void;
  setTrailers: (field: 'units' | 'tiv', value: string) => void;
  
  // Actions - VPD options
  setVpdLimit: (value: string | null) => void;
  setVpdDeductible: (value: string | null) => void;
  
  // Actions - Effective dates
  setEffectiveDate: (coverage: keyof CoveragePlanValueState['effectiveDates'], value: string) => void;
  
  // Actions - UI state
  setOpenSection: (section: keyof CoveragePlanValueState['openSections'], isOpen: boolean) => void;
  
  // Validation actions
  validateVehicles: () => boolean;
  validateNtlCoverageOptions: () => boolean;
  validateVpdCoverageOptions: () => boolean;
  validateEffectiveDates: () => boolean;
  validateTivForVpd: () => boolean;
  validateAll: () => boolean;
  
  reset: () => void;
}

// Initial state
const initialState = {
  // Vehicle counts
  vehicleCounts: {
    lessThan10000: '',
    between10000And26000: '',
    moreThan26000: ''
  },
  
  // NTL options
  ntlCombinedSingleLimit: null,
  
  // Power units and trailers for TIV
  powerUnits: {
    units: '',
    tiv: '$0.00'
  },
  trailers: {
    units: '',
    tiv: '$0.00'
  },
  
  // VPD options
  vpdLimit: null,
  vpdDeductible: null,
  
  // Effective dates
  effectiveDates: {
    occupationalAccident: '',
    nonTruckingLiability: '',
    vehiclePhysicalDamage: ''
  },
  
  // UI states
  sameEffectiveDateForAll: false,
  
  // Accordion open states
  openSections: {
    unitsByState: true,
    vehicles: true,
    ntlCoverageOptions: true,
    tivForVpd: true,
    vpdCoverageOptions: true,
    effectiveDates: true
  },
  
  // Validation state
  validation: {
    vehicles: {
      valid: false,
      errors: {}
    },
    ntlCoverageOptions: {
      valid: false,
      errors: {}
    },
    vpdCoverageOptions: {
      valid: false,
      errors: {}
    },
    effectiveDates: {
      valid: false,
      errors: {}
    },
    tivForVpd: {
      valid: false,
      errors: {}
    }
  }
};

// Create the store
const useCoveragePlanValueStore = create<CoveragePlanValueState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Actions - Vehicle counts
      setVehicleCount: (field, value) => set((state) => ({
        vehicleCounts: {
          ...state.vehicleCounts,
          [field]: value
        }
      })),
      
      // Actions - NTL options
      setNtlCombinedSingleLimit: (value) => set({ ntlCombinedSingleLimit: value }),
      
      // Actions - TIV
      setPowerUnits: (field, value) => set((state) => ({
        powerUnits: {
          ...state.powerUnits,
          [field]: value
        }
      })),
      
      setTrailers: (field, value) => set((state) => ({
        trailers: {
          ...state.trailers,
          [field]: value
        }
      })),
      
      // Actions - VPD options
      setVpdLimit: (value) => set({ vpdLimit: value }),
      setVpdDeductible: (value) => set({ vpdDeductible: value }),
      
      // Actions - Effective dates
      setEffectiveDate: (coverage, value) => set((state) => ({
        effectiveDates: {
          ...state.effectiveDates,
          [coverage]: value
        }
      })),
      
      // Same effective date toggle
      setSameEffectiveDateForAll: (value) => set({ sameEffectiveDateForAll: value }),
      
      // Actions - UI state
      setOpenSection: (section, isOpen) => set((state) => ({
        openSections: {
          ...state.openSections,
          [section]: isOpen
        }
      })),
      
      // Validation actions
      validateVehicles: () => {
        const state = get();
        const errors: ValidationState['vehicles']['errors'] = {};
        let valid = true;
        
        // Check if at least one of the vehicle fields has a value
        if (!state.vehicleCounts.lessThan10000 && 
            !state.vehicleCounts.between10000And26000 && 
            !state.vehicleCounts.moreThan26000) {
          errors.lessThan10000 = 'At least one vehicle count is required';
          errors.between10000And26000 = 'At least one vehicle count is required';
          errors.moreThan26000 = 'At least one vehicle count is required';
          valid = false;
        }
        
        // Update state with validation results
        set((state) => ({
          validation: {
            ...state.validation,
            vehicles: {
              valid,
              errors
            }
          }
        }));
        
        return valid;
      },
      
      validateNtlCoverageOptions: () => {
        const state = get();
        const errors: ValidationState['ntlCoverageOptions']['errors'] = {};
        let valid = true;
        
        // Check if a Combined Single Limit option is selected
        if (state.ntlCombinedSingleLimit === null || 
            state.ntlCombinedSingleLimit === undefined ||
            state.ntlCombinedSingleLimit === '') {
          errors.combinedSingleLimit = 'Please select a Combined Single Limit option';
          valid = false;
        }
        
        // Update state with validation results
        set((state) => ({
          validation: {
            ...state.validation,
            ntlCoverageOptions: {
              valid,
              errors
            }
          }
        }));
        
        return valid;
      },
      
      validateTivForVpd: () => {
        const state = get();
        const errors: ValidationState['tivForVpd']['errors'] = {};
        let valid = true;
        
        // Check Power Units
        if (!state.powerUnits.units || state.powerUnits.units === '0') {
          errors.powerUnitsCount = 'Number of power units is required';
          valid = false;
        }
        
        if (state.powerUnits.tiv === '$0.00' || !state.powerUnits.tiv) {
          errors.powerUnitsTiv = 'TIV for power units is required';
          valid = false;
        }
        
        // Check Trailers
        if (!state.trailers.units || state.trailers.units === '0') {
          errors.trailersCount = 'Number of trailers is required';
          valid = false;
        }
        
        if (state.trailers.tiv === '$0.00' || !state.trailers.tiv) {
          errors.trailersTiv = 'TIV for trailers is required';
          valid = false;
        }
        
        // Update state with validation results
        set((state) => ({
          validation: {
            ...state.validation,
            tivForVpd: {
              valid,
              errors
            }
          }
        }));
        
        return valid;
      },

      validateVpdCoverageOptions: () => {
        const state = get();
        const errors: ValidationState['vpdCoverageOptions']['errors'] = {};
        let valid = true;
        
        // Check if a VPD Limit option is selected
        if (state.vpdLimit === null || 
            state.vpdLimit === undefined ||
            state.vpdLimit === '') {
          errors.limit = 'Please select a Limit option';
          valid = false;
        }
        
        // Check if a VPD Deductible option is selected
        if (state.vpdDeductible === null || 
            state.vpdDeductible === undefined ||
            state.vpdDeductible === '') {
          errors.deductible = 'Please select a Deductible option';
          valid = false;
        }
        
        // Update state with validation results
        set((state) => ({
          validation: {
            ...state.validation,
            vpdCoverageOptions: {
              valid,
              errors
            }
          }
        }));
        
        return valid;
      },
      
      validateEffectiveDates: () => {
        const state = get();
        const errors: ValidationState['effectiveDates']['errors'] = {};
        let valid = true;
        
        // Check if at least one effective date is provided
        const hasOccupationalAccidentDate = state.effectiveDates.occupationalAccident && 
                                           state.effectiveDates.occupationalAccident !== '' &&
                                           state.effectiveDates.occupationalAccident !== 'mm/dd/yyyy';
        
        const hasNonTruckingLiabilityDate = state.effectiveDates.nonTruckingLiability && 
                                           state.effectiveDates.nonTruckingLiability !== '' &&
                                           state.effectiveDates.nonTruckingLiability !== 'mm/dd/yyyy';
                                           
        const hasVehiclePhysicalDamageDate = state.effectiveDates.vehiclePhysicalDamage && 
                                            state.effectiveDates.vehiclePhysicalDamage !== '' &&
                                            state.effectiveDates.vehiclePhysicalDamage !== 'mm/dd/yyyy';
        
        // If none of the dates are provided, show error message
        if (!hasOccupationalAccidentDate && !hasNonTruckingLiabilityDate && !hasVehiclePhysicalDamageDate) {
          errors.occupationalAccident = 'At least one effective date is required';
          errors.nonTruckingLiability = 'At least one effective date is required';
          errors.vehiclePhysicalDamage = 'At least one effective date is required';
          valid = false;
        }
        
        // Update state with validation results
        set((state) => ({
          validation: {
            ...state.validation,
            effectiveDates: {
              valid,
              errors
            }
          }
        }));
        
        return valid;
      },
      
      validateAll: () => {
        const { validateVehicles, validateNtlCoverageOptions, validateVpdCoverageOptions, validateEffectiveDates, validateTivForVpd } = get();
        
        // Run all validations
        const isVehiclesValid = validateVehicles();
        const isNtlValid = validateNtlCoverageOptions();
        const isVpdValid = validateVpdCoverageOptions();
        const isEffectiveDatesValid = validateEffectiveDates();
        const isTivValid = validateTivForVpd();
        
        // Return true only if all validations pass
        return isVehiclesValid && isNtlValid && isVpdValid && isEffectiveDatesValid && isTivValid;
      },
      
      reset: () => set(initialState)
    }),
    {
      name: 'coverage-plan-value-storage', // name of the item in the storage (must be unique)
      // Optional configuration for storage
      partialize: (state) => ({
        vehicleCounts: state.vehicleCounts,
        ntlCombinedSingleLimit: state.ntlCombinedSingleLimit,
        powerUnits: state.powerUnits,
        trailers: state.trailers,
        vpdLimit: state.vpdLimit,
        vpdDeductible: state.vpdDeductible,
        effectiveDates: state.effectiveDates,
        sameEffectiveDateForAll: state.sameEffectiveDateForAll,
        openSections: state.openSections
      })
    }
  )
);

export default useCoveragePlanValueStore;
