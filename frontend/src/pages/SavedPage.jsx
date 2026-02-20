import React from "react";
import { Link } from "react-router-dom";
import { HeartCrack } from "lucide-react";
import PageHero from "../components/common/PageHero";
import SectionHeader from "../components/common/SectionHeader";
import EmptyState from "../components/common/EmptyState";
import SmartImage from "../components/common/SmartImage";
import { useCart } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";
import { formatCurrency } from "../utils/format";

export default function SavedPage() {
  const { saved, moveSavedToCart, removeFromSaved, clearSaved } = useCart();
  const { showAlert } = useAlert();

  return (
    <div className="space-y-10">
      <PageHero
        badge="Saved Vault"
        title="Saved for Later"
        subtitle="Hold bikes while you evaluate specs, price trends, and route readiness."
        image="https://picsum.photos/seed/motohub-saved-hero/1500/680"
      >
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full border border-rose-300/35 bg-rose-400/10 px-3 py-1 text-rose-100">
            {saved.length} bikes saved
          </span>
          {saved.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                clearSaved();
                showAlert("Saved list cleared", "info");
              }}
              className="rounded-full border border-slate-200/20 px-3 py-1 text-slate-100"
            >
              Clear saved list
            </button>
          ) : null}
        </div>
      </PageHero>

      {saved.length === 0 ? (
        <EmptyState
          title="No saved bikes"
          description="Use the save action from bike cards to build a review list."
          action={
            <Link
              to="/browse"
              className="inline-flex rounded-xl border border-slate-200/20 px-4 py-2 text-sm text-slate-100"
            >
              Browse catalog
            </Link>
          }
        />
      ) : (
        <section>
          <SectionHeader
            eyebrow="Review"
            title="Saved Bikes"
            subtitle="Move to cart when ready or remove from the vault."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {saved.map((bike) => (
              <article
                key={bike.slug}
                className="rounded-3xl border border-slate-200/10 bg-slate-900/65 p-4"
              >
                <SmartImage
                  src={bike.image}
                  alt={bike.name}
                  wrapperClassName="h-44 w-full rounded-2xl overflow-hidden bg-slate-950/60"
                  className="h-44 w-full object-contain p-2"
                />
                <div className="mt-4 space-y-2">
                  <Link to={`/bike/${bike.brandSlug}/${bike.slug}`} className="text-xl font-semibold text-white">
                    {bike.name}
                  </Link>
                  <p className="text-sm text-slate-300">{bike.brand}</p>
                  <p className="text-lg font-semibold text-orange-200">{formatCurrency(bike.priceInr)}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      moveSavedToCart(bike.slug);
                      showAlert(`${bike.name} moved to cart`, "success");
                    }}
                    className="rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-cyan-100"
                  >
                    Move to cart
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      removeFromSaved(bike.slug);
                      showAlert(`${bike.name} removed from saved`, "info");
                    }}
                    className="inline-flex items-center gap-1 rounded-xl border border-rose-300/30 bg-rose-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-rose-100"
                  >
                    <HeartCrack className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
