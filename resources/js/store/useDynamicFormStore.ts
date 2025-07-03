import { create } from 'zustand'

import { TableItem } from '@/types/table';
import { DatabaseField, FormDataType } from '@/types/form';

type Error = {
  title: string
  message: string
}

interface DynamicFormState {
  // Form state
  formData: Record<string, unknown>
  errors: Record<string, string>
  initialData: FormDataType
  dbFields: DatabaseField[]

  // Modal state
  isModalOpen: boolean
  modalMode: 'create' | 'edit' | null
  selectedItem: TableItem | null

  // Result state
  result: {
    isOpen: boolean
    isSuccess: boolean
    message: string
    errors: Error[]
  }

  // Actions
  setFormData: (data: Record<string, unknown>) => void
  setFieldValue: (field: string, value: unknown) => void
  setErrors: (errors: Record<string, string>) => void
  setInitialData: (data: FormDataType) => void
  generateInitialData: () => FormDataType

  // Modal actions
  openCreateModal: () => void
  openEditModal: (item: TableItem) => void
  closeModal: () => void

  // Result actions
  showSuccess: (message: string) => void
  showError: (message: string, errors?: Error[]) => void
  closeResult: () => void

  // Reset
  resetForm: () => void

  focusField: string
  setFocusField: (field: string) => void
  clearFocusField: () => void
}

const initialState = {
  errors: {},
  formData: {},
  initialData: {},
  dbFields: [],
  isModalOpen: false,
  modalMode: null,
  result: {
    errors: [],
    isOpen: false,
    isSuccess: false,
    message: ''
  },
  selectedItem: null,
  focusField: ''
}

export const useDynamicFormStore = create<DynamicFormState>((set, get) => ({
  ...initialState,

  closeModal: () => set({
    isModalOpen: false,
    modalMode: null,
    selectedItem: null
  }),
  closeResult: () => set((state) => {
    console.log('closeResult called, current state:', state);
    return {
      result: { errors: [], isOpen: false, isSuccess: false, message: '' }
    };
  }),

  // Modal actions
  openCreateModal: () => {
    const { generateInitialData } = get();
    set({
      errors: {},
      formData: {},
      initialData: generateInitialData(),
      isModalOpen: true,
      modalMode: 'create',
      selectedItem: null
    });
  },

  openEditModal: (item) => {
    const formattedData = Object.entries(item).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: value
    }), {});

    set({
      errors: {},
      formData: formattedData,
      initialData: formattedData,
      isModalOpen: true,
      modalMode: 'edit',
      selectedItem: item
    });
  },

  // Reset
  resetForm: () => set(initialState),
  setErrors: (errors) => set({ errors }),

  setFieldValue: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value }
    })),

  // Form actions
  setFormData: (data) => set({ formData: data }),

  setInitialData: (data) => set({ initialData: data }),

  generateInitialData: () => {
    const { modalMode, formData } = get();

    if (modalMode === 'edit' && formData) {
      return formData as FormDataType;
    }

    return {};
  },

  showError: (message, errors = []) => set((state) => {
    return {
      isModalOpen: state.isModalOpen,
      result: { errors, isOpen: true, isSuccess: false, message }
    };
  }),

  // Result actions
  showSuccess: (message) => set((state) => {
    return {
      isModalOpen: state.isModalOpen,
      result: { errors: [], isOpen: true, isSuccess: true, message }
    };
  }),

  focusField: '',
  setFocusField: (field) => set({ focusField: field }),
  clearFocusField: () => set({ focusField: '' })
}))

// Nuevo store global para el ResultModal
export type ResultModalError = {
  title: string;
  message: string;
};

interface ResultModalState {
  isOpen: boolean;
  isSuccess: boolean;
  message: string;
  errors: ResultModalError[];
  status: 'success' | 'error';
  focusField: string;
  openResult: (payload: { message: string; errors?: ResultModalError[]; status: 'success' | 'error'; focusField?: string }) => void;
  closeResult: () => void;
  clearFocusField: () => void;
}

const initialResultState = {
  isOpen: false,
  isSuccess: false,
  message: '',
  errors: [],
  status: 'success' as 'success' | 'error',
  focusField: '',
};

export const useResultModalStore = create<ResultModalState>((set) => ({
  ...initialResultState,
  openResult: ({ message, errors = [], status, focusField = '' }) =>
    set({
      isOpen: true,
      isSuccess: status === 'success',
      message,
      errors,
      status,
      focusField,
    }),
  closeResult: () => set(initialResultState),
  clearFocusField: () => set({ focusField: '' }),
}));
