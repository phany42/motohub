const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const RSSParser = require("rss-parser");
const ical = require("node-ical");

const app = express();
const parser = new RSSParser({ timeout: 15000 });

const PORT = Number(process.env.PORT || 5000);
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, "data");
const FRONTEND_DIST_DIR = path.join(__dirname, "..", "frontend", "dist");
const FRONTEND_INDEX_FILE = path.join(FRONTEND_DIST_DIR, "index.html");
const COLLECTION_FILES = {
  news: "news.json",
  events: "events.json",
  dealers: "dealers.json",
};
const PRIVATE_STATE_FILES = {
  users: "users.json",
  userStates: "user-states.json",
};

const CLOUD_LIMITS = {
  cart: 60,
  saved: 80,
  compare: 3,
  recent: 8,
};

const PRICING_CITY_PROFILES = {
  bengaluru: {
    slug: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    rtoPct: 0.13,
    rtoPctElectric: 0.03,
    insurancePct: 0.028,
    registrationInr: 3600,
    handlingInr: 2200,
    hsrpInr: 1200,
    fastagInr: 600,
    smartCardInr: 550,
    hypothecationInr: 1500,
    greenCessPct: 0.01,
    roadSafetyInr: 400,
    fuelPricePerL: 106,
    evCostPerKm: 1.2,
  },
  mumbai: {
    slug: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    rtoPct: 0.12,
    rtoPctElectric: 0.04,
    insurancePct: 0.027,
    registrationInr: 3400,
    handlingInr: 2100,
    hsrpInr: 1200,
    fastagInr: 600,
    smartCardInr: 520,
    hypothecationInr: 1500,
    greenCessPct: 0.009,
    roadSafetyInr: 350,
    fuelPricePerL: 105,
    evCostPerKm: 1.18,
  },
  delhi: {
    slug: "delhi",
    name: "Delhi",
    state: "Delhi",
    rtoPct: 0.1,
    rtoPctElectric: 0.02,
    insurancePct: 0.026,
    registrationInr: 3200,
    handlingInr: 2000,
    hsrpInr: 1100,
    fastagInr: 600,
    smartCardInr: 500,
    hypothecationInr: 1400,
    greenCessPct: 0.008,
    roadSafetyInr: 320,
    fuelPricePerL: 95,
    evCostPerKm: 1.12,
  },
  chennai: {
    slug: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    rtoPct: 0.11,
    rtoPctElectric: 0.03,
    insurancePct: 0.027,
    registrationInr: 3300,
    handlingInr: 2000,
    hsrpInr: 1100,
    fastagInr: 600,
    smartCardInr: 510,
    hypothecationInr: 1400,
    greenCessPct: 0.009,
    roadSafetyInr: 350,
    fuelPricePerL: 103,
    evCostPerKm: 1.16,
  },
  hyderabad: {
    slug: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    rtoPct: 0.12,
    rtoPctElectric: 0.03,
    insurancePct: 0.027,
    registrationInr: 3300,
    handlingInr: 2100,
    hsrpInr: 1150,
    fastagInr: 600,
    smartCardInr: 520,
    hypothecationInr: 1450,
    greenCessPct: 0.009,
    roadSafetyInr: 360,
    fuelPricePerL: 108,
    evCostPerKm: 1.19,
  },
  pune: {
    slug: "pune",
    name: "Pune",
    state: "Maharashtra",
    rtoPct: 0.12,
    rtoPctElectric: 0.04,
    insurancePct: 0.027,
    registrationInr: 3400,
    handlingInr: 2100,
    hsrpInr: 1200,
    fastagInr: 600,
    smartCardInr: 520,
    hypothecationInr: 1500,
    greenCessPct: 0.009,
    roadSafetyInr: 350,
    fuelPricePerL: 104,
    evCostPerKm: 1.17,
  },
};

const liveCache = {
  news: { ts: 0, data: [] },
  events: new Map(),
  dealers: new Map(),
};

const LIVE_TTL_MS = 1000 * 60 * 8;

const CORS_ALLOW_ALL = String(process.env.CORS_ALLOW_ALL || "").toLowerCase() === "true";
const CORS_DEFAULT_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
];
const CORS_ORIGIN_PATTERNS = String(process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function createOriginMatcher(pattern) {
  if (!pattern.includes("*")) {
    return { pattern, test: (origin) => origin === pattern };
  }

  const regexSource = pattern
    .split("*")
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");
  const regex = new RegExp(`^${regexSource}$`);
  return { pattern, test: (origin) => regex.test(origin) };
}

const corsOriginMatchers = [...new Set([...CORS_DEFAULT_ORIGINS, ...CORS_ORIGIN_PATTERNS])].map(
  createOriginMatcher
);

function isCorsOriginAllowed(origin) {
  if (!origin) {
    return true;
  }

  if (CORS_ALLOW_ALL) {
    return true;
  }

  return corsOriginMatchers.some((matcher) => matcher.test(origin));
}

const corsOptions = {
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  origin(origin, callback) {
    if (isCorsOriginAllowed(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS origin is not allowed"));
  },
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 8)}`;
}

function isKnownCollection(name) {
  return Object.prototype.hasOwnProperty.call(COLLECTION_FILES, name);
}

function getCollectionPath(collection) {
  return path.join(DATA_DIR, COLLECTION_FILES[collection]);
}

function getPrivateStorePath(store) {
  return path.join(DATA_DIR, PRIVATE_STATE_FILES[store]);
}

async function readJsonFile(filePath, fallbackValue) {
  try {
    const raw = (await fs.readFile(filePath, "utf8")).replace(/^\uFEFF/, "");
    const parsed = JSON.parse(raw);
    if (Array.isArray(fallbackValue) && !Array.isArray(parsed)) {
      return fallbackValue;
    }
    if (
      fallbackValue &&
      typeof fallbackValue === "object" &&
      !Array.isArray(fallbackValue) &&
      (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    ) {
      return fallbackValue;
    }
    return parsed;
  } catch {
    return fallbackValue;
  }
}

async function writeJsonFile(filePath, payload) {
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
}

async function readUsers() {
  return readJsonFile(getPrivateStorePath("users"), []);
}

async function writeUsers(rows) {
  return writeJsonFile(getPrivateStorePath("users"), rows);
}

async function readUserStates() {
  return readJsonFile(getPrivateStorePath("userStates"), []);
}

async function writeUserStates(rows) {
  return writeJsonFile(getPrivateStorePath("userStates"), rows);
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function sanitizeSlugList(input, limit) {
  const max = Math.max(1, Number(limit || 1));
  if (!Array.isArray(input)) {
    return [];
  }

  const seen = new Set();
  const deduped = [];

  for (const item of input) {
    if (typeof item !== "string") {
      continue;
    }
    const slug = item.trim();
    if (!slug || seen.has(slug)) {
      continue;
    }
    seen.add(slug);
    deduped.push(slug);
    if (deduped.length >= max) {
      break;
    }
  }

  return deduped;
}

function mergeSlugLists(primary, secondary, limit) {
  return sanitizeSlugList([...(Array.isArray(primary) ? primary : []), ...(Array.isArray(secondary) ? secondary : [])], limit);
}

function defaultUserCloudState(userId) {
  return {
    userId,
    cartSlugs: [],
    savedSlugs: [],
    compareSlugs: [],
    recentSlugs: [],
    updatedAt: new Date().toISOString(),
  };
}

function normalizeCloudStatePayload(payload = {}) {
  return {
    cartSlugs: sanitizeSlugList(payload.cartSlugs, CLOUD_LIMITS.cart),
    savedSlugs: sanitizeSlugList(payload.savedSlugs, CLOUD_LIMITS.saved),
    compareSlugs: sanitizeSlugList(payload.compareSlugs, CLOUD_LIMITS.compare),
    recentSlugs: sanitizeSlugList(payload.recentSlugs, CLOUD_LIMITS.recent),
  };
}

function makePublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  };
}

function getTokenFromRequest(req) {
  const authHeader = String(req.headers.authorization || "").trim();
  if (authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  const altToken = String(req.headers["x-user-token"] || "").trim();
  return altToken || "";
}

async function resolveUserFromToken(token) {
  if (!token) {
    return null;
  }

  const users = await readUsers();
  const index = users.findIndex((item) => item.token === token);
  if (index === -1) {
    return null;
  }

  return { users, user: users[index], index };
}

async function authRequired(req, res, next) {
  try {
    const token = getTokenFromRequest(req);
    const resolved = await resolveUserFromToken(token);
    if (!resolved) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.authToken = token;
    req.authUser = resolved.user;
    req.authUserIndex = resolved.index;
    req.authUsers = resolved.users;
    return next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

function normalizeNumber(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return parsed;
}

function resolveCityProfile(cityInput) {
  const normalized = String(cityInput || "bengaluru").trim().toLowerCase();
  if (PRICING_CITY_PROFILES[normalized]) {
    return PRICING_CITY_PROFILES[normalized];
  }

  const byName = Object.values(PRICING_CITY_PROFILES).find(
    (item) => item.name.toLowerCase() === normalized
  );
  return byName || PRICING_CITY_PROFILES.bengaluru;
}

function calculateEmi({ principal, annualRatePct, months }) {
  const amount = Math.max(0, normalizeNumber(principal, 0));
  const tenure = Math.max(1, Math.round(normalizeNumber(months, 1)));
  const monthlyRate = Math.max(0, normalizeNumber(annualRatePct, 0)) / 1200;

  if (monthlyRate === 0) {
    return amount / tenure;
  }

  const growth = (1 + monthlyRate) ** tenure;
  return (amount * monthlyRate * growth) / (growth - 1);
}

function buildOnRoadQuote({
  bike = {},
  city = "bengaluru",
  accessoriesInr = 0,
  extendedWarrantyInr = 0,
  includeHypothecation = true,
}) {
  const cityProfile = resolveCityProfile(city);
  const exShowroomInr = Math.max(
    0,
    Math.round(normalizeNumber(bike.priceInr ?? bike.price ?? bike.exShowroomInr, 0))
  );
  const engineCc = Math.max(0, normalizeNumber(bike.engineCc, 0));
  const mileageKmpl = Math.max(0, normalizeNumber(bike.mileageKmpl, 0));
  const isElectric = engineCc === 0 || String(bike.segment || "").toLowerCase() === "electric";

  const effectiveRtoPct = isElectric ? cityProfile.rtoPctElectric : cityProfile.rtoPct;
  const rtoInr = Math.round(exShowroomInr * effectiveRtoPct);
  const insurancePct = cityProfile.insurancePct + (engineCc >= 500 ? 0.003 : 0);
  const insuranceInr = Math.max(isElectric ? 4200 : 5200, Math.round(exShowroomInr * insurancePct));
  const greenCessInr = Math.round(exShowroomInr * cityProfile.greenCessPct);
  const registrationInr = cityProfile.registrationInr;
  const handlingInr = cityProfile.handlingInr;
  const hsrpInr = cityProfile.hsrpInr;
  const fastagInr = cityProfile.fastagInr;
  const smartCardInr = cityProfile.smartCardInr;
  const hypothecationInr = includeHypothecation ? cityProfile.hypothecationInr : 0;
  const roadSafetyInr = cityProfile.roadSafetyInr;
  const accessoriesCostInr = Math.max(0, Math.round(normalizeNumber(accessoriesInr, 0)));
  const warrantyCostInr = Math.max(0, Math.round(normalizeNumber(extendedWarrantyInr, 0)));

  const charges = {
    rtoInr,
    insuranceInr,
    registrationInr,
    handlingInr,
    hsrpInr,
    fastagInr,
    smartCardInr,
    hypothecationInr,
    greenCessInr,
    roadSafetyInr,
    accessoriesCostInr,
    warrantyCostInr,
  };

  const totalChargesInr = Object.values(charges).reduce((sum, amount) => sum + amount, 0);
  const onRoadInr = exShowroomInr + totalChargesInr;

  return {
    city: cityProfile,
    bike: {
      name: bike.name || "Bike",
      brand: bike.brand || "",
      segment: bike.segment || "",
      engineCc,
      mileageKmpl,
    },
    exShowroomInr,
    charges,
    totalChargesInr,
    onRoadInr,
    fuelPricePerL: cityProfile.fuelPricePerL,
    evCostPerKm: cityProfile.evCostPerKm,
  };
}

function buildOwnershipQuote({
  bike = {},
  city = "bengaluru",
  usageKmPerMonth = 900,
  years = 5,
  downPaymentPct = 20,
  interestRatePct = 9.5,
  tenureMonths,
  serviceCostPerYearInr,
  insurancePerYearInr,
  fuelPricePerL,
  evCostPerKm,
  depreciationPctPerYear = 12,
}) {
  const onRoadQuote = buildOnRoadQuote({ bike, city, includeHypothecation: true });
  const months = Math.max(12, Math.round(normalizeNumber(tenureMonths, years * 12)));
  const yearsOwned = Math.max(1, Math.round(normalizeNumber(years, 5)));
  const monthlyUsage = Math.max(100, normalizeNumber(usageKmPerMonth, 900));
  const downPct = Math.max(0, Math.min(80, normalizeNumber(downPaymentPct, 20)));
  const rate = Math.max(0, normalizeNumber(interestRatePct, 9.5));
  const isElectric = onRoadQuote.bike.engineCc === 0 || onRoadQuote.bike.segment === "electric";

  const onRoadInr = onRoadQuote.onRoadInr;
  const downPaymentInr = Math.round(onRoadInr * (downPct / 100));
  const principalInr = Math.max(0, onRoadInr - downPaymentInr);
  const emiInr = Math.round(calculateEmi({ principal: principalInr, annualRatePct: rate, months }));

  const fuelRate = Math.max(1, normalizeNumber(fuelPricePerL, onRoadQuote.fuelPricePerL));
  const energyCostPerKm = Math.max(0.4, normalizeNumber(evCostPerKm, onRoadQuote.evCostPerKm));
  const mileage = Math.max(12, normalizeNumber(onRoadQuote.bike.mileageKmpl, 35));
  const monthlyFuelOrChargeInr = Math.round(
    isElectric ? monthlyUsage * energyCostPerKm : (monthlyUsage / mileage) * fuelRate
  );

  const serviceYearly = Math.max(
    2500,
    Math.round(normalizeNumber(serviceCostPerYearInr, Math.max(5000, onRoadInr * 0.03)))
  );
  const insuranceYearly = Math.max(
    2800,
    Math.round(normalizeNumber(insurancePerYearInr, Math.max(4500, onRoadInr * 0.018)))
  );
  const monthlyServiceInr = Math.round(serviceYearly / 12);
  const monthlyInsuranceInr = Math.round(insuranceYearly / 12);
  const monthlyTyreInr = Math.round(monthlyUsage * 0.35);
  const monthlyRunningInr =
    monthlyFuelOrChargeInr + monthlyServiceInr + monthlyInsuranceInr + monthlyTyreInr;

  const ownershipMonths = yearsOwned * 12;
  const emiMonthsInWindow = Math.min(months, ownershipMonths);
  const financeOutflowInr = downPaymentInr + emiInr * emiMonthsInWindow;
  const runningOutflowInr = monthlyRunningInr * ownershipMonths;
  const grossOwnershipInr = financeOutflowInr + runningOutflowInr;

  const depreciationRate = Math.max(4, Math.min(35, normalizeNumber(depreciationPctPerYear, 12))) / 100;
  const estimatedResaleInr = Math.max(0, Math.round(onRoadInr * (1 - depreciationRate) ** yearsOwned));
  const effectiveOwnershipInr = Math.max(0, grossOwnershipInr - estimatedResaleInr);

  return {
    onRoad: onRoadQuote,
    assumptions: {
      monthlyUsageKm: monthlyUsage,
      yearsOwned,
      downPaymentPct: downPct,
      interestRatePct: rate,
      tenureMonths: months,
      fuelPricePerL: fuelRate,
      evCostPerKm: energyCostPerKm,
      serviceCostPerYearInr: serviceYearly,
      insurancePerYearInr: insuranceYearly,
      depreciationPctPerYear: depreciationRate * 100,
    },
    finance: {
      onRoadInr,
      downPaymentInr,
      loanPrincipalInr: principalInr,
      emiInr,
      emiMonthsInWindow,
      financeOutflowInr,
    },
    monthly: {
      fuelOrChargeInr: monthlyFuelOrChargeInr,
      serviceInr: monthlyServiceInr,
      insuranceInr: monthlyInsuranceInr,
      tyresInr: monthlyTyreInr,
      runningInr: monthlyRunningInr,
      totalInr: monthlyRunningInr + emiInr,
    },
    totals: {
      runningOutflowInr,
      grossOwnershipInr,
      estimatedResaleInr,
      effectiveOwnershipInr,
      avgMonthlyEffectiveInr: Math.round(effectiveOwnershipInr / ownershipMonths),
    },
  };
}

async function ensureDataFiles() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  const stores = [
    ...Object.entries(COLLECTION_FILES).map(([name, fileName]) => ({
      name,
      fileName,
      seed: "[]",
    })),
    ...Object.entries(PRIVATE_STATE_FILES).map(([name, fileName]) => ({
      name,
      fileName,
      seed: "[]",
    })),
  ];

  for (const store of stores) {
    const { name, fileName, seed } = store;
    const filePath = path.join(DATA_DIR, fileName);
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, seed, "utf8");
      console.warn(`[bootstrap] created empty ${name} store`);
    }
  }
}

async function readCollection(collection) {
  const filePath = getCollectionPath(collection);
  const raw = (await fs.readFile(filePath, "utf8")).replace(/^\uFEFF/, "");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeCollection(collection, rows) {
  const filePath = getCollectionPath(collection);
  await fs.writeFile(filePath, JSON.stringify(rows, null, 2), "utf8");
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function normalizeAdminPayload(collection, payload, existing = null) {
  const base = existing || {};
  const status = payload.status || base.status || "draft";

  if (collection === "news") {
    return {
      id: base.id,
      title: String(payload.title || base.title || "").trim(),
      excerpt: String(payload.excerpt || base.excerpt || "").trim(),
      category: String(payload.category || base.category || "General").trim(),
      publishedOn: payload.publishedOn || base.publishedOn || new Date().toISOString().slice(0, 10),
      source: String(payload.source || base.source || "MotoHub CMS").trim(),
      url: String(payload.url || base.url || "").trim(),
      image: String(payload.image || base.image || "").trim(),
      status,
      updatedAt: new Date().toISOString(),
    };
  }

  if (collection === "events") {
    const highlights = Array.isArray(payload.highlights)
      ? payload.highlights
      : typeof payload.highlights === "string"
      ? payload.highlights.split(",").map((item) => item.trim()).filter(Boolean)
      : Array.isArray(base.highlights)
      ? base.highlights
      : [];

    return {
      id: base.id,
      name: String(payload.name || base.name || "").trim(),
      city: String(payload.city || base.city || "").trim(),
      country: String(payload.country || base.country || "").trim(),
      startDate: payload.startDate || base.startDate || "",
      endDate: payload.endDate || base.endDate || payload.startDate || "",
      type: String(payload.type || base.type || "Ride").trim(),
      entryFeeInr: Number(payload.entryFeeInr ?? base.entryFeeInr ?? 0),
      summary: String(payload.summary || base.summary || "").trim(),
      highlights,
      image: String(payload.image || base.image || "").trim(),
      status,
      updatedAt: new Date().toISOString(),
    };
  }

  const services = Array.isArray(payload.services)
    ? payload.services
    : typeof payload.services === "string"
    ? payload.services.split(",").map((item) => item.trim()).filter(Boolean)
    : Array.isArray(base.services)
    ? base.services
    : [];

  const brands = Array.isArray(payload.brands)
    ? payload.brands
    : typeof payload.brands === "string"
    ? payload.brands.split(",").map((item) => item.trim()).filter(Boolean)
    : Array.isArray(base.brands)
    ? base.brands
    : [];

  return {
    id: base.id,
    name: String(payload.name || base.name || "").trim(),
    city: String(payload.city || base.city || "").trim(),
    state: String(payload.state || base.state || "").trim(),
    address: String(payload.address || base.address || "").trim(),
    phone: String(payload.phone || base.phone || "").trim(),
    opensAt: String(payload.opensAt || base.opensAt || "09:00").trim(),
    closesAt: String(payload.closesAt || base.closesAt || "19:00").trim(),
    website: String(payload.website || base.website || "").trim(),
    services,
    brands,
    status,
    updatedAt: new Date().toISOString(),
  };
}

function validateRecord(collection, record) {
  if (collection === "news") {
    if (!record.title || !record.excerpt || !record.category) {
      return "News requires title, excerpt, and category";
    }
    return null;
  }

  if (collection === "events") {
    if (!record.name || !record.city || !record.startDate || !record.type) {
      return "Events require name, city, startDate, and type";
    }
    return null;
  }

  if (!record.name || !record.city || !record.address) {
    return "Dealers require name, city, and address";
  }

  return null;
}

function applyCollectionFilter(rows, query) {
  const q = String(query.q || "").trim().toLowerCase();
  const status = query.status ? String(query.status).toLowerCase() : "";
  const limit = Math.max(1, Math.min(200, Number(query.limit || 200)));

  const filtered = rows.filter((row) => {
    const statusMatch = status ? String(row.status || "").toLowerCase() === status : true;
    if (!statusMatch) {
      return false;
    }

    if (!q) {
      return true;
    }

    return JSON.stringify(row).toLowerCase().includes(q);
  });

  return filtered.slice(0, limit);
}

async function fetchLiveNews(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && now - liveCache.news.ts < LIVE_TTL_MS && liveCache.news.data.length) {
    return liveCache.news.data;
  }

  const feeds = [
    { name: "Motorcycle News", url: "https://www.motorcyclenews.com/news/rss/" },
    { name: "Adventure Pulse", url: "https://www.advpulse.com/feed/" },
    { name: "Bike EXIF", url: "https://www.bikeexif.com/feed" },
    { name: "WebBikeWorld", url: "https://www.webbikeworld.com/feed/" },
  ];

  const responses = await Promise.allSettled(
    feeds.map(async (feed) => {
      const xmlResponse = await axios.get(feed.url, {
        timeout: 12000,
        headers: {
          "User-Agent": "MotoHubBot/1.0",
        },
      });

      const parsed = await parser.parseString(xmlResponse.data);
      const items = (parsed.items || []).map((item) => ({
        id: `${feed.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Buffer.from(item.link || item.guid || item.title || "x").toString("base64").slice(0, 16)}`,
        title: item.title || "Untitled",
        excerpt: item.contentSnippet || item.summary || "",
        publishedOn: item.isoDate || item.pubDate || new Date().toISOString(),
        source: feed.name,
        url: item.link || "",
        image: item.enclosure?.url || item.thumbnail || "",
        category: (Array.isArray(item.categories) ? item.categories[0] : item.categories) || "News",
      }));
      return items;
    })
  );

  const merged = responses
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value)
    .filter((item) => item.title && item.url)
    .sort((a, b) => new Date(b.publishedOn).getTime() - new Date(a.publishedOn).getTime());

  const deduped = [];
  const seen = new Set();
  for (const item of merged) {
    if (seen.has(item.url)) {
      continue;
    }
    seen.add(item.url);
    deduped.push(item);
  }

  liveCache.news = { ts: now, data: deduped.slice(0, 80) };
  return liveCache.news.data;
}

function icsUrlBySeries(series, year) {
  if (series === "motogp") {
    return `https://nixxo.github.io/calendars/motogp/${year}/MotoGP_sprint-and-race_${year}_calendar.ics`;
  }

  if (series === "wsbk") {
    return `https://nixxo.github.io/calendars/wsbk/${year}/WorldSBK_races_${year}_calendar.ics`;
  }

  return null;
}

async function parseIcsFromUrl(url) {
  const response = await axios.get(url, {
    timeout: 25000,
    headers: {
      "User-Agent": "MotoHubBot/1.0",
    },
  });

  const entries = ical.sync.parseICS(response.data);
  return Object.values(entries).filter((entry) => entry.type === "VEVENT");
}

async function fetchLiveEvents({ series = "all", year = new Date().getFullYear(), forceRefresh = false }) {
  const key = `${series}-${year}`;
  const now = Date.now();

  const cached = liveCache.events.get(key);
  if (!forceRefresh && cached && now - cached.ts < LIVE_TTL_MS && cached.data.length) {
    return cached.data;
  }

  const seriesList = series === "all" ? ["motogp", "wsbk"] : [series];
  const payload = [];

  for (const current of seriesList) {
    const url = icsUrlBySeries(current, year);
    if (!url) {
      continue;
    }

    try {
      const items = await parseIcsFromUrl(url);
      const normalized = items.map((item) => ({
        id: `${current}-${Buffer.from(String(item.uid || item.summary || item.start || "")).toString("base64").slice(0, 16)}`,
        series: current.toUpperCase(),
        name: item.summary || `${current.toUpperCase()} Event`,
        location: item.location || "TBA",
        startDate: item.start ? new Date(item.start).toISOString() : null,
        endDate: item.end ? new Date(item.end).toISOString() : null,
        description: item.description || "",
      }));
      payload.push(...normalized);
    } catch (error) {
      console.warn(`[live events] ${current} fetch failed: ${error.message}`);
    }
  }

  const upcoming = payload
    .filter((item) => item.startDate)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 120)
    .map((item) => ({ ...item, key }));

  liveCache.events.set(key, { ts: now, data: upcoming });
  return upcoming;
}

async function fetchLiveDealersByCity(city) {
  const normalizedCity = String(city || "Bengaluru").trim();
  const cacheKey = normalizedCity.toLowerCase();
  const now = Date.now();

  const cached = liveCache.dealers.get(cacheKey);
  if (cached && now - cached.ts < LIVE_TTL_MS) {
    return cached.data;
  }

  const query = `
[out:json][timeout:25];
area["name"="${normalizedCity}"]->.a;
(
  node["shop"="motorcycle"](area.a);
  way["shop"="motorcycle"](area.a);
  relation["shop"="motorcycle"](area.a);
  node["motorcycle"="dealer"](area.a);
  way["motorcycle"="dealer"](area.a);
  relation["motorcycle"="dealer"](area.a);
);
out center 60;
`;

  const response = await axios.post("https://overpass-api.de/api/interpreter", query, {
    timeout: 30000,
    headers: {
      "Content-Type": "text/plain",
      "User-Agent": "MotoHubBot/1.0",
    },
  });

  const elements = Array.isArray(response.data?.elements) ? response.data.elements : [];
  const normalized = elements.map((element) => {
    const tags = element.tags || {};
    const lat = element.lat ?? element.center?.lat ?? null;
    const lon = element.lon ?? element.center?.lon ?? null;

    return {
      id: `${element.type}-${element.id}`,
      name: tags.name || "Motorcycle Dealer",
      city: normalizedCity,
      address: [tags["addr:housenumber"], tags["addr:street"], tags["addr:suburb"]]
        .filter(Boolean)
        .join(", "),
      phone: tags.phone || tags["contact:phone"] || "",
      website: tags.website || tags["contact:website"] || "",
      brands: tags.brand ? tags.brand.split(";").map((part) => part.trim()).filter(Boolean) : [],
      coordinates: lat && lon ? { lat, lon } : null,
      source: "OpenStreetMap",
    };
  });

  const deduped = [];
  const seen = new Set();
  for (const item of normalized) {
    const key = `${item.name}-${item.address}`.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push(item);
  }

  const sorted = deduped.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 50);
  liveCache.dealers.set(cacheKey, { ts: now, data: sorted });
  return sorted;
}

app.get("/api/ping", (req, res) => {
  return res.status(200).json({ success: true, message: "pong", timestamp: new Date().toISOString() });
});

app.get("/api/bikes", (req, res) => {
  return res.status(200).json({
    success: true,
    data: [
      { id: "legacy-hunter-350", name: "Hunter 350", brand: "Royal Enfield", price: 194000 },
      { id: "legacy-r15m", name: "R15M", brand: "Yamaha", price: 195000 },
      { id: "legacy-duke-390", name: "Duke 390", brand: "KTM", price: 325000 },
    ],
    note: "Legacy endpoint maintained for compatibility. Use /api/content and /api/live for production flows.",
  });
});

app.get("/api/pricing/cities", (req, res) => {
  const cities = Object.values(PRICING_CITY_PROFILES).map((city) => ({
    slug: city.slug,
    name: city.name,
    state: city.state,
    fuelPricePerL: city.fuelPricePerL,
    evCostPerKm: city.evCostPerKm,
  }));

  return res.status(200).json({ success: true, data: cities, total: cities.length });
});

app.post("/api/pricing/on-road", async (req, res) => {
  try {
    const body = req.body || {};
    const quote = buildOnRoadQuote({
      bike: body.bike || {},
      city: body.city || "bengaluru",
      accessoriesInr: body.accessoriesInr,
      extendedWarrantyInr: body.extendedWarrantyInr,
      includeHypothecation: body.includeHypothecation !== false,
    });

    if (!quote.exShowroomInr) {
      return res.status(400).json({
        success: false,
        message: "Bike price is required to compute on-road estimate",
      });
    }

    return res.status(200).json({ success: true, data: quote });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/pricing/ownership", async (req, res) => {
  try {
    const body = req.body || {};
    const quote = buildOwnershipQuote({
      bike: body.bike || {},
      city: body.city || "bengaluru",
      usageKmPerMonth: body.usageKmPerMonth,
      years: body.years,
      downPaymentPct: body.downPaymentPct,
      interestRatePct: body.interestRatePct,
      tenureMonths: body.tenureMonths,
      serviceCostPerYearInr: body.serviceCostPerYearInr,
      insurancePerYearInr: body.insurancePerYearInr,
      fuelPricePerL: body.fuelPricePerL,
      evCostPerKm: body.evCostPerKm,
      depreciationPctPerYear: body.depreciationPctPerYear,
    });

    if (!quote?.onRoad?.exShowroomInr) {
      return res.status(400).json({
        success: false,
        message: "Bike price is required to compute ownership estimate",
      });
    }

    return res.status(200).json({ success: true, data: quote });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    if (!email || !email.includes("@")) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    const fallbackName = email.split("@")[0].replace(/[._-]+/g, " ").trim();
    const name = String(req.body?.name || fallbackName || "Rider").trim().slice(0, 60);
    const now = new Date().toISOString();
    const token = crypto.randomBytes(24).toString("hex");

    const users = await readUsers();
    const userIndex = users.findIndex((user) => user.email === email);
    let user;
    if (userIndex === -1) {
      user = {
        id: makeId("user"),
        email,
        name,
        token,
        createdAt: now,
        lastLoginAt: now,
      };
      users.push(user);
    } else {
      user = {
        ...users[userIndex],
        name: name || users[userIndex].name,
        token,
        lastLoginAt: now,
      };
      users[userIndex] = user;
    }

    await writeUsers(users);

    const states = await readUserStates();
    let state = states.find((item) => item.userId === user.id) || null;
    if (!state) {
      state = defaultUserCloudState(user.id);
      states.push(state);
      await writeUserStates(states);
    }

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: makePublicUser(user),
        state,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/auth/me", authRequired, async (req, res) => {
  try {
    const states = await readUserStates();
    const state = states.find((item) => item.userId === req.authUser.id) || defaultUserCloudState(req.authUser.id);
    return res.status(200).json({
      success: true,
      data: {
        user: makePublicUser(req.authUser),
        state,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/auth/logout", authRequired, async (req, res) => {
  try {
    const users = req.authUsers;
    users[req.authUserIndex] = { ...req.authUser, token: "" };
    await writeUsers(users);
    return res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/user/state", authRequired, async (req, res) => {
  try {
    const states = await readUserStates();
    const index = states.findIndex((item) => item.userId === req.authUser.id);
    if (index === -1) {
      const fallback = defaultUserCloudState(req.authUser.id);
      states.push(fallback);
      await writeUserStates(states);
      return res.status(200).json({ success: true, data: fallback });
    }

    return res.status(200).json({ success: true, data: states[index] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/user/state", authRequired, async (req, res) => {
  try {
    const body = req.body || {};
    const nextPayload = normalizeCloudStatePayload(body);
    const states = await readUserStates();
    const index = states.findIndex((item) => item.userId === req.authUser.id);
    const current = index === -1 ? defaultUserCloudState(req.authUser.id) : states[index];

    const next = {
      ...current,
      cartSlugs: Object.prototype.hasOwnProperty.call(body, "cartSlugs")
        ? nextPayload.cartSlugs
        : current.cartSlugs,
      savedSlugs: Object.prototype.hasOwnProperty.call(body, "savedSlugs")
        ? nextPayload.savedSlugs
        : current.savedSlugs,
      compareSlugs: Object.prototype.hasOwnProperty.call(body, "compareSlugs")
        ? nextPayload.compareSlugs
        : current.compareSlugs,
      recentSlugs: Object.prototype.hasOwnProperty.call(body, "recentSlugs")
        ? nextPayload.recentSlugs
        : current.recentSlugs,
      updatedAt: new Date().toISOString(),
    };

    if (index === -1) {
      states.push(next);
    } else {
      states[index] = next;
    }

    await writeUserStates(states);
    return res.status(200).json({ success: true, data: next });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/user/state/merge", authRequired, async (req, res) => {
  try {
    const body = req.body || {};
    const incoming = normalizeCloudStatePayload(body);
    const states = await readUserStates();
    const index = states.findIndex((item) => item.userId === req.authUser.id);
    const current = index === -1 ? defaultUserCloudState(req.authUser.id) : states[index];

    const merged = {
      ...current,
      cartSlugs: mergeSlugLists(incoming.cartSlugs, current.cartSlugs, CLOUD_LIMITS.cart),
      savedSlugs: mergeSlugLists(incoming.savedSlugs, current.savedSlugs, CLOUD_LIMITS.saved),
      compareSlugs: mergeSlugLists(incoming.compareSlugs, current.compareSlugs, CLOUD_LIMITS.compare),
      recentSlugs: mergeSlugLists(incoming.recentSlugs, current.recentSlugs, CLOUD_LIMITS.recent),
      updatedAt: new Date().toISOString(),
    };

    if (index === -1) {
      states.push(merged);
    } else {
      states[index] = merged;
    }

    await writeUserStates(states);
    return res.status(200).json({ success: true, data: merged });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/content/:collection", async (req, res) => {
  const { collection } = req.params;
  if (!isKnownCollection(collection)) {
    return res.status(400).json({ success: false, message: "Unknown collection" });
  }

  try {
    const rows = await readCollection(collection);
    const filtered = applyCollectionFilter(rows, req.query);
    return res.status(200).json({ success: true, data: filtered, total: filtered.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/content/:collection/:id", async (req, res) => {
  const { collection, id } = req.params;
  if (!isKnownCollection(collection)) {
    return res.status(400).json({ success: false, message: "Unknown collection" });
  }

  try {
    const rows = await readCollection(collection);
    const item = rows.find((row) => row.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/admin/:collection", async (req, res) => {
  const { collection } = req.params;
  if (!isKnownCollection(collection)) {
    return res.status(400).json({ success: false, message: "Unknown collection" });
  }

  try {
    const rows = await readCollection(collection);
    const normalized = normalizeAdminPayload(collection, req.body || {});
    normalized.id = makeId(collection.slice(0, -1));

    const validationError = validateRecord(collection, normalized);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    rows.push(normalized);
    await writeCollection(collection, rows);

    return res.status(201).json({ success: true, data: normalized });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/admin/:collection/:id", async (req, res) => {
  const { collection, id } = req.params;
  if (!isKnownCollection(collection)) {
    return res.status(400).json({ success: false, message: "Unknown collection" });
  }

  try {
    const rows = await readCollection(collection);
    const index = rows.findIndex((row) => row.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    const normalized = normalizeAdminPayload(collection, req.body || {}, rows[index]);
    normalized.id = id;

    const validationError = validateRecord(collection, normalized);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    rows[index] = normalized;
    await writeCollection(collection, rows);

    return res.status(200).json({ success: true, data: normalized });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.patch("/api/admin/:collection/:id", async (req, res) => {
  const { collection, id } = req.params;
  if (!isKnownCollection(collection)) {
    return res.status(400).json({ success: false, message: "Unknown collection" });
  }

  try {
    const rows = await readCollection(collection);
    const index = rows.findIndex((row) => row.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    const merged = { ...rows[index], ...req.body };
    const normalized = normalizeAdminPayload(collection, merged, rows[index]);
    normalized.id = id;

    const validationError = validateRecord(collection, normalized);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    rows[index] = normalized;
    await writeCollection(collection, rows);
    return res.status(200).json({ success: true, data: normalized });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/admin/:collection/:id", async (req, res) => {
  const { collection, id } = req.params;
  if (!isKnownCollection(collection)) {
    return res.status(400).json({ success: false, message: "Unknown collection" });
  }

  try {
    const rows = await readCollection(collection);
    const next = rows.filter((row) => row.id !== id);
    if (next.length === rows.length) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    await writeCollection(collection, next);
    return res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/live/news", async (req, res) => {
  const forceRefresh = String(req.query.refresh || "").toLowerCase() === "true";
  try {
    const data = await fetchLiveNews(forceRefresh);
    return res.status(200).json({ success: true, data, total: data.length, source: "rss" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/live/events", async (req, res) => {
  const forceRefresh = String(req.query.refresh || "").toLowerCase() === "true";
  const series = String(req.query.series || "all").toLowerCase();
  const year = Number(req.query.year || new Date().getFullYear());

  try {
    const data = await fetchLiveEvents({ series, year, forceRefresh });
    return res.status(200).json({ success: true, data, total: data.length, source: "nixxo-calendar" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/live/dealers", async (req, res) => {
  const city = req.query.city || "Bengaluru";

  try {
    const data = await fetchLiveDealersByCity(city);
    return res.status(200).json({ success: true, data, total: data.length, source: "openstreetmap-overpass" });
  } catch (error) {
    try {
      const stored = await readCollection("dealers");
      return res.status(200).json({
        success: true,
        data: stored,
        total: stored.length,
        source: "cms-fallback",
        warning: "Live dealer lookup failed; returning CMS dealers",
      });
    } catch {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
});

app.get("/api/dashboard/summary", async (req, res) => {
  try {
    const [news, events, dealers] = await Promise.all([
      readCollection("news"),
      readCollection("events"),
      readCollection("dealers"),
    ]);

    const publishedNews = news.filter((item) => item.status === "published").length;
    const publishedEvents = events.filter((item) => item.status === "published").length;
    const publishedDealers = dealers.filter((item) => item.status === "published").length;

    return res.status(200).json({
      success: true,
      data: {
        news: { total: news.length, published: publishedNews },
        events: { total: events.length, published: publishedEvents },
        dealers: { total: dealers.length, published: publishedDealers },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.use((error, req, res, next) => {
  if (error?.message === "CORS origin is not allowed") {
    return res.status(403).json({ success: false, message: "CORS origin is not allowed" });
  }

  return next(error);
});

app.use(express.static(FRONTEND_DIST_DIR, { index: false, maxAge: "7d" }));
app.get(/^\/(?!api).*/, async (req, res, next) => {
  if (!(await fileExists(FRONTEND_INDEX_FILE))) {
    return next();
  }

  return res.sendFile(FRONTEND_INDEX_FILE);
});

async function startServer(port = PORT) {
  await ensureDataFiles();

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log(`MotoHub API listening on http://localhost:${port}`);
      if (CORS_ALLOW_ALL) {
        console.log("CORS: allow all origins (CORS_ALLOW_ALL=true)");
      } else {
        console.log(
          `CORS: ${corsOriginMatchers.map((matcher) => matcher.pattern).join(", ")}`
        );
      }
      resolve(server);
    });
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { app, startServer };
