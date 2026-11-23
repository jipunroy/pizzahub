
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";

import type { MenuItem } from "@/services/menu.service";

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (item: MenuItem, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "pizzahub-cart";
const EMPTY_CART: CartItem[] = [];

let cachedCart: CartItem[] = EMPTY_CART;
let cachedSerialized: string | null | undefined = undefined;

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);

  return () => {
    listeners.delete(callback);
  };
}

function getCartSnapshot(): CartItem[] {
  if (typeof window === "undefined") {
    return EMPTY_CART;
  }

  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (savedCart === cachedSerialized) {
      return cachedCart;
    }

    cachedSerialized = savedCart;

    if (!savedCart) {
      cachedCart = EMPTY_CART;
      return cachedCart;
    }

    const parsedCart: unknown = JSON.parse(savedCart);

    cachedCart = Array.isArray(parsedCart)
      ? parsedCart
      : EMPTY_CART;

    return cachedCart;
  } catch {
    return EMPTY_CART;
  }
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function saveCart(items: CartItem[]) {
  try {
    const serialized = JSON.stringify(items);

    localStorage.setItem(CART_STORAGE_KEY, serialized);

    cachedSerialized = serialized;
    cachedCart = items;

    emitChange();
  } catch (error) {
    console.error("Failed to save cart:", error);
  }
}

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const cartItems = useSyncExternalStore(
    subscribe,
    getCartSnapshot,
    getServerSnapshot
  );

  const addToCart = useCallback(
    (item: MenuItem, quantity = 1) => {
      if (!Number.isInteger(quantity) || quantity < 1) return;

      const currentItems = getCartSnapshot();

      const existingItem = currentItems.find(
        (cartItem) => cartItem._id === item._id
      );

      let updatedItems: CartItem[];

      if (existingItem) {
        updatedItems = currentItems.map((cartItem) =>
          cartItem._id === item._id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + quantity,
              }
            : cartItem
        );
      } else {
        const newItem: CartItem = {
          _id: item._id,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
          category: item.category,
          quantity,
        };

        updatedItems = [...currentItems, newItem];
      }

      saveCart(updatedItems);
    },
    []
  );

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      const currentItems = getCartSnapshot();

      const updatedItems =
        quantity <= 0
          ? currentItems.filter((item) => item._id !== itemId)
          : currentItems.map((item) =>
              item._id === itemId
                ? { ...item, quantity }
                : item
            );

      saveCart(updatedItems);
    },
    []
  );

  const removeFromCart = useCallback((itemId: string) => {
    const currentItems = getCartSnapshot();

    saveCart(
      currentItems.filter((item) => item._id !== itemId)
    );
  }, []);

  const clearCart = useCallback(() => {
    saveCart([]);
  }, []);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartSubtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
