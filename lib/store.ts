import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from './types';
import type { AuthUser } from './types';

// ============================================
// CART STORE
// ============================================

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  addItem: (product: Product, size: string, color: string, userId?: string) => Promise<void>;
  removeItem: (id: string, size: string, color: string, userId?: string) => Promise<void>;
  updateQuantity: (id: string, size: string, color: string, quantity: number, userId?: string) => Promise<void>;
  clearCart: (userId?: string) => Promise<void>;
  getTotal: () => number;
  loadCart: (userId: string) => Promise<void>;
  syncLocalCart: (userId: string) => Promise<void>;
  setItems: (items: CartItem[]) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: async (product, size, color, userId) => {
        if (userId) {
          // Usuario autenticado: guardar en base de datos
          set({ isLoading: true });
          const { addCartItem } = await import('./cart');
          const success = await addCartItem(userId, product.id, size, color, 1);

          if (success) {
            // Actualizar el estado local
            set((state) => {
              const existingItem = state.items.find(
                (item) => item.id === product.id &&
                  item.selectedSize === size &&
                  item.selectedColor === color
              );

              if (existingItem) {
                return {
                  items: state.items.map((item) =>
                    item.id === product.id &&
                      item.selectedSize === size &&
                      item.selectedColor === color
                      ? { ...item, quantity: item.quantity + 1 }
                      : item
                  ),
                  isLoading: false,
                };
              }

              return {
                items: [
                  ...state.items,
                  { ...product, quantity: 1, selectedSize: size, selectedColor: color },
                ],
                isLoading: false,
              };
            });
          } else {
            set({ isLoading: false });
          }
        } else {
          // Usuario invitado: guardar solo en localStorage
          set((state) => {
            const existingItem = state.items.find(
              (item) => item.id === product.id &&
                item.selectedSize === size &&
                item.selectedColor === color
            );

            if (existingItem) {
              return {
                items: state.items.map((item) =>
                  item.id === product.id &&
                    item.selectedSize === size &&
                    item.selectedColor === color
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                ),
              };
            }

            return {
              items: [
                ...state.items,
                { ...product, quantity: 1, selectedSize: size, selectedColor: color },
              ],
            };
          });
        }
      },

      removeItem: async (id, size, color, userId) => {
        if (userId) {
          // Usuario autenticado: eliminar de base de datos
          set({ isLoading: true });
          const { removeCartItem } = await import('./cart');
          const success = await removeCartItem(userId, id, size, color);

          if (success) {
            set((state) => ({
              items: state.items.filter(
                (item) => !(item.id === id &&
                  item.selectedSize === size &&
                  item.selectedColor === color)
              ),
              isLoading: false,
            }));
          } else {
            set({ isLoading: false });
          }
        } else {
          // Usuario invitado: eliminar solo de localStorage
          set((state) => ({
            items: state.items.filter(
              (item) => !(item.id === id &&
                item.selectedSize === size &&
                item.selectedColor === color)
            ),
          }));
        }
      },

      updateQuantity: async (id, size, color, quantity, userId) => {
        if (userId) {
          // Usuario autenticado: actualizar en base de datos
          set({ isLoading: true });
          const { updateCartItemQuantity } = await import('./cart');
          const success = await updateCartItemQuantity(userId, id, size, color, quantity);

          if (success) {
            if (quantity <= 0) {
              set((state) => ({
                items: state.items.filter(
                  (item) => !(item.id === id &&
                    item.selectedSize === size &&
                    item.selectedColor === color)
                ),
                isLoading: false,
              }));
            } else {
              set((state) => ({
                items: state.items.map((item) =>
                  item.id === id &&
                    item.selectedSize === size &&
                    item.selectedColor === color
                    ? { ...item, quantity }
                    : item
                ),
                isLoading: false,
              }));
            }
          } else {
            set({ isLoading: false });
          }
        } else {
          // Usuario invitado: actualizar solo en localStorage
          if (quantity <= 0) {
            set((state) => ({
              items: state.items.filter(
                (item) => !(item.id === id &&
                  item.selectedSize === size &&
                  item.selectedColor === color)
              ),
            }));
          } else {
            set((state) => ({
              items: state.items.map((item) =>
                item.id === id &&
                  item.selectedSize === size &&
                  item.selectedColor === color
                  ? { ...item, quantity }
                  : item
              ),
            }));
          }
        }
      },

      clearCart: async (userId) => {
        if (userId) {
          set({ isLoading: true });
          const { clearCart } = await import('./cart');
          const success = await clearCart(userId);

          if (success) {
            set({ items: [], isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } else {
          set({ items: [] });
        }
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      loadCart: async (userId) => {
        set({ isLoading: true });
        const { getCartItems } = await import('./cart');
        const cartItems = await getCartItems(userId);
        set({
          items: cartItems,
          isLoading: false,
        });
      },

      syncLocalCart: async (userId) => {
        const localItems = get().items;
        if (localItems.length > 0) {
          const { syncLocalCart } = await import('./cart');
          await syncLocalCart(userId, localItems);
          // Recargar carrito desde la base de datos
          await get().loadCart(userId);
        } else {
          // Si no hay items locales, solo cargar desde la base de datos
          await get().loadCart(userId);
        }
      },

      setItems: (items) => {
        set({ items });
      },
    }),
    {
      name: 'cart-storage',
      // Solo persistir items en localStorage (para usuarios invitados)
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// ============================================
// AUTH STORE
// ============================================

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      clearUser: () => set({ user: null, isLoading: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// ============================================
// WISHLIST STORE
// ============================================

interface WishlistStore {
  items: Product[];
  isLoading: boolean;
  isInitialized: boolean;
  addToWishlist: (product: Product, userId?: string) => Promise<void>;
  removeFromWishlist: (productId: string, userId?: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: (userId?: string) => Promise<void>;
  loadFavorites: (userId: string) => Promise<void>;
  syncLocalFavorites: (userId: string) => Promise<void>;
  setItems: (items: Product[]) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isInitialized: false,

      addToWishlist: async (product, userId) => {
        // Si hay usuario autenticado, guardar en la base de datos
        if (userId) {
          set({ isLoading: true });
          const { addFavorite } = await import('./favorites');
          const success = await addFavorite(userId, product.id);

          if (success) {
            set((state) => {
              const exists = state.items.find((item) => item.id === product.id);
              if (exists) {
                return { isLoading: false };
              }
              return {
                items: [...state.items, product],
                isLoading: false,
              };
            });
          } else {
            set({ isLoading: false });
          }
        } else {
          // Usuario invitado: guardar solo en localStorage
          set((state) => {
            const exists = state.items.find((item) => item.id === product.id);
            if (exists) {
              return state;
            }
            return {
              items: [...state.items, product],
            };
          });
        }
      },

      removeFromWishlist: async (productId, userId) => {
        // Si hay usuario autenticado, eliminar de la base de datos
        if (userId) {
          set({ isLoading: true });
          const { removeFavorite } = await import('./favorites');
          const success = await removeFavorite(userId, productId);

          if (success) {
            set((state) => ({
              items: state.items.filter((item) => item.id !== productId),
              isLoading: false,
            }));
          } else {
            set({ isLoading: false });
          }
        } else {
          // Usuario invitado: eliminar solo de localStorage
          set((state) => ({
            items: state.items.filter((item) => item.id !== productId),
          }));
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      clearWishlist: async (userId) => {
        if (userId) {
          set({ isLoading: true });
          const { clearFavorites } = await import('./favorites');
          const success = await clearFavorites(userId);

          if (success) {
            set({ items: [], isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } else {
          set({ items: [] });
        }
      },

      loadFavorites: async (userId) => {
        set({ isLoading: true });
        const { getFavorites } = await import('./favorites');
        const favorites = await getFavorites(userId);
        set({
          items: favorites,
          isLoading: false,
          isInitialized: true,
        });
      },

      syncLocalFavorites: async (userId) => {
        const localItems = get().items;
        if (localItems.length > 0) {
          const { syncLocalFavorites } = await import('./favorites');
          await syncLocalFavorites(userId, localItems);
          // Recargar favoritos desde la base de datos
          await get().loadFavorites(userId);
        } else {
          // Si no hay favoritos locales, solo cargar desde la base de datos
          await get().loadFavorites(userId);
        }
      },

      setItems: (items) => {
        set({ items });
      },
    }),
    {
      name: 'wishlist-storage',
      // Solo persistir items en localStorage (para usuarios invitados)
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// ============================================
// PAYMENT METHODS STORE
// ============================================

interface PaymentMethodsStore {
  methods: any[];
  isLoading: boolean;
  isInitialized: boolean;
  loadPaymentMethods: (userId: string) => Promise<void>;
  addMethod: (userId: string, paymentData: any) => Promise<boolean>;
  removeMethod: (methodId: string) => Promise<boolean>;
  setDefault: (userId: string, methodId: string) => Promise<boolean>;
  clearMethods: () => void;
}

export const usePaymentMethodsStore = create<PaymentMethodsStore>()((set, get) => ({
  methods: [],
  isLoading: false,
  isInitialized: false,

  loadPaymentMethods: async (userId) => {
    set({ isLoading: true });
    const { getPaymentMethods } = await import('./payment-methods');
    const methods = await getPaymentMethods(userId);
    set({
      methods,
      isLoading: false,
      isInitialized: true,
    });
  },

  addMethod: async (userId, paymentData) => {
    set({ isLoading: true });
    const { addPaymentMethod } = await import('./payment-methods');
    const success = await addPaymentMethod(userId, paymentData);

    if (success) {
      // Recargar métodos de pago
      await get().loadPaymentMethods(userId);
      return true;
    } else {
      set({ isLoading: false });
      return false;
    }
  },

  removeMethod: async (methodId) => {
    set({ isLoading: true });
    const { deletePaymentMethod } = await import('./payment-methods');
    const success = await deletePaymentMethod(methodId);

    if (success) {
      set((state) => ({
        methods: state.methods.filter((m) => m.id !== methodId),
        isLoading: false,
      }));
      return true;
    } else {
      set({ isLoading: false });
      return false;
    }
  },

  setDefault: async (userId, methodId) => {
    set({ isLoading: true });
    const { setDefaultPaymentMethod } = await import('./payment-methods');
    const success = await setDefaultPaymentMethod(userId, methodId);

    if (success) {
      // Recargar métodos de pago para reflejar el cambio
      await get().loadPaymentMethods(userId);
      return true;
    } else {
      set({ isLoading: false });
      return false;
    }
  },

  clearMethods: () => {
    set({ methods: [], isInitialized: false });
  },
}));

