import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, setToken, ApiError } from "../services/api";

// ---------------------------------------------------------------------------
// All cart/wishlist/order state now lives in the database, reached through
// `api`. This context is a thin, React-friendly cache in front of it:
// on login (or app load, if a token is already stored) we pull the user's
// cart + wishlist down; every mutation calls the backend first and then
// updates local state from the response, so the UI always reflects what's
// actually persisted.
// ---------------------------------------------------------------------------

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // resolving any stored token on boot

  const [cart, setCart] = useState({ items: [], itemCount: 0, totalAmount: 0 });
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState("");

  const [wishlist, setWishlist] = useState({ items: [] });
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState("");

  const isAuthenticated = Boolean(user);

  const resetPersonalData = useCallback(() => {
    setCart({ items: [], itemCount: 0, totalAmount: 0 });
    setWishlist({ items: [] });
  }, []);

  // Session expired mid-use (a request came back 401): the api client has
  // already cleared the stored token — mirror that in local state so the
  // UI drops back to logged-out rather than showing stale user info.
  const handleSessionExpired = useCallback(() => {
    setUser(null);
    resetPersonalData();
  }, [resetPersonalData]);

  const refreshCart = useCallback(async () => {
    if (!getToken()) return;
    setCartLoading(true);
    setCartError("");
    try {
      const data = await api.getCart();
      setCart(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleSessionExpired();
        return;
      }
      setCartError(err.message || "Couldn't load your cart.");
    } finally {
      setCartLoading(false);
    }
  }, [handleSessionExpired]);

  const refreshWishlist = useCallback(async () => {
    if (!getToken()) return;
    setWishlistLoading(true);
    setWishlistError("");
    try {
      const data = await api.getWishlist();
      setWishlist(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleSessionExpired();
        return;
      }
      setWishlistError(err.message || "Couldn't load your wishlist.");
    } finally {
      setWishlistLoading(false);
    }
  }, [handleSessionExpired]);

  // On boot: if a token is already stored (returning visitor), verify it
  // and hydrate the user's cart/wishlist. This is what makes a page refresh
  // keep the person logged in and their data intact.
  useEffect(() => {
    let active = true;
    (async () => {
      const token = getToken();
      if (!token) {
        setAuthLoading(false);
        return;
      }
      try {
        const me = await api.getMe();
        if (!active) return;
        setUser(me);
        await Promise.all([refreshCart(), refreshWishlist()]);
      } catch {
        setToken(null);
        if (active) setUser(null);
      } finally {
        if (active) setAuthLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (credentials) => {
      const loggedInUser = await api.login(credentials);
      setUser(loggedInUser);
      await Promise.all([refreshCart(), refreshWishlist()]);
      return loggedInUser;
    },
    [refreshCart, refreshWishlist]
  );

  const register = useCallback(async (details) => {
    const newUser = await api.register(details);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
    resetPersonalData();
  }, [resetPersonalData]);

  // ---- Cart mutations -------------------------------------------------------
  const addToCart = useCallback(async (productId, qty = 1) => {
    const data = await api.addCartItem(productId, qty);
    setCart(data);
    return data;
  }, []);

  const setCartItemQty = useCallback(async (itemId, qty) => {
    const data = qty <= 0 ? await api.removeCartItem(itemId) : await api.updateCartItem(itemId, qty);
    setCart(data);
    return data;
  }, []);

  const removeFromCart = useCallback(async (itemId) => {
    const data = await api.removeCartItem(itemId);
    setCart(data);
    return data;
  }, []);

  const clearCart = useCallback(async () => {
    const data = await api.clearCart();
    setCart(data);
    return data;
  }, []);

  // ---- Wishlist mutations -----------------------------------------------------
  const isWishlisted = useCallback(
    (productId) => wishlist.items.some((item) => item.productId === productId),
    [wishlist]
  );

  const addToWishlist = useCallback(async (productId) => {
    const data = await api.addWishlistItem(productId);
    setWishlist(data);
    return data;
  }, []);

  const removeFromWishlist = useCallback(async (productId) => {
    const data = await api.removeWishlistItem(productId);
    setWishlist(data);
    return data;
  }, []);

  const toggleWishlist = useCallback(
    async (productId) => {
      if (isWishlisted(productId)) {
        return removeFromWishlist(productId);
      }
      return addToWishlist(productId);
    },
    [isWishlisted, addToWishlist, removeFromWishlist]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      authLoading,
      login,
      register,
      logout,

      cart: cart.items,
      cartTotals: { itemCount: cart.itemCount, totalAmount: cart.totalAmount },
      cartLoading,
      cartError,
      refreshCart,
      addToCart,
      setCartItemQty,
      removeFromCart,
      clearCart,

      wishlist: wishlist.items,
      wishlistLoading,
      wishlistError,
      refreshWishlist,
      isWishlisted,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
    }),
    [
      user,
      isAuthenticated,
      authLoading,
      login,
      register,
      logout,
      cart,
      cartLoading,
      cartError,
      refreshCart,
      addToCart,
      setCartItemQty,
      removeFromCart,
      clearCart,
      wishlist,
      wishlistLoading,
      wishlistError,
      refreshWishlist,
      isWishlisted,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}

export function useAuth() {
  const { user, isAuthenticated, authLoading, login, register, logout } = useAppContext();
  return { user, isAuthenticated, authLoading, login, register, logout };
}

export function useCart() {
  const {
    cart,
    cartTotals,
    cartLoading,
    cartError,
    refreshCart,
    addToCart,
    setCartItemQty,
    removeFromCart,
    clearCart,
  } = useAppContext();

  const totalItems = cartTotals.itemCount;

  return {
    cart,
    totalItems,
    totalAmount: cartTotals.totalAmount,
    loading: cartLoading,
    error: cartError,
    refresh: refreshCart,
    addToCart,
    setCartItemQty,
    removeFromCart,
    clearCart,
  };
}

export function useWishlist() {
  const {
    wishlist,
    wishlistLoading,
    wishlistError,
    refreshWishlist,
    isWishlisted,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
  } = useAppContext();

  return {
    wishlist,
    loading: wishlistLoading,
    error: wishlistError,
    refresh: refreshWishlist,
    isWishlisted,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
  };
}
