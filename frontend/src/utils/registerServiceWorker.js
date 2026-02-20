export function registerServiceWorker() {
  if (!import.meta.env.PROD) {
    return;
  }

  if (!("serviceWorker" in navigator)) {
    return;
  }

  const register = async () => {
    try {
      await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    } catch (error) {
      console.warn("Service worker registration failed", error);
    }
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register, { once: true });
  }
}
