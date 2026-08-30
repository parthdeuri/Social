import { create } from "zustand";
import { persist } from 'zustand/middleware'

export const useUserStore = create(
    persist((set) => ({
        user: null,
        token: null,
        newMessages: [],
        activeChatUserId: null,
        setUser: (data) => set({ user: data }),
        setToken: (data) => set({ token: data }),
        addNewMessage: (senderId) => set((state) => ({ 
            newMessages: state.newMessages.includes(senderId) 
                ? state.newMessages 
                : [...state.newMessages, senderId] 
        })),
        removeNewMessage: (senderId) => set((state) => ({ 
            newMessages: state.newMessages.filter(id => id !== senderId) 
        })),
        setActiveChatUserId: (userId) => set({ activeChatUserId: userId }),
        clearMessages: () => set({ newMessages: [] })
    }),
        {
            name: "keep-user-data-"
        }
    ))
