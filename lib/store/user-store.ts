import { create } from "zustand";

interface UserData {
    ordersCount: number;
    unreadNotifications: number;
    walletBalance: number;
    isLoading: boolean;
}

interface UserDataStore extends UserData {
    fetchUserData: (userId: string, forceRefresh?: boolean) => Promise<void>;
    refreshUserData: (userId: string) => Promise<void>;
    resetUserData: () => void;
}

let cachedData: UserData | null = null;
let cacheTimestamp = 0;

const CACHE_DURATION = 30000;

const initialUserData: UserData = {
    ordersCount: 0,
    unreadNotifications: 0,
    walletBalance: 0,
    isLoading: false,   
};

export const useUserDataStore = create<UserDataStore>((set, get) => ({
    ...initialUserData,

    fetchUserData: async (userId: string, forceRefresh = false) => {
        if (!userId) {
            set(initialUserData);
            return;
        }

        const now = Date.now();
        if (!forceRefresh && cachedData && now - cacheTimestamp < CACHE_DURATION) {
            set(cachedData);
            return;
        }

        set({ isLoading: true });

        try {
            const response = await fetch("/api/user/combined-data", {
                headers: { "Content-Type": "application/json" },
                cache: "no-store"
            });

            if (response.ok) {
                const data = await response.json();

                const newUserData: UserData = {
                    ordersCount: data.ordersCount || 0,
                    unreadNotifications: data.unreadNotifications || 0,
                    walletBalance: data.walletBalance || 0,
                    isLoading: false,
                };

                cachedData = newUserData;
                cacheTimestamp = now;

                set(newUserData);
            } else if (response.status === 401) {
                set({ ...initialUserData, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            set({ ...initialUserData, isLoading: false });
        }
    },

    refreshUserData: async (userId: string) => {
        await get().fetchUserData(userId, true);
    },

    resetUserData: () => {
        set(initialUserData);
        cachedData = null;
        cacheTimestamp = 0;
    }
}))