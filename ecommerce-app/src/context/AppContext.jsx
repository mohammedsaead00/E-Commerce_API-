import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

// ---------------------------------------------------------------------------
// Shape of state kept deliberately flat and serializable so it maps cleanly
// onto a future backend: `cart` -> cart line items table, `wishlist` -> a
// join table of userId/productId, `user` -> session/auth response.
// ---------------------------------------------------------------------------

const STORAGE_KEY = "loome_state_v1";

const initialState = {
  user: null, // { id, name, email }
  cart: [], // [{ productId, qty, variant: { size, color } }]
  wishlist: [], // [productId]
};

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
}

function variantKey(variant) {
  if (!variant) return "";
  return `${variant.size ?? ""}|${variant.color ?? ""}`;
}

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };

    case "CART_ADD": {
      const { productId, qty = 1, variant = null } = action.payload;
      const key = variantKey(variant);
      const existing = state.cart.find(
        (line) => line.productId === productId && variantKey(line.variant) === key
      );
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((line) =>
            line === existing ? { ...line, qty: line.qty + qty } : line
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { productId, qty, variant }],
      };
    }

    case "CART_SET_QTY": {
      const { productId, variant, qty } = action.payload;
      const key = variantKey(variant);
      if (qty <= 0) {
        return {
          ...state,
          cart: state.cart.filter(
            (line) => !(line.productId === productId && variantKey(line.variant) === key)
          ),
        };
      }
      return {
        ...state,
        cart: state.cart.map((line) =>
          line.productId === productId && variantKey(line.variant) === key
            ? { ...line, qty }
            : line
        ),
      };
    }

    case "CART_REMOVE": {
      const { productId, variant } = action.payload;
      const key = variantKey(variant);
      return {
        ...state,
        cart: state.cart.filter(
          (line) => !(line.productId === productId && variantKey(line.variant) === key)
        ),
      };
    }

    case "CART_CLEAR":
      return { ...state, cart: [] };

    case "WISHLIST_TOGGLE": {
      const { productId } = action.payload;
      const exists = state.wishlist.includes(productId);
      return {
        ...state,
        wishlist: exists
          ? state.wishlist.filter((id) => id !== productId)
          : [...state.wishlist, productId],
      };
    }

    case "WISHLIST_REMOVE":
      return {
        ...state,
        wishlist: state.wishlist.filter((id) => id !== action.payload.productId),
      };

    default:
      return state;
  }
}

const AppStateContext = createContext(null);
const AppDispatchContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx;
}

export function useAppDispatch() {
  const ctx = useContext(AppDispatchContext);
  if (!ctx) throw new Error("useAppDispatch must be used within AppProvider");
  return ctx;
}

// ---------------------------------------------------------------------------
// Convenience hooks built on top of the raw state/dispatch, so components
// don't need to know action-type strings.
// ---------------------------------------------------------------------------

export function useAuth() {
  const { user } = useAppState();
  const dispatch = useAppDispatch();
  return {
    user,
    isAuthenticated: Boolean(user),
    login: (user) => dispatch({ type: "LOGIN", payload: user }),
    logout: () => dispatch({ type: "LOGOUT" }),
  };
}

export function useCart() {
  const { cart } = useAppState();
  const dispatch = useAppDispatch();

  const totalItems = useMemo(() => cart.reduce((sum, line) => sum + line.qty, 0), [cart]);

  return {
    cart,
    totalItems,
    addToCart: (productId, qty = 1, variant = null) =>
      dispatch({ type: "CART_ADD", payload: { productId, qty, variant } }),
    setQty: (productId, variant, qty) =>
      dispatch({ type: "CART_SET_QTY", payload: { productId, variant, qty } }),
    removeFromCart: (productId, variant) =>
      dispatch({ type: "CART_REMOVE", payload: { productId, variant } }),
    clearCart: () => dispatch({ type: "CART_CLEAR" }),
  };
}

export function useWishlist() {
  const { wishlist } = useAppState();
  const dispatch = useAppDispatch();

  return {
    wishlist,
    isWishlisted: (productId) => wishlist.includes(productId),
    toggleWishlist: (productId) => dispatch({ type: "WISHLIST_TOGGLE", payload: { productId } }),
    removeFromWishlist: (productId) => dispatch({ type: "WISHLIST_REMOVE", payload: { productId } }),
  };
}
