import type { IconType } from "react-icons";
import { TfiEye, TfiLayers, TfiLightBulb, TfiUser } from "react-icons/tfi";

export const aboutHero = {
  eyebrow: "National Institute of Technology Jamshedpur",
  titleLine1: "We teach machines",
  titleLine2: "to see & understand",
  lead:
    "MVI Lab sits at the intersection of computer vision, deep learning, and intelligent systems — turning pixels into insight for research, industry, and society.",
} as const;

export const aboutStory = {
  heading: "Born from curiosity, built for impact",
  paragraphs: [
    "The Machine Vision and Intelligence Lab grew out of a simple conviction: visual data is everywhere, but meaning is still hard-won. From factory floors to field surveys, from medical imaging to autonomous systems, the ability to interpret what cameras capture defines the next generation of intelligent technology.",
    "At NIT Jamshedpur, we combine rigorous research with hands-on experimentation. Students and faculty work side by side on detection pipelines, neural architectures, and deployable prototypes — not as abstract exercises, but as tools that can genuinely help people and organisations.",
    "Our lab culture emphasises openness, reproducibility, and collaboration across departments. Whether you are exploring a thesis idea or partnering on an industrial pilot, MVI Lab is a place where vision meets execution.",
  ],
} as const;

export const aboutMission = {
  title: "Mission",
  body: "Advance machine vision and AI research while training the next generation of engineers who can design, validate, and deploy intelligent visual systems in the real world.",
} as const;

export const aboutVision = {
  title: "Vision",
  body: "A nationally recognised centre of excellence where academic discovery and applied innovation continuously reinforce each other — from publication to prototype to practice.",
} as const;

export type AboutPillar = {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  accent: string;
};

export const aboutPillars: AboutPillar[] = [
  {
    id: "see",
    title: "Perceive",
    description: "Cameras, sensors, and preprocessing pipelines that turn raw visual streams into reliable inputs.",
    icon: TfiEye,
    accent: "from-primary/20 to-primary-light",
  },
  {
    id: "learn",
    title: "Learn",
    description: "Deep models and learning frameworks tuned for detection, segmentation, and multimodal reasoning.",
    icon: TfiLayers,
    accent: "from-secondary/25 to-primary-light",
  },
  {
    id: "innovate",
    title: "Innovate",
    description: "Research that moves from idea to experiment to publication — and often to working demos.",
    icon: TfiLightBulb,
    accent: "from-accent/40 to-primary-light",
  },
  {
    id: "grow",
    title: "Grow people",
    description: "Mentorship, projects, and industry exposure so students leave with portfolio-ready skills.",
    icon: TfiUser,
    accent: "from-primary-light to-white",
  },
];

export type AboutMilestone = {
  year: string;
  title: string;
  detail: string;
};

export const aboutMilestones: AboutMilestone[] = [
  {
    year: "Foundation",
    title: "Lab establishment",
    detail: "MVI Lab formed at NIT Jamshedpur to consolidate vision and AI research under one collaborative umbrella.",
  },
  {
    year: "Research",
    title: "Publications & prototypes",
    detail: "Peer-reviewed work and functional prototypes across inspection, analytics, and intelligent automation.",
  },
  {
    year: "Collaboration",
    title: "Industry & institute partners",
    detail: "Joint projects, workshops, and technology transfers with partners who need vision intelligence in the field.",
  },
  {
    year: "Today",
    title: "A living research community",
    detail: "Active students, alumni, and faculty advancing open problems in machine vision — and sharing what we learn publicly.",
  },
];

export const aboutStats = [
  { value: "6+", label: "Core research themes" },
  { value: "Vision", label: "From lab to deployment" },
  { value: "NIT JSR", label: "Home campus" },
  { value: "Open", label: "Collaboration welcome" },
] as const;

export const aboutQuote = {
  text: "Intelligence begins when a system can not only capture the world, but interpret it with purpose.",
  attribution: "MVI Lab ethos",
} as const;

export const aboutFounder = {
  name: "Dr. Koushlendra Kumar Singh",
  role: "Founder, Machine Vision and Intelligence Lab",
  department: "Department of Computer Science & Engineering",
  affiliation: "National Institute of Technology Jamshedpur",
  email: "koushlendra.cse@nitjsr.ac.in",
  image: "/kksir.png",
  imageAlt: "Dr. Koushlendra Kumar Singh, founder of MVI Lab",
  links: [
    {
      id: "google-scholar",
      label: "Google Scholar",
      href: "https://scholar.google.co.in/citations?user=9amXZ1gAAAAJ&hl=en",
    },
    {
      id: "website",
      label: "Personal website",
      href: "http://koushlendra.me/",
    },
    {
      id: "publons",
      label: "Web of Science Researcher Profile",
      href: "https://publons.com/researcher/3136364/dr-koushlendra-kumar-singh/",
    },
    {
      id: "orcid",
      label: "ORCID",
      href: "https://orcid.org/0000-0002-5614-6098",
    },
    {
      id: "vidwan",
      label: "Vidwan profile",
      href: "https://vidwan.inflibnet.ac.in/profile/98513",
    },
    {
      id: "nitjsr",
      label: "NIT Jamshedpur faculty profile",
      href: "https://www.nitjsr.ac.in/people/profile/CS103",
    },
  ],
  paragraphs: [
    "Dr. Koushlendra Kumar Singh established MVI Lab to create a dedicated home for machine vision and intelligent systems research at NIT Jamshedpur — a place where theory, experimentation, and real-world deployment are pursued together.",
    "Under his guidance, the lab has grown into an active research community spanning deep learning, visual inspection, intelligent automation, and student-led innovation. He mentors researchers to ask rigorous questions, build reproducible systems, and carry their work from prototype to impact.",
    "His vision is simple: machines that perceive with precision, reason with clarity, and serve people through dependable intelligent systems.",
  ],
} as const;
