import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    isAuthenticated: boolean;
    pin: string;
    login: (inputPin: string) => boolean;
    logout: () => void;
}

// PIN por defecto: 1234
const DEFAULT_PIN = '1234';

export const useAuth = create<AuthState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            pin: DEFAULT_PIN,

            login: (inputPin: string) => {
                const isValid = inputPin === get().pin;
                if (isValid) {
                    set({ isAuthenticated: true });
                }
                return isValid;
            },

            logout: () => {
                set({ isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
        }
    )
);
