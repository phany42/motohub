const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatCurrency(value) {
  return currencyFormatter.format(value ?? 0);
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(value ?? 0);
}

export function formatDate(dateValue) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateValue));
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
