export const site = {
  title: "Machine Vision and Intelligence Lab",
  subtitle: "Innovation through Vision Technology",
  shortName: "MVI Lab",
  shortSubtitle: "Innovation by Vision Technology",
  url: "https://mvilab.in",
  contact: "contact@mvilab.in",
} as const;

export const siteLinks = {
  nit: "https://nitjsr.ac.in",
  official: "https://mvilab.in",
  digicraft: "https://digicraft.one",
  digicraftLogo: "https://data.digicraft.one/Logo/Main.png",
} as const;

export const welcomeSection = {
  heading: "Welcome to MVI Lab",
  lead: site.subtitle,
  body:
    "The Machine Vision and Intelligence Lab at NIT Jamshedpur advances research in computer vision, deep learning, and intelligent systems — bridging academic innovation with real-world applications in industry and society.",
} as const;

export const studentPortalPath = "/portal" as const;

export const footerContact = {
  phone: "+91 9102197734",
  phoneHref: "tel:+919102197734",
  email: "koushlendra.cse@nitjsr.ac.in",
  addressLines: [
    "National Institute of Technology,",
    "Adityapur, Jamshedpur,",
    "Jharkhand 831014",
  ],
  mapHref:
    "https://maps.google.com/?q=National+Institute+of+Technology+Jamshedpur+831014",
} as const;

export const navLinks = [
  { href: "/research", label: "Research" },
  { href: "/member", label: "Member" },
  { href: "/achievements", label: "Achievements" },
  { href: "/about", label: "About" },
  { href: "/information", label: "Information" },
  { href: "/notices", label: "News" },
] as const;
