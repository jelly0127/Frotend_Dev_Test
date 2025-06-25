import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface InitData {
  displayCart: boolean;
  updateDisplayCart: (displayCart: boolean) => void;
  displayOrders: boolean;
  updateDisplayOrders: (displayOrders: boolean) => void;
  count: number;
  increment: () => void;
  decrement: () => void;
}

// Create the store using Zustand with devtools middleware
const useInitStore = create<InitData>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      displayCart: false,
      updateDisplayCart: (displayCart: boolean) => set(() => ({ displayCart })),
      displayOrders: false,
      updateDisplayOrders: (displayOrders: boolean) => set(() => ({ displayOrders })),
    }),
    {
      name: 'initStore',
    }
  )
);

export default useInitStore;

