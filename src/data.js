// Site-style ideas shown in the gallery. Mock content is illustrative.
export const TEMPLATES = [
  {
    id: "ember", sub: "Natural wine, open fire, Sololaki", name: "Ember", type: "business", price: 1900, layout: "split",
    cat: { en: "Restaurant", ka: "რესტორანი" },
    domain: "ember.ge", headline: "Fire, wine & long dinners", nav: ["Menu", "Events", "Book"],
    look: { bg: "#170d08", fg: "#f3e3cf", accent: "#e39a52", soft: "#2a1810", font: "serif",
      art: "radial-gradient(60% 60% at 40% 40%, #ffb35c 0%, #b4471a 45%, #170d08 75%)" },
    desc: { en: "A warm, moody site for restaurants and wine bars, with table booking, a photo menu and events.",
            ka: "თბილი, ატმოსფერული საიტი რესტორნებისა და ღვინის ბარებისთვის — მაგიდის დაჯავშნით, ფოტო-მენიუთი და ღონისძიებებით." },
    features: { en: ["Table booking", "Photo menu", "Events", "Google Maps"], ka: ["მაგიდის დაჯავშნა", "ფოტო-მენიუ", "ღონისძიებები", "Google Maps"] },
  },
  {
    id: "maison", sub: "Apartments in Vake and Vera", name: "Maison", type: "business", price: 2900, layout: "editorial",
    cat: { en: "Real estate", ka: "უძრავი ქონება" },
    domain: "maison.estate", headline: "Homes that feel like you", nav: ["Buy", "Rent", "Agents"],
    look: { bg: "#efe9df", fg: "#1d1915", accent: "#1d1915", soft: "#ddd3c3", font: "serif",
      art: "linear-gradient(165deg, #cbb89b 0%, #8a7559 55%, #4a3c2c 100%)" },
    desc: { en: "An elegant listings site with search filters, virtual tours and a lead form on every property.",
            ka: "ელეგანტური საიტი ფილტრებით, ვირტუალური ტურებით და განაცხადის ფორმით ყველა ობიექტზე." },
    features: { en: ["Property search", "Virtual tours", "Lead forms", "CMS"], ka: ["ძიება", "ვირტუალური ტური", "განაცხადის ფორმა", "მართვის პანელი"] },
  },
  {
    id: "pulse", sub: "Plan, build and launch in one place", name: "Pulse", type: "app", price: 3400, layout: "center",
    cat: { en: "Tech / SaaS", ka: "ტექნოლოგია" },
    domain: "pulse.app", headline: "Ship your product faster", nav: ["Product", "Pricing", "Docs"],
    look: { bg: "#0d1020", fg: "#e8ebff", accent: "#7d8cff", soft: "#1b2040", font: "sans",
      art: "radial-gradient(50% 50% at 50% 50%, #7d8cff 0%, #2b3480 45%, #0d1020 75%)" },
    desc: { en: "A product launch page with an animated product preview, pricing toggle and sign-up.",
            ka: "პროდუქტის გვერდი ანიმირებული პრევიუთი, ფასების გადამრთველით და რეგისტრაციით." },
    features: { en: ["Product tour", "Pricing table", "Sign-up", "Blog"], ka: ["პროდუქტის ტური", "ფასები", "რეგისტრაცია", "ბლოგი"] },
  },
  {
    id: "atelier", sub: "New arrivals, free delivery in Tbilisi", name: "Atelier", type: "ecommerce", price: 3500, layout: "shop",
    cat: { en: "Fashion store", ka: "მოდის მაღაზია" },
    domain: "atelier.shop", headline: "Autumn / Winter collection", nav: ["Women", "Men", "Bag (2)"],
    look: { bg: "#f4f2ee", fg: "#121212", accent: "#121212", soft: "#e2ddd4", font: "sans",
      art: "linear-gradient(180deg, #d9d2c6, #b9ae9c)" },
    desc: { en: "A minimal clothing store with quick view, size guides, wishlists and one-page checkout.",
            ka: "მინიმალისტური მაღაზია სწრაფი ხედით, ზომების გიდით, სურვილების სიით და მარტივი შეკვეთით." },
    features: { en: ["Online payments", "Inventory", "Size guide", "Discount codes"], ka: ["ონლაინ გადახდა", "მარაგი", "ზომების გიდი", "ფასდაკლების კოდები"] },
  },
  {
    id: "glow", sub: "Facials, massage and slow mornings", name: "Glow", type: "business", price: 2200, layout: "split",
    cat: { en: "Beauty & spa", ka: "სილამაზე" },
    domain: "glow.studio", headline: "Your skin, your ritual", nav: ["Treatments", "Team", "Book"],
    look: { bg: "#f7e9ea", fg: "#45202b", accent: "#b8456a", soft: "#efd3d8", font: "serif",
      art: "radial-gradient(55% 55% at 45% 45%, #ffd6e0 0%, #e58aa5 50%, #f7e9ea 76%)" },
    desc: { en: "A soft, premium site for salons, spas and clinics, with online appointments and gift cards.",
            ka: "ნაზი, პრემიუმ საიტი სალონებისა და კლინიკებისთვის — ონლაინ ჩაწერით და სასაჩუქრე ბარათებით." },
    features: { en: ["Online booking", "Treatments", "Gift cards", "Reviews"], ka: ["ონლაინ ჩაწერა", "პროცედურები", "სასაჩუქრე ბარათები", "შეფასებები"] },
  },
  {
    id: "forge", sub: "Strength, boxing and 6am classes", name: "Forge", type: "business", price: 2400, layout: "split",
    cat: { en: "Fitness", ka: "ფიტნესი" },
    domain: "forge.fit", headline: "Train like you mean it", nav: ["Classes", "Plans", "Join"],
    look: { bg: "#0e0e0e", fg: "#f2f2f2", accent: "#d7ff3a", soft: "#1d1d1d", font: "condensed",
      art: "conic-gradient(from 210deg at 50% 50%, #d7ff3a, #0e0e0e 35%, #3d4a0b 60%, #0e0e0e)" },
    desc: { en: "A high-energy gym site with class schedules, memberships and online sign-up.",
            ka: "ენერგიული საიტი სპორტდარბაზისთვის — განრიგით, აბონემენტებით და ონლაინ რეგისტრაციით." },
    features: { en: ["Class schedule", "Memberships", "Payments", "Ads landing page"], ka: ["განრიგი", "აბონემენტები", "გადახდა", "სარეკლამო გვერდი"] },
  },
  {
    id: "nomad", sub: "Small-group tours across Georgia", name: "Nomad", type: "business", price: 2700, layout: "center",
    cat: { en: "Travel & hotels", ka: "ტურიზმი" },
    domain: "nomad.travel", headline: "Kazbegi, Svaneti, the sea", nav: ["Tours", "Stays", "Book"],
    look: { bg: "#0f3a4f", fg: "#f1f7fa", accent: "#ff9248", soft: "#1b5470", font: "sans",
      art: "linear-gradient(180deg, #8fc7dd 0%, #3a7d99 40%, #0f3a4f 100%)" },
    desc: { en: "A travel and hotel site with tour packages, itineraries, date booking and three languages.",
            ka: "ტურისტული საიტი ტურებით, მარშრუტებით, თარიღის დაჯავშნით და სამ ენაზე." },
    features: { en: ["Tour booking", "Itineraries", "Multi-language", "Reviews"], ka: ["ტურის დაჯავშნა", "მარშრუტები", "მრავალენოვანი", "შეფასებები"] },
  },
  {
    id: "lens", sub: "Portraits, weddings and editorial", name: "Lens", type: "landing", price: 900, layout: "editorial",
    cat: { en: "Portfolio", ka: "პორტფოლიო" },
    domain: "lens.photo", headline: "Light, framed.", nav: ["Work", "About", "Contact"],
    look: { bg: "#111111", fg: "#ededed", accent: "#ededed", soft: "#222222", font: "serif",
      art: "linear-gradient(200deg, #5a5a5a 0%, #1c1c1c 70%)" },
    desc: { en: "An editorial portfolio for photographers and artists, with full-screen galleries and an inquiry form.",
            ka: "პორტფოლიო ფოტოგრაფებისა და ხელოვანებისთვის — სრულეკრანიანი გალერეებით და საკონტაქტო ფორმით." },
    features: { en: ["Full-screen galleries", "Client area", "Inquiry form", "SEO"], ka: ["გალერეები", "კლიენტის გვერდი", "საკონტაქტო ფორმა", "SEO"] },
  },
  {
    id: "vertex", sub: "A bank card that thinks in real time", name: "Vertex", type: "app", price: 5900, layout: "center",
    cat: { en: "Finance / 3D", ka: "ფინანსები / 3D" },
    domain: "vertex.finance", headline: "Money, in motion", nav: ["Cards", "Business", "App"],
    look: { bg: "#05070d", fg: "#e6ebf5", accent: "#e6ebf5", soft: "#131a2a", font: "sans",
      art: "radial-gradient(45% 45% at 50% 55%, #c9d6ff 0%, #4a5f9e 35%, #05070d 72%)" },
    desc: { en: "A premium fintech site with an interactive 3D hero, live widgets and trust-building sections.",
            ka: "პრემიუმ ფინტექ საიტი ინტერაქტიული 3D-ით, ცოცხალი ვიჯეტებით და სანდოობის სექციებით." },
    features: { en: ["3D hero", "Live charts", "App download", "Multi-language"], ka: ["3D ჰირო", "ცოცხალი გრაფიკები", "აპლიკაცია", "მრავალენოვანი"] },
  },
];

export const TYPES = [
  { id: "landing", name: { en: "Landing page", ka: "ლენდინგი" }, base: 900, pages: 1, weeks: [1, 2],
    desc: { en: "One focused page for a launch, an offer or an ad campaign.", ka: "ერთი ფოკუსირებული გვერდი გაშვებისთვის, შეთავაზებისთვის ან სარეკლამო კამპანიისთვის." } },
  { id: "business", name: { en: "Company website", ka: "კომპანიის საიტი" }, base: 1900, pages: 5, weeks: [3, 4],
    desc: { en: "A full company site: home, services, about, contact and more.", ka: "სრული კომპანიის საიტი: მთავარი, სერვისები, ჩვენ შესახებ, კონტაქტი და სხვა." } },
  { id: "ecommerce", name: { en: "Online store", ka: "ონლაინ მაღაზია" }, base: 3500, pages: 8, weeks: [4, 6],
    desc: { en: "Products, cart, online payments and delivery options.", ka: "პროდუქტები, კალათა, ონლაინ გადახდა და მიწოდების არჩევანი." } },
  { id: "app", name: { en: "Web app / 3D experience", ka: "ვებ-აპი / 3D" }, base: 5500, pages: 6, weeks: [5, 8],
    desc: { en: "A custom web app or an immersive 3D experience, designed from scratch.", ka: "ინდივიდუალური ვებ-აპლიკაცია ან იმერსიული 3D გამოცდილება, ნულიდან შექმნილი." } },
];

export const PER_PAGE = 120;
export const CARE = 99;

export const FEATURES = [
  { id: "3d", name: { en: "3D hero", ka: "3D ჰირო" }, price: 1200, weeks: 1,
    desc: { en: "A real-time 3D scene on your first screen, built around your product or brand.", ka: "რეალურ დროში 3D სცენა პირველ ეკრანზე, თქვენი პროდუქტის ან ბრენდის გარშემო." } },
  { id: "ads", name: { en: "Ads campaign setup", ka: "სარეკლამო კამპანია" }, price: 700,
    desc: { en: "Strategy, first ad creatives and tracking on Google, Meta or TikTok.", ka: "სტრატეგია, პირველი სარეკლამო ვიზუალები და თრექინგი Google-ზე, Meta-ზე ან TikTok-ზე." } },
  { id: "booking", name: { en: "Booking system", ka: "დაჯავშნის სისტემა" }, price: 600,
    desc: { en: "Customers pick a time and book online. You get notified.", ka: "მომხმარებელი ირჩევს დროს და ჯავშნის ონლაინ, თქვენ იღებთ შეტყობინებას." } },
  { id: "cms", name: { en: "CMS / blog", ka: "მართვის პანელი / ბლოგი" }, price: 500,
    desc: { en: "Edit text, photos, products and posts yourself, without code.", ka: "ტექსტის, ფოტოების, პროდუქტებისა და პოსტების შეცვლა კოდის გარეშე." } },
  { id: "copy", name: { en: "Copywriting", ka: "ტექსტების წერა" }, price: 450,
    desc: { en: "We write the headlines and page copy in your voice.", ka: "სათაურებსა და გვერდების ტექსტს ჩვენ ვწერთ, თქვენი ტონით." } },
  { id: "lang", name: { en: "Extra language", ka: "დამატებითი ენა" }, price: 400,
    desc: { en: "One more full language version, with a language switch.", ka: "კიდევ ერთი სრული ენობრივი ვერსია, ენის გადამრთველით." } },
  { id: "seo", name: { en: "Advanced SEO", ka: "SEO" }, price: 350,
    desc: { en: "Technical SEO, structured data and speed tuning for search.", ka: "ტექნიკური SEO, სტრუქტურირებული მონაცემები და სისწრაფის ოპტიმიზაცია." } },
  { id: "analytics", name: { en: "Analytics dashboard", ka: "ანალიტიკა" }, price: 300,
    desc: { en: "One dashboard for visits, leads and the pages that convert.", ka: "ერთი დაფა ვიზიტებისთვის, მოთხოვნებისთვის და გვერდებისთვის, რომლებიც მუშაობს." } },
];

export const PACKAGES = {
  starter: { type: "landing", pages: 1, features: ["seo"] },
  growth: { type: "business", pages: 8, features: ["cms", "ads", "seo"] },
  premium: { type: "app", pages: 6, features: ["3d", "cms", "seo", "analytics"] },
};

export const SPEEDS = [1, 1.25, 1.5];

// Pure estimate: base + pages beyond the included ones + features, then the timeline multiplier.
export function estimate({ type, pages, feats, speed }) {
  const typ = TYPES.find((x) => x.id === type);
  const extra = Math.max(0, pages - typ.pages);
  const chosen = FEATURES.filter((f) => feats.has(f.id));
  const subtotal = typ.base + extra * PER_PAGE + chosen.reduce((s, f) => s + f.price, 0);
  const rush = speed > 1 ? Math.round(subtotal * (speed - 1)) : 0;
  const total = Math.round(subtotal * speed);
  const addWeeks = chosen.reduce((s, f) => s + (f.weeks || 0), 0) + Math.floor(extra / 6);
  const k = speed === 1.5 ? 0.6 : speed === 1.25 ? 0.8 : 1;
  const w0 = Math.max(1, Math.round((typ.weeks[0] + addWeeks) * k));
  const w1 = Math.max(w0 + 1, Math.round((typ.weeks[1] + addWeeks) * k));
  return { typ, extra, chosen, subtotal, rush, total, weeks: [w0, w1] };
}

export const fmt = (n) => "$" + n.toLocaleString("en-US");
