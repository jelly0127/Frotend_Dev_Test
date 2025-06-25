'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

// Order item interface
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  image?: string;
  description?: string;
}

// Order interface
export interface Order {
  orderId: string;
  items: OrderItem[];
  totalQuantity: number;
  totalAmount: number;
  orderTime: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  isLoading: boolean;
  // Add order history
  orders: Order[];
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'DECREASE_QUANTITY'; payload: { id: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_ORDER'; payload: Order };

export interface CartContextValue extends CartState {
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  checkout: () => Promise<{ success: boolean; orderId?: string; error?: string }>;
  // Add order related methods
  getOrderById: (orderId: string) => Order | undefined;
  getOrderHistory: () => Order[];
  cancelOrder: (orderId: string) => void;
}

// initial state
const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  isLoading: false,
  orders: [], // Initialize order history
};

// calculate totals
const calculateTotals = (items: CartItem[]) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { totalQuantity, totalAmount };
};

// Create order record from cart
const createOrderFromCart = (cartItems: CartItem[], orderId: string): Order => {
  const orderItems: OrderItem[] = cartItems.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    totalPrice: item.price * item.quantity,
    image: item.image,
    description: item.description,
  }));

  const { totalQuantity, totalAmount } = calculateTotals(cartItems);

  return {
    orderId,
    items: orderItems,
    totalQuantity,
    totalAmount,
    orderTime: new Date().toISOString(),
    status: 'completed',
  };
};

// reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { quantity = 1, ...itemData } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === itemData.id);

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // if item already exists, increase quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // if new item, add to cart
        newItems = [...state.items, { ...itemData, quantity }];
      }

      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload.id);
      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        // if quantity is 0 or negative, remove item
        const newItems = state.items.filter(item => item.id !== id);
        const totals = calculateTotals(newItems);
        return {
          ...state,
          items: newItems,
          ...totals,
        };
      }

      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }

    case 'DECREASE_QUANTITY': {
      const { id } = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      if (!existingItem) return state;

      if (existingItem.quantity <= 1) {
        // if quantity is 1, remove item
        const newItems = state.items.filter(item => item.id !== id);
        const totals = calculateTotals(newItems);
        return {
          ...state,
          items: newItems,
          ...totals,
        };
      }

      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders], // Put new order at the front
      };

    default:
      return state;
  }
};

// create context
const CartContext = createContext<CartContextValue | undefined>(undefined);

// context provider
export interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // add item
  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    toast.success('Item added to cart');
  };

  // remove item
  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    toast.success('Item removed from cart');
  };

  // update quantity
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  // decrease quantity
  const decreaseQuantity = (id: string) => {
    dispatch({ type: 'DECREASE_QUANTITY', payload: { id } });
  };

  // clear cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // checkout
  const checkout = async (): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    if (state.items.length === 0) {
      return { success: false, error: 'Cart is empty' };
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // mock api call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // generate order id
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create order record
      const order = createOrderFromCart(state.items, orderId);

      // Add order to history
      dispatch({ type: 'ADD_ORDER', payload: order });

      // clear cart after checkout
      dispatch({ type: 'CLEAR_CART' });

      toast.success(`Order created successfully! Order ID: ${orderId}`);

      return { success: true, orderId };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Checkout failed, please try again'
      };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Get order by ID
  const getOrderById = (orderId: string): Order | undefined => {
    return state.orders.find(order => order.orderId === orderId);
  };

  // Get order history
  const getOrderHistory = (): Order[] => {
    return state.orders;
  };

  // Cancel order
  const cancelOrder = (orderId: string) => {
    const updatedOrders = state.orders.map(order =>
      order.orderId === orderId ? { ...order, status: 'cancelled' as const } : order
    );
    // Update order status
    updatedOrders.forEach(order => {
      if (order.orderId === orderId) {
        dispatch({ type: 'ADD_ORDER', payload: order });
      }
    });
    toast.success('Order cancelled');
  };

  const value: CartContextValue = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    decreaseQuantity,
    clearCart,
    checkout,
    getOrderById,
    getOrderHistory,
    cancelOrder,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// custom hook
export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};

// export some useful helper functions
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const getCartItemById = (items: CartItem[], id: string): CartItem | undefined => {
  return items.find(item => item.id === id);
};

export const isItemInCart = (items: CartItem[], id: string): boolean => {
  return items.some(item => item.id === id);
};

// Order related utility functions
export const formatOrderTime = (orderTime: string): string => {
  return new Date(orderTime).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const getOrderStatusText = (status: Order['status']): string => {
  const statusMap = {
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return statusMap[status];
};

export const calculateOrderItemTotal = (orderItem: OrderItem): number => {
  return orderItem.price * orderItem.quantity;
};
