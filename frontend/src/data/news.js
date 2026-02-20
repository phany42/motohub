const articleImage = (seed) => `https://picsum.photos/seed/motohub-news-${seed}/900/560`;

export const editorialNews = [
  {
    id: "news-urban-adv-boom",
    category: "Market",
    publishedOn: "2026-02-10",
    title: "Urban Adventure Bikes Are Becoming the New Daily Riders",
    excerpt:
      "Riders who previously chose standard commuters are shifting to lightweight adventure models for better road visibility and comfort.",
    readTime: "5 min",
    source: "MotoHub Desk",
    url: "https://example.com/motohub/urban-adventure-boom",
    image: articleImage("urban-adv"),
  },
  {
    id: "news-track-school-demand",
    category: "Training",
    publishedOn: "2026-02-08",
    title: "Track School Enrollment Surges Across Metro Cities",
    excerpt:
      "Weekend track clinics report higher signups from first-time riders looking to improve braking and cornering discipline.",
    readTime: "4 min",
    source: "MotoHub Training",
    url: "https://example.com/motohub/track-school-demand",
    image: articleImage("track-school"),
  },
  {
    id: "news-premium-middleweight",
    category: "Launch",
    publishedOn: "2026-02-02",
    title: "Middleweight Segment Gets New Premium Electronics Package",
    excerpt:
      "Manufacturers are bringing cornering ABS, ride modes, and TFT dashboards to bikes below the 900cc mark.",
    readTime: "6 min",
    source: "MotoHub Product Team",
    url: "https://example.com/motohub/premium-middleweight",
    image: articleImage("middleweight"),
  },
  {
    id: "news-ev-service-network",
    category: "EV",
    publishedOn: "2026-01-28",
    title: "EV Bike Service Networks Expand Into Tier-2 Cities",
    excerpt:
      "Improved parts logistics and remote diagnostics are helping electric bike brands scale beyond metro locations.",
    readTime: "5 min",
    source: "MotoHub Mobility",
    url: "https://example.com/motohub/ev-service-network",
    image: articleImage("ev-network"),
  },
  {
    id: "news-rider-gear-standard",
    category: "Safety",
    publishedOn: "2026-01-22",
    title: "Rider Gear Standards Tighten for Urban Commute Programs",
    excerpt:
      "Large community ride groups now require certified gloves and boots in addition to full-face helmets.",
    readTime: "3 min",
    source: "MotoHub Safety",
    url: "https://example.com/motohub/gear-standards",
    image: articleImage("gear-standard"),
  },
  {
    id: "news-touring-demand",
    category: "Touring",
    publishedOn: "2026-01-16",
    title: "Long-Distance Touring Accessories See Record Demand",
    excerpt:
      "Panniers, touring windscreens, and tire inflators are among the fastest growing accessory categories.",
    readTime: "7 min",
    source: "MotoHub Commerce",
    url: "https://example.com/motohub/touring-demand",
    image: articleImage("touring-demand"),
  },
  {
    id: "news-community-rides",
    category: "Community",
    publishedOn: "2026-01-09",
    title: "Community Rides Move Toward Smaller, Safer Convoys",
    excerpt:
      "Ride captains are adopting split-convoy formats to reduce group fatigue and improve communication.",
    readTime: "4 min",
    source: "MotoHub Clubs",
    url: "https://example.com/motohub/community-convoys",
    image: articleImage("community"),
  },
  {
    id: "news-smart-helmets",
    category: "Tech",
    publishedOn: "2026-01-04",
    title: "Smart Helmet Adoption Climbs in Daily Commuter Segment",
    excerpt:
      "Riders are using connected helmets for turn-by-turn prompts and emergency SOS alerts in city traffic.",
    readTime: "5 min",
    source: "MotoHub Tech",
    url: "https://example.com/motohub/smart-helmets",
    image: articleImage("smart-helmet"),
  },
  {
    id: "news-winter-ride-prep",
    category: "Guides",
    publishedOn: "2025-12-28",
    title: "Cold Weather Ride Prep: What Actually Matters",
    excerpt:
      "Focus areas include battery checks, tire warm-up strategy, and moisture management in riding gear.",
    readTime: "6 min",
    source: "MotoHub Workshop",
    url: "https://example.com/motohub/winter-prep",
    image: articleImage("winter"),
  },
  {
    id: "news-premium-used-market",
    category: "Market",
    publishedOn: "2025-12-19",
    title: "Used Premium Bike Market Stays Strong Going Into 2026",
    excerpt:
      "Demand remains high for well-maintained middleweight and liter-class models with complete service history.",
    readTime: "5 min",
    source: "MotoHub Insights",
    url: "https://example.com/motohub/used-market",
    image: articleImage("used-market"),
  },
  {
    id: "news-route-planning-apps",
    category: "Tech",
    publishedOn: "2025-12-12",
    title: "Route Planning Apps Shift to Group Ride Features",
    excerpt:
      "New updates include convoy waypoint sync, hazard flags, and fuel stop clustering.",
    readTime: "4 min",
    source: "MotoHub Navigation",
    url: "https://example.com/motohub/route-apps",
    image: articleImage("route-app"),
  },
  {
    id: "news-city-lane-discipline",
    category: "Safety",
    publishedOn: "2025-12-05",
    title: "Lane Discipline Campaigns Show Fewer Low-Speed Incidents",
    excerpt:
      "City rider groups report fewer mirror contacts and sudden brake events after structured lane discipline drives.",
    readTime: "3 min",
    source: "MotoHub Road Safety",
    url: "https://example.com/motohub/lane-discipline",
    image: articleImage("lane-discipline"),
  },
];

export const newsCategories = Array.from(new Set(editorialNews.map((item) => item.category)));
