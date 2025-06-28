import { create } from 'zustand'

import { TableItem } from '@/types/table';

type Error = {
  title: string
  message: string
}

interface DynamicFormState {
  // Form state
  formData: Record<string, unknown>
  errors: Record<string, string>

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
}

const initialState = {
  errors: {},
  formData: {},
  isModalOpen: false,
  modalMode: null,
  result: {
    errors: [],
    isOpen: false,
    isSuccess: false,
    message: ''
  },
  selectedItem: null
}

export const useDynamicFormStore = create<DynamicFormState>((set) => ({
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
  openCreateModal: () => set({
    errors: {},
    formData: {},
    isModalOpen: true,
    modalMode: 'create',
    selectedItem: null
  }),

  openEditModal: (item) => {
    const formattedData = Object.entries(item).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: value !== null && value !== undefined ? String(value) : ''
    }), {});

    set({
      errors: {},
      formData: formattedData,
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
  })
}))
