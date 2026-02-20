import React from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import PageHero from "../components/common/PageHero";
import SectionHeader from "../components/common/SectionHeader";
import EmptyState from "../components/common/EmptyState";
import SmartImage from "../components/common/SmartImage";
import { useCart } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";
import { formatCurrency } from "../utils/format";

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, saveForLater, clearCart } = useCart();
  const { showAlert } = useAlert();

  const insuranceEstimate = Math.round(cartTotal * 0.09);
  const logisticsEstimate = cart.length * 2800;
  const grandEstimate = cartTotal + insuranceEstimate + logisticsEstimate;

  return (
    <div className="space-y-10">
      <PageHero
        badge="Checkout Bay"
        title="Your Bike Cart"
        subtitle="Track shortlisted motorcycles and estimated ownership outflow in one view."
        image="https://picsum.photos/seed/motohub-cart-hero/1500/680"
      >
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full border border-cyan-300/35 bg-cyan-400/10 px-3 py-1 text-cyan-100">
            {cart.length} bikes in cart
          </span>
          {cart.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                clearCart();
                showAlert("Cart cleared", "info");
              }}
              className="rounded-full border border-slate-200/20 px-3 py-1 text-slate-100"
            >
              Clear cart
            </button>
          ) : null}
        </div>
      </PageHero>

      {cart.length === 0 ? (
        <EmptyState
          title="Cart is empty"
          description="Add bikes from browse or brand pages to start your shortlist."
          action={
            <Link
              to="/browse"
              className="inline-flex rounded-xl border border-slate-200/20 px-4 py-2 text-sm text-slate-100"
            >
              Open browse catalog
            </Link>
          }
        />
      ) : (
        <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <SectionHeader
              eyebrow="Shortlist"
              title="Selected Bikes"
              subtitle="Move bikes to saved list or remove them from cart anytime."
            />

            {cart.map((bike) => (
              <article
                key={bike.slug}
                className="grid gap-4 rounded-3xl border border-slate-200/10 bg-slate-900/65 p-4 sm:grid-cols-[180px_1fr]"
              >
                <SmartImage
                  src={bike.image}
                  alt={bike.name}
                  wrapperClassName="h-36 w-full rounded-2xl overflow-hidden bg-slate-950/60"
                  className="h-36 w-full object-contain p-2"
                />
                <div className="space-y-3">
                  <div>
                    <Link to={`/bike/${bike.brandSlug}/${bike.slug}`} className="text-xl font-semibold text-white">
                      {bike.name}
                    </Link>
                    <p className="text-sm text-slate-300">{bike.brand}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-300 sm:grid-cols-4">
                    <p>{bike.engineCc} cc</p>
                    <p>{bike.horsepower} hp</p>
                    <p>{bike.mileageKmpl} kmpl</p>
                    <p>{formatCurrency(bike.priceInr)}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        saveForLater(bike);
                        removeFromCart(bike.slug);
                        showAlert(`${bike.name} moved to saved`, "success");
                      }}
                      className="rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-cyan-100"
                    >
                      Move to saved
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        removeFromCart(bike.slug);
                        showAlert(`${bike.name} removed from cart`, "info");
                      }}
                      className="inline-flex items-center gap-1 rounded-xl border border-rose-300/30 bg-rose-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-rose-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="rounded-3xl border border-slate-200/10 bg-slate-900/65 p-5 h-fit xl:sticky xl:top-24">
            <SectionHeader
              eyebrow="Estimate"
              title="Ownership Cost"
              subtitle="Approximate values for planning only."
            />

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-300">
                <span>Bike value</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Insurance reserve</span>
                <span>{formatCurrency(insuranceEstimate)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Logistics and registration</span>
                <span>{formatCurrency(logisticsEstimate)}</span>
              </div>
              <div className="border-t border-slate-200/10 pt-3 text-base font-semibold text-white flex items-center justify-between">
                <span>Total estimate</span>
                <span>{formatCurrency(grandEstimate)}</span>
              </div>
            </div>

            <button className="mt-5 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-orange-400 px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-slate-950">
              Request callback
            </button>
          </aside>
        </section>
      )}
    </div>
  );
}
