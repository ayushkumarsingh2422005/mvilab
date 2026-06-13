export const site = {
  title: "Machine Vision and Intelligence Lab",
  subtitle: "Innovation through Vision Technology",
  shortName: "MVI Lab",
  shortSubtitle: "Vision Technology",
  url: "https://mvilab.in",
  contact: "contact@mvilab.in",
} as const;

export const siteLinks = {
  official: "https://mvilab.in",
  digicraft: "https://digicraft.one",
  digicraftLogo: "https://data.digicraft.one/Logo/Main.png",
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
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
] as const;
