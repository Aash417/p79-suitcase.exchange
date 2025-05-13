// import { API_URL_BACKPACK, WS_URL_BACKPACK } from '@/lib/env';
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// interface ApiState {
//    apiBaseUrl: string;
//    wsBaseUrl: string;
//    setApiBaseUrl: (url: string) => void;
//    setWsBaseUrl: (url: string) => void;
// }

// export const useApiStore = create<ApiState>()(
//    persist(
//       (set) => ({
//          apiBaseUrl: API_URL_BACKPACK,
//          wsBaseUrl: WS_URL_BACKPACK,
//          setApiBaseUrl: (url) => set({ apiBaseUrl: url }),
//          setWsBaseUrl: (url) => set({ wsBaseUrl: url }),
//       }),
//       { name: 'api-store' }
//    )
// );
