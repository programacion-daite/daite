import { create } from 'zustand'

interface FormState {
  formData: Record<string, any>
  errors: Record<string, string>
  setFormData: (data: Record<string, any>) => void
  setFieldValue: (field: string, value: any) => void
  setErrors: (errors: Record<string, string>) => void
  clearForm: () => void
}

export const useFormStore = create<FormState>((set) => ({
  formData: {},
  errors: {},
  setFormData: (data) => set({ formData: data }),
  setFieldValue: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value }
    })),
  setErrors: (errors) => set({ errors }),
  clearForm: () => set({ formData: {}, errors: {} }),
}))
