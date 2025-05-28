import { create } from 'zustand'
import { TableItem } from '@/types/table';

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
  showError: (message: string) => void
  closeResult: () => void

  // Reset
  resetForm: () => void
}

const initialState = {
  formData: {},
  errors: {},
  isModalOpen: false,
  modalMode: null,
  selectedItem: null,
  result: {
    isOpen: false,
    isSuccess: false,
    message: ''
  }
}

export const useDynamicFormStore = create<DynamicFormState>((set) => ({
  ...initialState,

  // Form actions
  setFormData: (data) => set({ formData: data }),
  setFieldValue: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value }
    })),
  setErrors: (errors) => set({ errors }),

  // Modal actions
  openCreateModal: () => set({
    isModalOpen: true,
    modalMode: 'create',
    selectedItem: null,
    formData: {},
    errors: {}
  }),
  openEditModal: (item) => set({
    isModalOpen: true,
    modalMode: 'edit',
    selectedItem: item,
    formData: item,
    errors: {}
  }),
  closeModal: () => set({
    isModalOpen: false,
    modalMode: null,
    selectedItem: null
  }),

  // Result actions
  showSuccess: (message) => set((state) => {
    console.log('showSuccess called, current state:', state);
    return {
      result: { isOpen: true, isSuccess: true, message },
      isModalOpen: state.isModalOpen
    };
  }),
  showError: (message) => set((state) => {
    console.log('showError called, current state:', state);
    return {
      result: { isOpen: true, isSuccess: false, message },
      isModalOpen: state.isModalOpen
    };
  }),
  closeResult: () => set((state) => {
    console.log('closeResult called, current state:', state);
    return {
      result: { isOpen: false, isSuccess: false, message: '' }
    };
  }),

  // Reset
  resetForm: () => set(initialState)
}))
