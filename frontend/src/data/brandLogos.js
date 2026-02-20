const encode = (url) => encodeURIComponent(url);

const sourceLogoMap = {
  "royal-enfield": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Royal_Enfield_logo_new.svg",
  yamaha: "https://upload.wikimedia.org/wikipedia/commons/d/de/Yamaha_Motor_logo.svg",
  honda: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Honda_Logo.svg",
  ktm: "https://upload.wikimedia.org/wikipedia/commons/a/a9/KTM-Logo.svg",
  tvs: "https://upload.wikimedia.org/wikipedia/commons/d/df/TVS_Logo.svg",
  hero: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Hero_MotoCorp_Logo.svg",
  suzuki: "https://upload.wikimedia.org/wikipedia/commons/3/31/Suzuki_Motor_Corporation_logo.svg",
  kawasaki: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Kawasaki_Motors_logo.svg",
  triumph: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Triumph_Motorcycles_logo_and_claim_2015.svg",
  bmw: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Logo_BMW_Motorrad_2021.svg",
  ducati: "https://upload.wikimedia.org/wikipedia/commons/3/36/Ducati_red_logo.svg",
  "harley-davidson": "https://upload.wikimedia.org/wikipedia/commons/d/de/Harley-Davidson_logo.svg",
  bajaj: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Bajaj_Auto_logo.svg",
};

const logoProxy = (url) =>
  `https://wsrv.nl/?url=${encode(url)}&output=png&w=1100&h=520&fit=contain&we=1`;

export const brandLogoMap = Object.fromEntries(
  Object.entries(sourceLogoMap).map(([slug, url]) => [slug, logoProxy(url)])
);

export function getBrandLogo(brandSlug) {
  return brandLogoMap[brandSlug] || null;
}
