import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { allBikes } from "../data/bikes";

const CART_STORAGE_KEY = "motohub_cart";
const SAVED_STORAGE_KEY = "motohub_saved";

const CartContext = createContext(null);

function readStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("motohub:cart-storage-change", {
        detail: { key, value },
      })
    );
  }
}

function upsertUnique(list, bike) {
  if (list.some((item) => item.slug === bike.slug)) {
    return list;
  }

  return [...list, bike];
}

function mapSlugsToBikes(slugs) {
  if (!Array.isArray(slugs)) {
    return [];
  }

  const bySlug = new Map(allBikes.map((bike) => [bike.slug, bike]));
  const seen = new Set();
  const mapped = [];

  for (const slug of slugs) {
    if (typeof slug !== "string" || seen.has(slug)) {
      continue;
    }

    const bike = bySlug.get(slug);
    if (!bike) {
      continue;
    }

    seen.add(slug);
    mapped.push(bike);
  }

  return mapped;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => readStorage(CART_STORAGE_KEY));
  const [saved, setSaved] = useState(() => readStorage(SAVED_STORAGE_KEY));

  useEffect(() => {
    writeStorage(CART_STORAGE_KEY, cart);
  }, [cart]);

  useEffect(() => {
    writeStorage(SAVED_STORAGE_KEY, saved);
  }, [saved]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.dispatchEvent(
      new CustomEvent("motohub:cart-state-change", {
        detail: {
          cartSlugs: cart.map((bike) => bike.slug),
          savedSlugs: saved.map((bike) => bike.slug),
        },
      })
    );
  }, [cart, saved]);

  const addToCart = (bike) => {
    setCart((current) => upsertUnique(current, bike));
  };

  const removeFromCart = (slug) => {
    setCart((current) => current.filter((item) => item.slug !== slug));
  };

  const clearCart = () => {
    setCart([]);
  };

  const saveForLater = (bike) => {
    setSaved((current) => upsertUnique(current, bike));
  };

  const removeFromSaved = (slug) => {
    setSaved((current) => current.filter((item) => item.slug !== slug));
  };

  const moveSavedToCart = (slug) => {
    setSaved((currentSaved) => {
      const bike = currentSaved.find((item) => item.slug === slug);
      if (!bike) {
        return currentSaved;
      }

      setCart((currentCart) => upsertUnique(currentCart, bike));
      return currentSaved.filter((item) => item.slug !== slug);
    });
  };

  const clearSaved = () => {
    setSaved([]);
  };

  const hydrateFromCloudState = (cloudState) => {
    if (!cloudState || typeof cloudState !== "object") {
      return;
    }

    if (Array.isArray(cloudState.cartSlugs)) {
      setCart(mapSlugsToBikes(cloudState.cartSlugs));
    }

    if (Array.isArray(cloudState.savedSlugs)) {
      setSaved(mapSlugsToBikes(cloudState.savedSlugs));
    }
  };

  const cartTotal = useMemo(
    () => cart.reduce((sum, bike) => sum + (bike.priceInr ?? bike.price ?? 0), 0),
    [cart]
  );

  const cartSlugs = useMemo(() => cart.map((bike) => bike.slug), [cart]);
  const savedSlugs = useMemo(() => saved.map((bike) => bike.slug), [saved]);

  const value = {
    cart,
    saved,
    cartTotal,
    cartSlugs,
    savedSlugs,
    addToCart,
    removeFromCart,
    clearCart,
    saveForLater,
    removeFromSaved,
    moveSavedToCart,
    clearSaved,
    hydrateFromCloudState,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
