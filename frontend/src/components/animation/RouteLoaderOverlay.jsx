import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import BikeGearLoader from "./BikeGearLoader";

export default function RouteLoaderOverlay({ open }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 6 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 4 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="rounded-3xl border border-slate-200/15 bg-slate-900/80 px-8 py-7"
          >
            <BikeGearLoader label="Starting engine" />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
