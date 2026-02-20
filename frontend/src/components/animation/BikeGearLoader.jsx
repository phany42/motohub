import React from "react";
import { Bike, Cog } from "lucide-react";

export default function BikeGearLoader({ label = "Loading route", compact = false }) {
  return (
    <div className={`flex flex-col items-center justify-center ${compact ? "gap-2" : "gap-3"}`}>
      <div className={`bike-loader-stage ${compact ? "h-20 w-20" : "h-28 w-28"}`}>
        <div className="bike-loader-gear gear-a">
          <Cog className={compact ? "h-5 w-5" : "h-6 w-6"} />
        </div>
        <div className="bike-loader-gear gear-b">
          <Cog className={compact ? "h-4 w-4" : "h-5 w-5"} />
        </div>
        <div className="bike-loader-orbit">
          <Bike className={compact ? "h-4 w-4" : "h-5 w-5"} />
        </div>
      </div>
      <p className={`font-semibold uppercase tracking-[0.14em] text-cyan-100 ${compact ? "text-[10px]" : "text-xs"}`}>
        {label}
      </p>
    </div>
  );
}
