export type HeroSlide = {
  id: string;
  alt: string;
  desktop: string;
  mobile: string;
  desktopObjectPosition?: string;
  mobileObjectPosition?: string;
};

export const heroImages: HeroSlide[] = [
  {
    id: "one",
    alt: "Machine Vision and Intelligence Lab showcase",
    desktop: "/heroimages/desktop/one.png",
    mobile: "/heroimages/mobile/one.png",
  },
  {
    id: "two",
    alt: "MVI Lab innovation and research",
    desktop: "/heroimages/desktop/two.png",
    mobile: "/heroimages/mobile/two.png",
  },
];

export const HERO_IMAGE_DIRS = {
  desktop: "/heroimages/desktop",
  mobile: "/heroimages/mobile",
} as const;

export const HERO_ART_SPECS = {
  desktop: { ratio: "2 / 1", example: "2400 × 1200 px" },
  mobile: { ratio: "3 / 4", example: "1080 × 1440 px" },
} as const;
