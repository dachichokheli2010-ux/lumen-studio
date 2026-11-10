import { createContext, useContext, useEffect, useMemo, useState } from "react";

const dict = {
  en: {
    nav: { ideas: "Ideas", services: "Services", price: "Pricing", process: "Process", faq: "FAQ", cta: "Get a price" },
    hero: {
      title: ["Websites", "people remember."],
      sub: "Design, 3D and ads for brands in Georgia and beyond. Find your style, or get a price in two minutes.",
      primary: "Get a price",
      secondary: "See ideas",
      scroll: "Scroll",
      place: "Tbilisi — worldwide",
    },
    manifesto:
      "Most websites get a glance and are gone. We design the ones that make people stop, scroll slower and pick up the phone.",
    ideas: {
      title: "Not sure what your site should look like?",
      sub: "Concept styles to start from, not client work. Every design gets rebuilt around your brand, your photos and your customers.",
      all: "All",
      open: "Open",
      use: "Start with this style",
      from: "From",
      close: "Close",
      includes: "Includes",
      drag: "Drag or scroll",
    },
    services: {
      title: "What we do",
      items: [
        ["Websites", "Custom-designed company sites, fast on every phone, with copy written to convert.", "from $1,900"],
        ["Online stores", "Shops with payments, delivery and a checkout tuned to cut abandoned carts.", "from $3,500"],
        ["3D & immersive", "Real-time 3D heroes, product viewers and scroll stories, like the one on this page.", "from $1,200"],
        ["Ads & growth", "Google, Meta and TikTok campaigns, with landing pages built for each campaign.", "from $700"],
        ["SEO & analytics", "Technical SEO, speed and dashboards that show which pages make money.", "from $350"],
        ["Care plans", "Hosting, updates, backups and a monthly improvement, so the site keeps getting better.", "$99 / month"],
      ],
    },
    builder: {
      title: "Build your package",
      sub: "Choose what you need and watch the estimate update. Send it, and we come back with a final quote.",
      packages: "Quick start",
      pkg: { starter: "Starter", growth: "Growth", premium: "Premium 3D" },
      type: "What do you need?",
      pages: "How many pages?",
      pagesHint: "Each page beyond the included ones adds $120.",
      features: "Add features",
      speed: "Timeline",
      speeds: ["Standard", "Fast +25%", "Rush +50%"],
      care: "Monthly care plan: hosting, updates, support",
      estimate: "Estimate",
      delivery: "Delivery",
      weeks: "weeks",
      perMonth: "/ month",
      style: "Style",
      send: "Send this brief",
      note: "Estimate only. The final quote follows your brief.",
      included: "incl.",
      page: "page",
      pagesWord: "pages",
      extra: "extra pages",
      rush: "Faster delivery",
    },
    process: {
      title: "From first call to launch",
      steps: [
        ["Call", "Thirty minutes about your business, your customers and the sites you admire."],
        ["Design", "A clickable prototype you can test on your phone, refined together until it feels right."],
        ["Build", "Development, 3D, payments, SEO, tested on real phones and browsers."],
        ["Launch & grow", "We go live, start the ads, and keep improving with real data."],
      ],
    },
    faq: {
      title: "Questions",
      items: [
        ["How long does a website take?", "A landing page takes 1–2 weeks, a company site 3–4 weeks, online stores and 3D projects 5–8 weeks. Rush delivery is available."],
        ["Can I edit the site myself?", "Yes. Add a CMS and you can change text, photos, products and posts without code."],
        ["Do you also run the ads?", "Yes. We set up and manage Google, Meta and TikTok campaigns and build a landing page for each one."],
        ["Do you build sites in Georgian?", "Yes. Georgian, English or several languages, with a language switch like the one on this page."],
        ["How does payment work?", "Part at the start and the rest at launch. We agree the terms in writing before work begins."],
      ],
    },
    contact: {
      title: ["Let's build", "yours."],
      sub: "Tell us about your business. We reply with ideas and a final quote.",
      name: "Name",
      email: "Email or phone",
      business: "Business or website",
      message: "What do you want to build?",
      send: "Send request",
      sending: "Sending…",
      ok: "Thank you. Your request is in, and we will reply soon.",
      mailOpened: "Your email app opened with the brief. Press send there to reach us.",
      err: "Please add your name, a way to reach you, and a few words about the project.",
      write: "Write to us",
      visit: "Studio",
    },
    briefIntro: "Hi LUMEN, I'd like:",
    footer: "Websites, 3D and ads that sell.",
    loading: "Loading the light",
  },
  ka: {
    nav: { ideas: "იდეები", services: "სერვისები", price: "ფასები", process: "პროცესი", faq: "კითხვები", cta: "ფასის გაგება" },
    hero: {
      title: ["საიტები,", "რომლებიც გამახსოვრდებათ."],
      sub: "დიზაინი, 3D და რეკლამა ბრენდებისთვის საქართველოში და მის ფარგლებს გარეთ. იპოვეთ თქვენი სტილი ან გაიგეთ ფასი ორ წუთში.",
      primary: "ფასის გაგება",
      secondary: "იდეების ნახვა",
      scroll: "ქვემოთ",
      place: "თბილისი — მთელი მსოფლიო",
    },
    manifesto:
      "საიტების უმეტესობას ერთხელ შეხედავენ და ავიწყდებათ. ჩვენ ვქმნით ისეთებს, რომლებზეც ადამიანი ჩერდება, ნელა ათვალიერებს და გირეკავთ.",
    ideas: {
      title: "არ იცით, როგორი უნდა იყოს თქვენი საიტი?",
      sub: "საწყისი კონცეფციები და არა კლიენტების პროექტები. ყოველი დიზაინი თავიდან იქმნება თქვენი ბრენდის, ფოტოებისა და მომხმარებლებისთვის.",
      all: "ყველა",
      open: "ნახვა",
      use: "ამ სტილით დაწყება",
      from: "დან",
      close: "დახურვა",
      includes: "მოიცავს",
      drag: "გადაათრიეთ ან ჩამოსქროლეთ",
    },
    services: {
      title: "რას ვაკეთებთ",
      items: [
        ["ვებსაიტები", "ინდივიდუალური დიზაინის კომპანიის საიტები, სწრაფი ყველა ტელეფონზე, გაყიდვაზე ორიენტირებული ტექსტით.", "$1,900-დან"],
        ["ონლაინ მაღაზიები", "მაღაზიები გადახდით, მიწოდებით და შეკვეთის მარტივი პროცესით.", "$3,500-დან"],
        ["3D და ინტერაქცია", "რეალურ დროში 3D, პროდუქტის 3D ხედი და სქროლზე აგებული ისტორიები, როგორც ამ გვერდზე.", "$1,200-დან"],
        ["რეკლამა და ზრდა", "Google, Meta და TikTok კამპანიები და ცალკე გვერდი თითოეული კამპანიისთვის.", "$700-დან"],
        ["SEO და ანალიტიკა", "ტექნიკური SEO, სისწრაფე და დაფები, რომლებიც აჩვენებს, რომელი გვერდი მოაქვს შემოსავალი.", "$350-დან"],
        ["მხარდაჭერა", "ჰოსტინგი, განახლებები, ბექაპები და ყოველთვიური გაუმჯობესება.", "$99 / თვე"],
      ],
    },
    builder: {
      title: "შექმენით თქვენი პაკეტი",
      sub: "აირჩიეთ, რა გჭირდებათ და ნახეთ ფასი მყისიერად. გამოგვიგზავნეთ და მიიღებთ საბოლოო შეთავაზებას.",
      packages: "სწრაფი არჩევანი",
      pkg: { starter: "საწყისი", growth: "ზრდა", premium: "პრემიუმ 3D" },
      type: "რა გჭირდებათ?",
      pages: "რამდენი გვერდი?",
      pagesHint: "ყოველი დამატებითი გვერდი — $120.",
      features: "დამატებითი ფუნქციები",
      speed: "ვადა",
      speeds: ["სტანდარტული", "სწრაფი +25%", "სასწრაფო +50%"],
      care: "ყოველთვიური მხარდაჭერა: ჰოსტინგი, განახლებები, დახმარება",
      estimate: "სავარაუდო ფასი",
      delivery: "ვადა",
      weeks: "კვირა",
      perMonth: "/ თვე",
      style: "სტილი",
      send: "მოთხოვნის გაგზავნა",
      note: "ეს არის სავარაუდო ფასი. საბოლოო შეთავაზება — თქვენი მოთხოვნის შემდეგ.",
      included: "შედის",
      page: "გვერდი",
      pagesWord: "გვერდი",
      extra: "დამატებითი გვერდი",
      rush: "სწრაფი მიწოდება",
    },
    process: {
      title: "პირველი ზარიდან გაშვებამდე",
      steps: [
        ["ზარი", "ოცდაათი წუთი თქვენს ბიზნესზე, მომხმარებლებზე და საიტებზე, რომლებიც მოგწონთ."],
        ["დიზაინი", "ინტერაქტიული პროტოტიპი, რომელსაც ტელეფონზე გამოცდით და ერთად დავხვეწთ."],
        ["აწყობა", "დეველოპმენტი, 3D, გადახდები, SEO — შემოწმებული რეალურ ტელეფონებზე."],
        ["გაშვება და ზრდა", "ვუშვებთ საიტს, ვრთავთ რეკლამას და ვაუმჯობესებთ რეალური მონაცემებით."],
      ],
    },
    faq: {
      title: "კითხვები",
      items: [
        ["რა დრო სჭირდება საიტს?", "ლენდინგი 1–2 კვირა, კომპანიის საიტი 3–4 კვირა, ონლაინ მაღაზია და 3D პროექტები 5–8 კვირა. შესაძლებელია სასწრაფო შესრულებაც."],
        ["შემიძლია საიტის თავად რედაქტირება?", "დიახ. მართვის პანელით ტექსტს, ფოტოებს და პროდუქტებს კოდის გარეშე შეცვლით."],
        ["რეკლამასაც თქვენ მართავთ?", "დიახ. ვაწყობთ და ვმართავთ Google, Meta და TikTok კამპანიებს და თითოეულისთვის ვქმნით ცალკე გვერდს."],
        ["აკეთებთ საიტებს ქართულად?", "დიახ. ქართულად, ინგლისურად ან რამდენიმე ენაზე — ენის გადამრთველით, როგორც ამ გვერდზე."],
        ["როგორ ხდება გადახდა?", "ნაწილი დასაწყისში, დანარჩენი — გაშვებისას. პირობებს წერილობით ვთანხმდებით სამუშაოს დაწყებამდე."],
      ],
    },
    contact: {
      title: ["მოდით, შევქმნათ", "თქვენი."],
      sub: "მოგვიყევით თქვენს ბიზნესზე. გიპასუხებთ იდეებით და საბოლოო ფასით.",
      name: "სახელი",
      email: "ელფოსტა ან ტელეფონი",
      business: "ბიზნესი ან ვებსაიტი",
      message: "რისი შექმნა გსურთ?",
      send: "გაგზავნა",
      sending: "იგზავნება…",
      ok: "გმადლობთ. მოთხოვნა მიღებულია, მალე გიპასუხებთ.",
      mailOpened: "გაიხსნა თქვენი ელფოსტა მოთხოვნით. დააჭირეთ გაგზავნას.",
      err: "გთხოვთ, მიუთითოთ სახელი, საკონტაქტო და რამდენიმე სიტყვა პროექტზე.",
      write: "მოგვწერეთ",
      visit: "სტუდია",
    },
    briefIntro: "გამარჯობა LUMEN, მსურს:",
    footer: "საიტები, 3D და რეკლამა, რომელიც ყიდის.",
    loading: "სინათლე იტვირთება",
  },
};

const I18n = createContext(null);

function initialLang() {
  try {
    const saved = localStorage.getItem("lumen-lang");
    if (saved === "en" || saved === "ka") return saved;
  } catch {}
  return navigator.language?.startsWith("ka") ? "ka" : "en";
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(initialLang);
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem("lumen-lang", lang); } catch {}
  }, [lang]);
  const value = useMemo(() => ({ lang, setLang, t: dict[lang] }), [lang]);
  return <I18n.Provider value={value}>{children}</I18n.Provider>;
}

export const useI18n = () => useContext(I18n);
