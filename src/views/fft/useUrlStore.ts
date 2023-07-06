import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {DEFAULT_STATS_URL} from "../../constants"
interface UrlState {
  url: string;
  newUrl: string;
  setUrl: (newUrl: string) => void;
  setNewUrl: (newUrl: string) => void;
}

export const useUrlStore = create<UrlState>()(
  devtools(
    persist(
      (set) => ({
        url: DEFAULT_STATS_URL,
        newUrl: DEFAULT_STATS_URL,
        setUrl: (newUrl: string) => set({ url: newUrl }),
        setNewUrl: (newUrl: string) => set({ newUrl }),
      }),
      {
        name: 'bear-storage2',
      },
    ),
  ),
);
