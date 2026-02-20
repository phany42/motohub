import { bikeImageMap } from "./bikeImages.js";
import { brandLogoMap } from "./brandLogos.js";

const createImage = (seed) => `https://picsum.photos/seed/motohub-${seed}/1200/800`;

export const brands = [
  {
    slug: "royal-enfield",
    name: "Royal Enfield",
    country: "India",
    founded: 1901,
    focus: "Modern retro and adventure touring",
    tagline: "Built for mountain miles",
    accent: "#f97316",
    description:
      "Royal Enfield blends old-school character with new-age reliability. Its lineup stays focused on ride feel, torque, and long-distance comfort.",
  },
  {
    slug: "yamaha",
    name: "Yamaha",
    country: "Japan",
    founded: 1955,
    focus: "Sport commuters and supersport DNA",
    tagline: "Precision in every rev",
    accent: "#2563eb",
    description:
      "Yamaha balances race-inspired engineering with practical ownership. The brand is known for refined engines and sharp chassis tuning.",
  },
  {
    slug: "honda",
    name: "Honda",
    country: "Japan",
    founded: 1948,
    focus: "Reliable commuters to premium tourers",
    tagline: "Everyday engineering, perfected",
    accent: "#dc2626",
    description:
      "Honda is trusted for reliability and ease of ownership. The portfolio stretches from city bikes to global adventure motorcycles.",
  },
  {
    slug: "ktm",
    name: "KTM",
    country: "Austria",
    founded: 1934,
    focus: "Performance street and adventure machines",
    tagline: "Ready to race",
    accent: "#f97316",
    description:
      "KTM targets riders who value aggressive ergonomics, high power-to-weight ratios, and track-ready handling.",
  },
  {
    slug: "tvs",
    name: "TVS",
    country: "India",
    founded: 1978,
    focus: "Tech-forward commuter and street motorcycles",
    tagline: "Smart streets, sharper riders",
    accent: "#0ea5e9",
    description:
      "TVS combines strong commuter fundamentals with modern connected features and expanding performance offerings.",
  },
  {
    slug: "hero",
    name: "Hero",
    country: "India",
    founded: 1984,
    focus: "High-volume practical mobility",
    tagline: "Mass mobility, modernized",
    accent: "#ef4444",
    description:
      "Hero leads in practical city and rural mobility while steadily pushing into premium and adventure segments.",
  },
  {
    slug: "suzuki",
    name: "Suzuki",
    country: "Japan",
    founded: 1909,
    focus: "Balanced street performance and touring",
    tagline: "Ride smooth, ride strong",
    accent: "#2563eb",
    description:
      "Suzuki offers smooth, torquey engines and stable highway manners, from middleweights to flagship hyperbikes.",
  },
  {
    slug: "kawasaki",
    name: "Kawasaki",
    country: "Japan",
    founded: 1896,
    focus: "Supersport and high-performance naked bikes",
    tagline: "Pure green adrenaline",
    accent: "#16a34a",
    description:
      "Kawasaki is known for aggressive styling and high-output engines, especially in the supersport and liter-class categories.",
  },
  {
    slug: "triumph",
    name: "Triumph",
    country: "United Kingdom",
    founded: 1902,
    focus: "Classic roadsters and premium adventure",
    tagline: "British torque, global roads",
    accent: "#22c55e",
    description:
      "Triumph blends British heritage design with modern electronics and strong mid-range performance.",
  },
  {
    slug: "bmw",
    name: "BMW Motorrad",
    country: "Germany",
    founded: 1923,
    focus: "Premium touring, adventure, and supersport",
    tagline: "Engineered for long horizons",
    accent: "#3b82f6",
    description:
      "BMW Motorrad focuses on high-end adventure, touring comfort, and advanced rider aids across categories.",
  },
  {
    slug: "ducati",
    name: "Ducati",
    country: "Italy",
    founded: 1926,
    focus: "High-performance sport and naked bikes",
    tagline: "Italian race-bred art",
    accent: "#ef4444",
    description:
      "Ducati is synonymous with premium performance, sharp handling, and emotional styling inspired by motorsport.",
  },
  {
    slug: "harley-davidson",
    name: "Harley-Davidson",
    country: "United States",
    founded: 1903,
    focus: "Cruisers and heavyweight touring",
    tagline: "Torque with attitude",
    accent: "#f59e0b",
    description:
      "Harley-Davidson represents cruiser culture with high-torque engines, distinctive styling, and long-haul comfort.",
  },
  {
    slug: "bajaj",
    name: "Bajaj",
    country: "India",
    founded: 1945,
    focus: "Sporty commuters and value touring",
    tagline: "Street value, sport spirit",
    accent: "#f97316",
    description:
      "Bajaj offers strong value in performance-leaning commuter and touring segments with a wide service footprint.",
  },
];

const rawBikes = [
  ["royal-enfield", "hunter-350", "Hunter 350", 2025, "retro", 349, 20.2, 27, 36, 13, 181, 800, 194000, 125],
  ["royal-enfield", "classic-350", "Classic 350", 2025, "retro", 349, 20.2, 27, 35, 13, 195, 805, 203000, 120],
  ["royal-enfield", "interceptor-650", "Interceptor 650", 2025, "retro", 648, 47, 52, 25, 13.7, 218, 804, 336000, 170],
  ["royal-enfield", "himalayan-450", "Himalayan 450", 2025, "adventure", 452, 40, 40, 30, 17, 196, 825, 289000, 150],

  ["yamaha", "r15m", "R15M", 2025, "sports", 155, 18.1, 14.2, 45, 11, 141, 815, 195000, 145],
  ["yamaha", "mt-15-v2", "MT-15 V2", 2025, "naked", 155, 18.1, 14.1, 48, 10, 141, 810, 175000, 132],
  ["yamaha", "fz-x", "FZ-X", 2025, "commuter", 149, 12.4, 13.3, 50, 10, 139, 810, 143000, 115],
  ["yamaha", "r3", "R3", 2025, "sports", 321, 42, 29.5, 27, 14, 169, 780, 465000, 180],

  ["honda", "cb350-rs", "CB350 RS", 2025, "retro", 348, 20.8, 30, 35, 15, 179, 800, 218000, 130],
  ["honda", "hornet-2-0", "Hornet 2.0", 2025, "naked", 184, 17.2, 16.1, 42, 12, 142, 790, 149000, 125],
  ["honda", "cbr650r", "CBR650R", 2025, "sports", 649, 94, 63, 21, 15.4, 209, 810, 980000, 230],
  ["honda", "transalp-xl750", "Transalp XL750", 2025, "adventure", 755, 90, 75, 24, 16.9, 208, 850, 1120000, 205],

  ["ktm", "duke-250", "Duke 250", 2025, "naked", 249, 31, 25, 33, 15, 162, 822, 248000, 148],
  ["ktm", "duke-390", "Duke 390", 2025, "naked", 399, 46, 39, 29, 15, 168, 820, 325000, 167],
  ["ktm", "rc-390", "RC 390", 2025, "sports", 399, 43.5, 37, 28, 13.7, 172, 824, 349000, 170],
  ["ktm", "adv-390", "390 Adventure", 2025, "adventure", 399, 46, 39, 30, 14.5, 177, 855, 382000, 160],

  ["tvs", "apache-rtr-160", "Apache RTR 160 4V", 2025, "naked", 159, 17.5, 14.7, 45, 12, 144, 800, 132000, 124],
  ["tvs", "apache-rtr-310", "Apache RTR 310", 2025, "naked", 312, 35.6, 28.7, 31, 11, 169, 800, 272000, 150],
  ["tvs", "ronin-225", "Ronin 225", 2025, "retro", 225, 20.4, 19.9, 41, 14, 160, 795, 170000, 125],
  ["tvs", "raider-125", "Raider 125", 2025, "commuter", 124, 11.2, 11.2, 57, 10, 123, 780, 98000, 105],

  ["hero", "xtreme-125r", "Xtreme 125R", 2025, "commuter", 125, 11.4, 10.5, 58, 10, 136, 794, 101000, 108],
  ["hero", "xpulse-200-4v", "Xpulse 200 4V", 2025, "adventure", 199, 19.1, 17.4, 40, 13, 159, 825, 151000, 125],
  ["hero", "karizma-xmr", "Karizma XMR", 2025, "sports", 210, 25.5, 20.4, 36, 11, 163, 810, 189000, 140],
  ["hero", "mavrick-440", "Mavrick 440", 2025, "cruiser", 440, 27, 36, 32, 13.5, 187, 803, 218000, 145],

  ["suzuki", "gixxer-250", "Gixxer 250", 2025, "naked", 249, 26.5, 22.2, 38, 12, 156, 800, 198000, 140],
  ["suzuki", "v-strom-sx", "V-Strom SX", 2025, "adventure", 249, 26.5, 22.2, 35, 12, 167, 835, 216000, 145],
  ["suzuki", "hayabusa", "Hayabusa", 2025, "supersport", 1340, 190, 150, 15, 20, 264, 800, 1680000, 299],
  ["suzuki", "gsx-8s", "GSX-8S", 2025, "naked", 776, 83, 78, 22, 14, 202, 810, 1080000, 215],

  ["kawasaki", "ninja-300", "Ninja 300", 2025, "sports", 296, 39, 26, 26, 17, 179, 785, 389000, 182],
  ["kawasaki", "ninja-500", "Ninja 500", 2025, "sports", 451, 45, 42.6, 25, 14, 171, 785, 542000, 190],
  ["kawasaki", "z900", "Z900", 2025, "naked", 948, 125, 98.6, 18, 17, 212, 820, 938000, 240],
  ["kawasaki", "versys-650", "Versys 650", 2025, "adventure", 649, 66, 61, 20, 21, 219, 845, 778000, 205],

  ["triumph", "speed-400", "Speed 400", 2025, "retro", 398, 39.5, 37.5, 30, 13, 176, 790, 246000, 160],
  ["triumph", "scrambler-400x", "Scrambler 400 X", 2025, "scrambler", 398, 39.5, 37.5, 29, 13, 185, 835, 268000, 160],
  ["triumph", "street-triple-rs", "Street Triple RS", 2025, "naked", 765, 130, 80, 20, 15, 188, 836, 1180000, 250],
  ["triumph", "tiger-900-gt", "Tiger 900 GT", 2025, "adventure", 888, 108, 90, 22, 20, 219, 820, 1450000, 215],

  ["bmw", "g310r", "G 310 R", 2025, "naked", 313, 34, 28, 30, 11, 158, 785, 315000, 145],
  ["bmw", "g310gs", "G 310 GS", 2025, "adventure", 313, 34, 28, 29, 11, 175, 835, 337000, 143],
  ["bmw", "f900gs", "F 900 GS", 2025, "adventure", 895, 105, 93, 22, 14.5, 219, 870, 1370000, 220],
  ["bmw", "s1000rr", "S 1000 RR", 2025, "supersport", 999, 210, 113, 14, 16.5, 197, 824, 2250000, 303],

  ["ducati", "monster", "Monster", 2025, "naked", 937, 111, 93, 19, 14, 188, 820, 1295000, 240],
  ["ducati", "scrambler-icon", "Scrambler Icon", 2025, "scrambler", 803, 73, 65.2, 22, 13.5, 186, 798, 1080000, 200],
  ["ducati", "desertx", "DesertX", 2025, "adventure", 937, 110, 92, 18, 21, 223, 875, 1870000, 210],
  ["ducati", "panigale-v4", "Panigale V4", 2025, "supersport", 1103, 215, 124, 13, 17, 195, 850, 2790000, 305],

  ["harley-davidson", "x440", "X440", 2025, "cruiser", 440, 27, 38, 33, 13.5, 190, 805, 242000, 138],
  ["harley-davidson", "nightster", "Nightster", 2025, "cruiser", 975, 90, 95, 19, 11.7, 221, 705, 1330000, 195],
  ["harley-davidson", "fat-bob-114", "Fat Bob 114", 2025, "cruiser", 1868, 94, 155, 13, 13.6, 306, 710, 2130000, 177],
  ["harley-davidson", "pan-america-1250", "Pan America 1250", 2025, "adventure", 1252, 150, 128, 18, 21.2, 258, 860, 2480000, 220],

  ["bajaj", "pulsar-n250", "Pulsar N250", 2025, "naked", 249, 24.5, 21.5, 39, 14, 162, 795, 155000, 135],
  ["bajaj", "dominar-400", "Dominar 400", 2025, "touring", 373, 40, 35, 29, 13, 193, 800, 234000, 155],
  ["bajaj", "ns400z", "Pulsar NS400Z", 2025, "naked", 373, 39.5, 35, 28, 12, 174, 807, 186000, 154],
  ["bajaj", "chetak-3501", "Chetak 3501", 2025, "electric", 0, 5.4, 20, 0, 0, 137, 760, 130000, 73],
];

const segmentFeatures = {
  commuter: ["LED headlamp", "Eco riding mode", "Bluetooth turn-by-turn"],
  naked: ["Ride-by-wire", "Dual-channel ABS", "Traction control"],
  sports: ["Quickshifter", "Assist clutch", "Track-ready chassis"],
  retro: ["Classic ergonomics", "Metal body panels", "Torque-focused tuning"],
  cruiser: ["Relaxed footpeg stance", "Wide handlebar", "Long wheelbase stability"],
  adventure: ["Long travel suspension", "Switchable ABS", "Off-road riding mode"],
  touring: ["High-speed stability", "Comfort saddle", "Navigation ready cluster"],
  supersport: ["Launch control", "Cornering ABS", "IMU-based electronics"],
  scrambler: ["Wire-spoke style wheels", "Upright bars", "Multi-terrain tires"],
  electric: ["Fast charging support", "Regenerative braking", "Smart app telemetry"],
};

const segmentTransmission = {
  electric: "Automatic",
  default: "6-speed",
};

const segmentCooling = {
  commuter: "Air-cooled",
  retro: "Air/Oil-cooled",
  cruiser: "Air/Oil-cooled",
  electric: "Battery-cooled",
  default: "Liquid-cooled",
};

const paintPalette = [
  { name: "Graphite Black", hex: "#12151b" },
  { name: "Titan Silver", hex: "#a5acb5" },
  { name: "Racing Red", hex: "#bf1e2e" },
  { name: "Storm Blue", hex: "#3558b8" },
  { name: "Matte Olive", hex: "#4f5c47" },
  { name: "Pearl White", hex: "#eef2f6" },
  { name: "Neon Green", hex: "#60d040" },
  { name: "Burnt Orange", hex: "#ca6b2e" },
  { name: "Midnight Teal", hex: "#0e6a74" },
  { name: "Desert Sand", hex: "#c8a270" },
  { name: "Matte Grey", hex: "#6a727f" },
  { name: "Electric Yellow", hex: "#f2c42f" },
  { name: "Carbon Black", hex: "#0b0d12" },
  { name: "Factory Lime", hex: "#47bb3a" },
];

const segmentPaintPools = {
  commuter: [0, 1, 2, 5, 8, 10],
  naked: [0, 2, 3, 6, 10, 12],
  sports: [2, 3, 6, 11, 12, 13],
  retro: [0, 1, 2, 7, 9, 10],
  cruiser: [0, 2, 7, 9, 10, 12],
  adventure: [0, 4, 7, 8, 9, 10],
  touring: [0, 1, 3, 5, 8, 10],
  supersport: [2, 3, 6, 11, 12, 13],
  scrambler: [0, 4, 7, 8, 9, 10],
  electric: [1, 3, 5, 8, 11, 13],
  default: [0, 1, 2, 3, 5, 10],
};

function hashText(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function buildBikeColors(brandSlug, slug, segment) {
  const pool = segmentPaintPools[segment] ?? segmentPaintPools.default;
  const seed = hashText(`${brandSlug}-${slug}`);
  const picks = [];
  let cursor = 0;

  while (picks.length < 4 && cursor < pool.length + 8) {
    const paletteIndex = pool[(seed + cursor * 3) % pool.length];
    const paint = paintPalette[paletteIndex];
    if (!picks.some((item) => item.name === paint.name)) {
      picks.push(paint);
    }
    cursor += 1;
  }

  if (picks.length < 3) {
    for (const paint of paintPalette) {
      if (!picks.some((item) => item.name === paint.name)) {
        picks.push(paint);
      }
      if (picks.length === 4) {
        break;
      }
    }
  }

  return picks.slice(0, 4).map((paint) => ({ ...paint }));
}

const titleCase = (value) => value.charAt(0).toUpperCase() + value.slice(1);
const brandMap = Object.fromEntries(brands.map((brand) => [brand.slug, brand]));

export const allBikes = rawBikes.map((entry) => {
  const [
    brandSlug,
    slug,
    name,
    year,
    segment,
    engineCc,
    horsepower,
    torqueNm,
    mileageKmpl,
    fuelTankL,
    kerbWeightKg,
    seatHeightMm,
    priceInr,
    topSpeedKph,
  ] = entry;

  const segmentName = titleCase(segment);
  const bikeId = `${brandSlug}-${slug}`;

  return {
    id: bikeId,
    slug,
    brandSlug,
    brand: brandMap[brandSlug]?.name ?? "Unknown",
    name,
    year,
    segment,
    segmentName,
    bodyStyle: segmentName,
    engineCc,
    displacement: engineCc,
    horsepower,
    torqueNm,
    mileageKmpl,
    fuelTankL,
    kerbWeightKg,
    seatHeightMm,
    priceInr,
    price: priceInr,
    topSpeedKph,
    transmission: segmentTransmission[segment] ?? segmentTransmission.default,
    cooling: segmentCooling[segment] ?? segmentCooling.default,
    image: bikeImageMap[bikeId] || createImage(slug),
    colors: buildBikeColors(brandSlug, slug, segment),
    features: segmentFeatures[segment] ?? segmentFeatures.naked,
    inventory: 3 + ((name.length + year) % 11),
    rating: Number((4 + ((horsepower % 10) / 20)).toFixed(1)),
    synopsis:
      `${name} is tuned for ${segmentName.toLowerCase()} riders with a ${engineCc || "torque-rich"}` +
      `${engineCc ? "cc" : "-powered"} platform focused on usable performance and daily confidence.`,
  };
});

export const segmentList = Array.from(
  new Set(allBikes.map((bike) => bike.segment))
).map((segment) => ({
  slug: segment,
  name: titleCase(segment),
  count: allBikes.filter((bike) => bike.segment === segment).length,
}));

export const budgetBands = [
  { slug: "under-150k", name: "Under INR 1.5 Lakh", min: 0, max: 150000 },
  { slug: "150k-300k", name: "INR 1.5 - 3 Lakh", min: 150001, max: 300000 },
  { slug: "300k-700k", name: "INR 3 - 7 Lakh", min: 300001, max: 700000 },
  { slug: "700k-plus", name: "Above INR 7 Lakh", min: 700001, max: Infinity },
];

export const brandShowcase = brands.map((brand) => {
  const bikes = allBikes.filter((bike) => bike.brandSlug === brand.slug);
  const avgPrice = Math.round(
    bikes.reduce((sum, bike) => sum + bike.priceInr, 0) / Math.max(bikes.length, 1)
  );

  return {
    ...brand,
    models: bikes.length,
    avgPrice,
    topSegments: Array.from(new Set(bikes.map((bike) => bike.segmentName))).slice(0, 3),
    logoImage: brandLogoMap[brand.slug] || null,
    heroImage: createImage(`${brand.slug}-hero`),
  };
});

export const topRatedBikes = [...allBikes]
  .sort((a, b) => b.rating - a.rating || b.horsepower - a.horsepower)
  .slice(0, 12);

export function getBrandBySlug(brandSlug) {
  return brandShowcase.find((brand) => brand.slug === brandSlug) ?? null;
}

export function getBikeBySlug(brandSlug, bikeSlug) {
  return (
    allBikes.find((bike) => bike.brandSlug === brandSlug && bike.slug === bikeSlug) ??
    null
  );
}

export function findBikeBySlug(bikeSlug) {
  return allBikes.find((bike) => bike.slug === bikeSlug) ?? null;
}

export function getRelatedBikes(targetBike, limit = 4) {
  if (!targetBike) {
    return [];
  }

  const sameSegment = allBikes.filter(
    (bike) => bike.slug !== targetBike.slug && bike.segment === targetBike.segment
  );

  const sameBrand = allBikes.filter(
    (bike) => bike.slug !== targetBike.slug && bike.brandSlug === targetBike.brandSlug
  );

  return [...sameSegment, ...sameBrand]
    .filter((bike, index, list) => list.findIndex((item) => item.slug === bike.slug) === index)
    .slice(0, limit);
}

export function getBrandBikes(brandSlug) {
  return allBikes.filter((bike) => bike.brandSlug === brandSlug);
}

export function filterBikes({
  brandSlug,
  segment,
  minPrice,
  maxPrice,
  minCc,
  maxCc,
  search,
}) {
  const query = (search ?? "").trim().toLowerCase();

  return allBikes.filter((bike) => {
    const brandMatch = brandSlug ? bike.brandSlug === brandSlug : true;
    const segmentMatch = segment ? bike.segment === segment : true;
    const minPriceMatch = Number.isFinite(minPrice) ? bike.priceInr >= minPrice : true;
    const maxPriceMatch = Number.isFinite(maxPrice) ? bike.priceInr <= maxPrice : true;
    const minCcMatch = Number.isFinite(minCc) ? bike.engineCc >= minCc : true;
    const maxCcMatch = Number.isFinite(maxCc) ? bike.engineCc <= maxCc : true;
    const searchMatch = query
      ? `${bike.name} ${bike.brand} ${bike.segmentName}`.toLowerCase().includes(query)
      : true;

    return (
      brandMatch &&
      segmentMatch &&
      minPriceMatch &&
      maxPriceMatch &&
      minCcMatch &&
      maxCcMatch &&
      searchMatch
    );
  });
}




