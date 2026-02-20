import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";
import { getCompareSlugs, setCompareSlugs } from "../../utils/compareStorage";
import { getRecentlyViewedSlugs, setRecentlyViewedSlugs } from "../../utils/recentlyViewed";
import { mergeUserCloudState, updateUserCloudState } from "../../services/apiClient";

function readCompareAndRecent() {
  return {
    compareSlugs: getCompareSlugs(),
    recentSlugs: getRecentlyViewedSlugs(),
  };
}

export default function CloudSyncManager() {
  const { cartSlugs, savedSlugs, hydrateFromCloudState } = useCart();
  const { isAuthenticated, loading, user, setCloudState } = useAuth();
  const { showAlert } = useAlert();
  const [compareAndRecent, setCompareAndRecent] = useState(() => readCompareAndRecent());

  const hydratedRef = useRef(false);
  const applyingCloudRef = useRef(false);
  const lastSyncedRef = useRef("");
  const syncErrorAlertedRef = useRef(false);

  useEffect(() => {
    const syncFromStorage = () => setCompareAndRecent(readCompareAndRecent());

    const handleCompare = (event) => {
      if (Array.isArray(event?.detail?.slugs)) {
        setCompareAndRecent((current) => ({ ...current, compareSlugs: event.detail.slugs }));
        return;
      }
      syncFromStorage();
    };

    const handleRecent = (event) => {
      if (Array.isArray(event?.detail?.slugs)) {
        setCompareAndRecent((current) => ({ ...current, recentSlugs: event.detail.slugs }));
        return;
      }
      syncFromStorage();
    };

    window.addEventListener("motohub:compare-change", handleCompare);
    window.addEventListener("motohub:recent-change", handleRecent);
    window.addEventListener("storage", syncFromStorage);

    return () => {
      window.removeEventListener("motohub:compare-change", handleCompare);
      window.removeEventListener("motohub:recent-change", handleRecent);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, []);

  const snapshot = useMemo(
    () => ({
      cartSlugs,
      savedSlugs,
      compareSlugs: compareAndRecent.compareSlugs,
      recentSlugs: compareAndRecent.recentSlugs,
    }),
    [cartSlugs, savedSlugs, compareAndRecent]
  );

  useEffect(() => {
    if (!isAuthenticated || loading || !user?.id) {
      hydratedRef.current = false;
      applyingCloudRef.current = false;
      lastSyncedRef.current = "";
      syncErrorAlertedRef.current = false;
      return;
    }

    if (hydratedRef.current) {
      return;
    }

    let cancelled = false;

    async function mergeCloudState() {
      try {
        const merged = await mergeUserCloudState(snapshot);
        if (cancelled) {
          return;
        }

        applyingCloudRef.current = true;
        hydrateFromCloudState(merged);
        setCompareSlugs(merged.compareSlugs || []);
        setRecentlyViewedSlugs(merged.recentSlugs || []);
        setCompareAndRecent({
          compareSlugs: merged.compareSlugs || [],
          recentSlugs: merged.recentSlugs || [],
        });
        setCloudState(merged);
        lastSyncedRef.current = JSON.stringify({
          cartSlugs: merged.cartSlugs || [],
          savedSlugs: merged.savedSlugs || [],
          compareSlugs: merged.compareSlugs || [],
          recentSlugs: merged.recentSlugs || [],
        });
        hydratedRef.current = true;
      } catch (error) {
        if (!syncErrorAlertedRef.current) {
          showAlert("Cloud sync unavailable. Using local data.", "error");
          syncErrorAlertedRef.current = true;
        }
        console.error(error);
      } finally {
        window.setTimeout(() => {
          applyingCloudRef.current = false;
        }, 0);
      }
    }

    mergeCloudState();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, loading, user?.id, snapshot, hydrateFromCloudState, setCloudState, showAlert]);

  useEffect(() => {
    if (!isAuthenticated || loading || !hydratedRef.current || applyingCloudRef.current) {
      return;
    }

    const serialized = JSON.stringify(snapshot);
    if (serialized === lastSyncedRef.current) {
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        const next = await updateUserCloudState(snapshot);
        lastSyncedRef.current = JSON.stringify({
          cartSlugs: next.cartSlugs || [],
          savedSlugs: next.savedSlugs || [],
          compareSlugs: next.compareSlugs || [],
          recentSlugs: next.recentSlugs || [],
        });
        setCloudState(next);
        syncErrorAlertedRef.current = false;
      } catch (error) {
        if (!syncErrorAlertedRef.current) {
          showAlert("Unable to sync latest changes to cloud", "error");
          syncErrorAlertedRef.current = true;
        }
        console.error(error);
      }
    }, 700);

    return () => window.clearTimeout(timer);
  }, [isAuthenticated, loading, snapshot, setCloudState, showAlert]);

  return null;
}
