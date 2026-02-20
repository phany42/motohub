import React, { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import SiteHeader from "./components/layout/SiteHeader";
import SiteFooter from "./components/layout/SiteFooter";
import RouteLoaderOverlay from "./components/animation/RouteLoaderOverlay";

const Home = lazy(() => import("./pages/Home"));
const BrandsList = lazy(() => import("./pages/BrandsList"));
const BrandDetails = lazy(() => import("./pages/BrandDetails"));
const BikeDetails = lazy(() => import("./pages/BikeDetails"));
const BrowseBy = lazy(() => import("./pages/BrowseBy"));
const Compare = lazy(() => import("./pages/Compare"));
const CartPage = lazy(() => import("./pages/CartPage"));
const SavedPage = lazy(() => import("./pages/SavedPage"));
const News = lazy(() => import("./pages/News"));
const Events = lazy(() => import("./pages/Events"));
const RoutesHub = lazy(() => import("./pages/RoutesHub"));
const Academy = lazy(() => import("./pages/Academy"));
const Dealers = lazy(() => import("./pages/Dealers"));
const Garage = lazy(() => import("./pages/Garage"));
const AdminConsole = lazy(() => import("./pages/AdminConsole"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="site-shell min-h-screen">
      <SiteHeader />
      <main className="page-wrap">
        <Suspense fallback={<RouteLoaderOverlay open />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/brands" element={<BrandsList />} />
                <Route path="/brands/:brandSlug" element={<BrandDetails />} />
                <Route path="/bike/:brandSlug/:bikeSlug" element={<BikeDetails />} />
                <Route path="/browse" element={<BrowseBy />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/saved" element={<SavedPage />} />
                <Route path="/news" element={<News />} />
                <Route path="/events" element={<Events />} />
                <Route path="/routes" element={<RoutesHub />} />
                <Route path="/academy" element={<Academy />} />
                <Route path="/dealers" element={<Dealers />} />
                <Route path="/garage" element={<Garage />} />
                <Route path="/admin" element={<AdminConsole />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
