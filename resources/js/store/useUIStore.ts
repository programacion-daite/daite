import { create } from 'zustand'

interface UIState {
  isModalOpen: boolean
  activeModal: string | null
  isLoading: boolean
  setModalOpen: (isOpen: boolean) => void
  setActiveModal: (modalName: string | null) => void
  setLoading: (isLoading: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  activeModal: null,
  isLoading: false,
  isModalOpen: false,
  setActiveModal: (modalName) => set({ activeModal: modalName }),
  setLoading: (isLoading) => set({ isLoading }),
  setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
}))
