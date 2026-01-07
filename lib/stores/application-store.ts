import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Guarantor {
  fullName: string;
  phoneNumber: string;
  email?: string;
  relationship: string;
  residence: string;
  nidaNumber: string;
}

export interface ApplicationFormState {
  // Step 1: Taarifa Binafsi
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    phoneNumber: string;
    email: string;
    maritalStatus: string;
    nidaNumber: string;
    spouseName: string;
    residence: {
      street: string;
      houseNumber: string;
      ward: string;
      district: string;
      region: string;
      ownership: string;
    };
    employment: {
      status: string;
      companyName: string;
      address: string;
      position: string;
    };
  };

  // Step 2: Mkopo
  loanDetails: {
    loanTypeId: string;
    amount: string;
    existingLoan: string;
    purpose: string;
  };

  // Step 3: Dhamana
  collateral: {
    acknowledged: boolean;
    guarantors: Guarantor[];
  };

  // Step 4: Attachments (store file names or temp URLs if needed, actual upload logic separate)
  attachments: {
    nidaId: string | null;
    introLetter: string | null;
    collateralDoc: string | null;
  };

  // Step 5: Tamko
  declaration: {
    name: string;
    confirmed: boolean;
    date: string;
    signatureOtp: string;
  };

  applicationNumber: string;
  currentStep: number;
  
  // Actions
  setPersonalInfo: (data: Partial<ApplicationFormState['personalInfo']>) => void;
  setLoanDetails: (data: Partial<ApplicationFormState['loanDetails']>) => void;
  setCollateral: (data: Partial<ApplicationFormState['collateral']>) => void;
  addGuarantor: (guarantor: Guarantor) => void;
  removeGuarantor: (index: number) => void;
  setAttachments: (data: Partial<ApplicationFormState['attachments']>) => void;
  setDeclaration: (data: Partial<ApplicationFormState['declaration']>) => void;
  setApplicationNumber: (code: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;
}

const initialState = {
  personalInfo: {
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    maritalStatus: '',
    nidaNumber: '',
    spouseName: '',
    residence: {
      street: '',
      houseNumber: '',
      ward: '',
      district: '',
      region: '',
      ownership: '',
    },
    employment: {
      status: '',
      companyName: '',
      address: '',
      position: '',
    },
  },
  loanDetails: {
    loanTypeId: '',
    amount: '',
    existingLoan: '',
    purpose: '',
  },
  collateral: {
    acknowledged: false,
    guarantors: [],
  },
  attachments: {
    nidaId: null,
    introLetter: null,
    collateralDoc: null,
  },
  declaration: {
    name: '',
    confirmed: false,
    date: '',
    signatureOtp: '',
  },
  applicationNumber: '',
  currentStep: 1,
};

export const useApplicationStore = create<ApplicationFormState>()(
  persist(
    (set) => ({
      ...initialState,

      setPersonalInfo: (data) =>
        set((state) => ({
          personalInfo: { ...state.personalInfo, ...data },
        })),

      setLoanDetails: (data) =>
        set((state) => ({
          loanDetails: { ...state.loanDetails, ...data },
        })),

      setCollateral: (data) =>
        set((state) => ({
          collateral: { ...state.collateral, ...data },
        })),

      addGuarantor: (guarantor) =>
        set((state) => ({
          collateral: {
            ...state.collateral,
            guarantors: [...state.collateral.guarantors, guarantor],
          },
        })),

      removeGuarantor: (index) =>
        set((state) => ({
          collateral: {
            ...state.collateral,
            guarantors: state.collateral.guarantors.filter((_, i) => i !== index),
          },
        })),

      setAttachments: (data) =>
        set((state) => ({
          attachments: { ...state.attachments, ...data },
        })),

      setDeclaration: (data) =>
        set((state) => ({
          declaration: { ...state.declaration, ...data },
        })),
      setApplicationNumber: (code) =>
        set(() => ({
          applicationNumber: code,
        })),

      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
      resetForm: () => set({ ...initialState }),
    }),
    {
      name: 'application-form-storage',
    }
  )
);
