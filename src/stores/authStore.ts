import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { customerLogin, fetchCustomer, type ShopifyCustomer } from '@/lib/shopify';

interface AuthStore {
  accessToken: string | null;
  customer: ShopifyCustomer | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshCustomer: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      customer: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const result = await customerLogin(email, password);
          if ('errors' in result) {
            return { success: false, error: result.errors[0]?.message || 'Invalid credentials' };
          }
          set({ accessToken: result.accessToken });
          const customer = await fetchCustomer(result.accessToken);
          set({ customer });
          return { success: true };
        } catch {
          return { success: false, error: 'Something went wrong. Please try again.' };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => set({ accessToken: null, customer: null }),

      refreshCustomer: async () => {
        const { accessToken } = get();
        if (!accessToken) return;
        try {
          const customer = await fetchCustomer(accessToken);
          if (!customer) {
            set({ accessToken: null, customer: null });
          } else {
            set({ customer });
          }
        } catch {
          set({ accessToken: null, customer: null });
        }
      },
    }),
    {
      name: 'shopify-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
    }
  )
);
