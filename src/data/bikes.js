export const brands = [
  {
    slug: "royal-enfield",
    name: "Royal Enfield",
    logo: "https://brandlogos.net/wp-content/uploads/2013/05/royal-enfield-eps-vector-logo.png",
    bikes: [
      { slug: "hunter-350", name: "Hunter 350", price: 164000, displacement: 349, bodyStyle: "Cruiser", year: 2023, image: "https://imgd.aeplcdn.com/1056x594/n/cw/ec/124013/hunter-350-right-side-view-5.png?isig=0&q=80&wm=3" },
      { slug: "meteor-350", name: "Meteor 350", price: 210000, displacement: 349, bodyStyle: "Cruiser", year: 2022, image: "https://via.placeholder.com/600x360?text=Meteor+350" },
      { slug: "classic-350", name: "Classic 350", price: 200000, displacement: 349, bodyStyle: "Cruiser", year: 2023, image: "https://via.placeholder.com/600x360?text=Classic+350" }
    ]
  },
  {
    slug: "hero",
    name: "Hero",
    logo: "https://brandlogos.net/wp-content/uploads/2014/11/hero_motocorp_horizontal-logo_brandlogos.net_ruxe1-512x170.png",
    bikes: [
      { slug: "splendor-plus", name: "Splendor Plus", price: 80000, displacement: 97, bodyStyle: "Commuter", year: 2021, image: "https://via.placeholder.com/600x360?text=Splendor+Plus" },
      { slug: "xpulse-200", name: "Xpulse 200", price: 136000, displacement: 199, bodyStyle: "Adventure", year: 2022, image: "https://via.placeholder.com/600x360?text=Xpulse+200" }
    ]
  },
  {
    slug: "honda",
    name: "Honda",
    logo: "https://brandlogos.net/wp-content/uploads/2021/12/Honda-Bike-logo-512x411.png",
    bikes: [
      { slug: "cb350rs", name: "CB350 RS", price: 200000, displacement: 348, bodyStyle: "Retro", year: 2023, image: "https://via.placeholder.com/600x360?text=CB350+RS" },
      { slug: "cb200x", name: "CB200X", price: 160000, displacement: 184, bodyStyle: "Adventure", year: 2024, image: "https://via.placeholder.com/600x360?text=CB200X" }
    ]
  },
  {
    slug: "yamaha",
    name: "Yamaha",
    logo: "https://via.placeholder.com/120x60?text=Yamaha+Logo",
    bikes: [
      { slug: "fz25", name: "FZ25", price: 160000, displacement: 249, bodyStyle: "Naked", year: 2020, image: "https://via.placeholder.com/600x360?text=FZ25" },
      { slug: "r15", name: "R15", price: 170000, displacement: 155, bodyStyle: "Sports", year: 2024, image: "https://via.placeholder.com/600x360?text=R15" }
    ]
  },
  {
    slug: "suzuki",
    name: "Suzuki",
    logo: "https://via.placeholder.com/120x60?text=Suzuki+Logo",
    bikes: [
      { slug: "gixxer-250", name: "Gixxer 250", price: 200000, displacement: 249, bodyStyle: "Naked", year: 2021, image: "https://via.placeholder.com/600x360?text=Gixxer+250" }
    ]
  },
  {
    slug: "bajaj",
    name: "Bajaj",
    logo: "https://via.placeholder.com/120x60?text=Bajaj+Logo",
    bikes: [
      { slug: "pulsar-n250", name: "Pulsar N250", price: 160000, displacement: 249, bodyStyle: "Naked", year: 2022, image: "https://via.placeholder.com/600x360?text=Pulsar+N250" }
    ]
  },
  {
    slug: "tvs",
    name: "TVS",
    logo: "https://via.placeholder.com/120x60?text=TVS+Logo",
    bikes: [
      { slug: "apache-rr-310", name: "Apache RR 310", price: 280000, displacement: 312, bodyStyle: "Sports", year: 2021, image: "https://via.placeholder.com/600x360?text=Apache+RR+310" }
    ]
  },
  {
    slug: "ktm",
    name: "KTM",
    logo: "https://via.placeholder.com/120x60?text=KTM+Logo",
    bikes: [
      { slug: "duke-390", name: "Duke 390", price: 250000, displacement: 373, bodyStyle: "Naked", year: 2023, image: "https://via.placeholder.com/600x360?text=Duke+390" }
    ]
  },
  {
    slug: "jawa",
    name: "Jawa",
    logo: "https://via.placeholder.com/120x60?text=Jawa+Logo",
    bikes: [
      { slug: "jawa-42", name: "Jawa 42", price: 180000, displacement: 293, bodyStyle: "Retro", year: 2019, image: "https://via.placeholder.com/600x360?text=Jawa+42" }
    ]
  },
  {
    slug: "kawasaki",
    name: "Kawasaki",
    logo: "https://via.placeholder.com/120x60?text=Kawasaki+Logo",
    bikes: [
      { slug: "ninja-400", name: "Ninja 400", price: 450000, displacement: 399, bodyStyle: "Sports", year: 2024, image: "https://via.placeholder.com/600x360?text=Ninja+400" }
    ]
  }
];

export const allBikes = brands.flatMap((b) =>
  b.bikes.map((bike) => ({
    ...bike,
    brand: b.name,
    brandSlug: b.slug
  }))
);
