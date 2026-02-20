import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bike, Compass, LogOut, Menu, Search, User, X } from "lucide-react";
import { allBikes } from "../../data/bikes";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";
import { getCompareSlugs } from "../../utils/compareStorage";

const primaryNav = [
  { label: "Home", to: "/" },
  { label: "Browse", to: "/browse" },
  { label: "Brands", to: "/brands" },
  { label: "Compare", to: "/compare" },
  { label: "News", to: "/news" },
  { label: "Events", to: "/events" },
  { label: "Routes", to: "/routes" },
];

const utilityNav = [
  { label: "Academy", to: "/academy" },
  { label: "Dealers", to: "/dealers" },
  { label: "Garage", to: "/garage" },
  { label: "Admin", to: "/admin" },
];

const allNav = [...primaryNav, ...utilityNav];

function NavItem({ label, to, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `bike-tap rounded-full px-2.5 py-1 text-sm transition ${
          isActive
            ? "bg-orange-500/85 text-white"
            : "text-slate-200/85 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

function MiniCounter({ label, to, value }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `bike-tap rounded-full border px-2.5 py-0.5 text-xs uppercase tracking-[0.08em] ${
          isActive
            ? "border-cyan-300/45 bg-cyan-400/15 text-cyan-100"
            : "border-slate-200/15 text-slate-200/85 hover:border-slate-200/30 hover:text-white"
        }`
      }
    >
      {label} {value}
    </NavLink>
  );
}

export default function SiteHeader() {
  const [searchValue, setSearchValue] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compareCount, setCompareCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginName, setLoginName] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { cart, saved } = useCart();
  const { user, isAuthenticated, login, logout, loading: authLoading } = useAuth();
  const { showAlert } = useAlert();

  const suggestions = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) {
      return [];
    }

    return allBikes
      .filter((bike) => `${bike.name} ${bike.brand}`.toLowerCase().includes(query))
      .slice(0, 5);
  }, [searchValue]);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setMoreOpen(false);
    setLoginOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const syncCompareCount = () => setCompareCount(getCompareSlugs().length);
    syncCompareCount();

    window.addEventListener("motohub:compare-change", syncCompareCount);
    window.addEventListener("storage", syncCompareCount);
    return () => {
      window.removeEventListener("motohub:compare-change", syncCompareCount);
      window.removeEventListener("storage", syncCompareCount);
    };
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const firstResult = suggestions[0];
    if (!firstResult) {
      return;
    }

    navigate(`/bike/${firstResult.brandSlug}/${firstResult.slug}`);
    setSearchValue("");
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const email = loginEmail.trim();
    if (!email) {
      showAlert("Email is required for cloud sync login", "error");
      return;
    }

    try {
      setAuthBusy(true);
      await login({ email, name: loginName.trim() });
      showAlert("Signed in. Cloud sync is active.", "success");
      setLoginOpen(false);
      setLoginEmail("");
      setLoginName("");
    } catch (error) {
      showAlert(error?.response?.data?.message || "Unable to sign in", "error");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = async () => {
    try {
      setAuthBusy(true);
      await logout();
      showAlert("Signed out from cloud account", "info");
    } finally {
      setAuthBusy(false);
    }
  };

  return (
    <header className="sticky top-0 z-[110] border-b border-slate-200/15 bg-gradient-to-r from-slate-950/98 via-slate-900/96 to-slate-950/98 shadow-[0_12px_28px_rgba(2,6,23,0.42)] backdrop-blur-xl">
      <div className="flex w-full items-center gap-2 px-[clamp(0.85rem,2.2vw,2rem)] py-2">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-600 text-slate-950 shadow-lg shadow-orange-700/30">
            <Bike className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="font-display text-base uppercase tracking-[0.16em] text-white">MotoHub</p>
            <p className="hidden text-[9px] uppercase tracking-[0.14em] text-cyan-100/70 2xl:block">Bike Data Universe</p>
          </div>
        </Link>

        <nav className="ml-3 hidden items-center gap-1 xl:flex">
          {primaryNav.map((item) => (
            <NavItem key={item.to} label={item.label} to={item.to} />
          ))}

          <div className="relative ml-1">
            <button
              type="button"
              onClick={() => setMoreOpen((current) => !current)}
              className="bike-tap rounded-full border border-slate-200/20 px-3 py-1.5 text-sm text-slate-200/90 hover:border-slate-200/35 hover:text-white"
            >
              More
            </button>
            {moreOpen ? (
              <div className="absolute left-0 top-11 z-30 min-w-[150px] space-y-1 rounded-2xl border border-slate-200/15 bg-slate-950/95 p-2 shadow-xl">
                {utilityNav.map((item) => (
                  <NavItem
                    key={`${item.to}-more`}
                    label={item.label}
                    to={item.to}
                    onClick={() => setMoreOpen(false)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </nav>

        <form onSubmit={handleSearchSubmit} className="relative ml-auto hidden w-[280px] lg:block 2xl:w-[320px]">
          <div className="flex items-center gap-2 rounded-full border border-slate-200/15 bg-slate-900/80 px-3.5 py-1.5 text-sm">
            <Search className="h-4 w-4 text-cyan-100/70" />
            <input
              value={searchValue}
              onFocus={() => setSearchOpen(true)}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search bike or brand"
              className="w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-400"
            />
          </div>

          {searchOpen && suggestions.length > 0 ? (
            <div className="absolute left-0 top-[48px] z-20 w-full rounded-2xl border border-slate-200/10 bg-slate-950/95 p-2 shadow-xl">
              {suggestions.map((bike) => (
                <button
                  key={bike.slug}
                  type="button"
                  onClick={() => {
                    navigate(`/bike/${bike.brandSlug}/${bike.slug}`);
                    setSearchValue("");
                  }}
                  className="bike-tap flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-slate-800/80"
                >
                  <div>
                    <p className="text-sm text-slate-100">{bike.name}</p>
                    <p className="text-xs text-slate-400">{bike.brand}</p>
                  </div>
                  <Compass className="h-4 w-4 text-cyan-200/70" />
                </button>
              ))}
            </div>
          ) : null}
        </form>

        <div className="hidden items-center gap-1.5 lg:flex">
          <MiniCounter label="Cart" to="/cart" value={cart.length} />
          <MiniCounter label="Saved" to="/saved" value={saved.length} />
          <MiniCounter label="Compare" to="/compare" value={compareCount} />
        </div>

        <div className="relative hidden items-center gap-2 lg:flex">
          {isAuthenticated ? (
            <>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-100">
                <User className="h-3.5 w-3.5" />
                {user?.name || "Rider"}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                disabled={authBusy || authLoading}
                className="bike-tap inline-flex items-center gap-1 rounded-full border border-rose-300/35 bg-rose-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-rose-100 disabled:opacity-60"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setLoginOpen((value) => !value)}
                className="bike-tap inline-flex items-center gap-1 rounded-full border border-cyan-300/35 bg-cyan-400/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-cyan-100"
              >
                <User className="h-3.5 w-3.5" />
                Cloud Login
              </button>
              {loginOpen ? (
                <form
                  onSubmit={handleLoginSubmit}
                  className="absolute right-0 top-11 z-30 w-[280px] space-y-2 rounded-2xl border border-slate-200/15 bg-slate-950/95 p-3 shadow-xl"
                >
                  <input
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-lg border border-slate-200/15 bg-slate-900/85 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-400"
                    required
                  />
                  <input
                    value={loginName}
                    onChange={(event) => setLoginName(event.target.value)}
                    placeholder="Name (optional)"
                    className="w-full rounded-lg border border-slate-200/15 bg-slate-900/85 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={authBusy || authLoading}
                    className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-orange-400 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-950 disabled:opacity-60"
                  >
                    {authBusy ? "Signing in..." : "Sign in & Sync"}
                  </button>
                </form>
              ) : null}
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="bike-tap ml-auto grid h-9 w-9 place-items-center rounded-xl border border-slate-200/15 text-slate-100 xl:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200/10 px-4 py-4 xl:hidden">
          <div className="mb-4 rounded-2xl border border-slate-200/10 bg-slate-900/60 p-3">
            {isAuthenticated ? (
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-emerald-200/80">Cloud Account</p>
                  <p className="text-sm font-semibold text-emerald-100">{user?.name || user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={authBusy || authLoading}
                  className="bike-tap inline-flex items-center gap-1 rounded-xl border border-rose-300/35 bg-rose-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-rose-100 disabled:opacity-60"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <form onSubmit={handleLoginSubmit} className="grid gap-2">
                <input
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  type="email"
                  placeholder="Email for cloud sync"
                  className="rounded-lg border border-slate-200/15 bg-slate-900/85 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-400"
                  required
                />
                <input
                  value={loginName}
                  onChange={(event) => setLoginName(event.target.value)}
                  placeholder="Name (optional)"
                  className="rounded-lg border border-slate-200/15 bg-slate-900/85 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={authBusy || authLoading}
                  className="rounded-lg bg-gradient-to-r from-cyan-400 to-orange-400 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-950 disabled:opacity-60"
                >
                  {authBusy ? "Signing in..." : "Sign in & Enable Sync"}
                </button>
              </form>
            )}
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2">
            <NavItem label={`Cart ${cart.length}`} to="/cart" onClick={() => setMobileOpen(false)} />
            <NavItem label={`Saved ${saved.length}`} to="/saved" onClick={() => setMobileOpen(false)} />
            <NavItem label={`Compare ${compareCount}`} to="/compare" onClick={() => setMobileOpen(false)} />
            <NavItem label="News" to="/news" onClick={() => setMobileOpen(false)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {allNav.map((item) => (
              <NavItem
                key={`${item.to}-mobile`}
                label={item.label}
                to={item.to}
                onClick={() => setMobileOpen(false)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
